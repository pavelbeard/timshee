import copy

from django.contrib.sessions.models import Session
from django.db.models import Q
from django.utils import timezone
from auxiliaries.auxiliaries_methods import get_logger

from . import models

logger = get_logger(__name__)

def update_shipping_info(rq, get_serializer, **kwargs):
    try:
        data = copy.copy(rq.data)
        user = None
        session_obj = None

        if rq.user.is_authenticated:
            data["user"] = rq.user.id
            user = rq.user
        else:
            session_obj = Session.objects.get(session_key=rq.COOKIES['sessionid'])

        data["updated_at"] = timezone.now()
        order = models.Order.objects.get(second_id=kwargs.get('second_id'))

        if shipping_data := data.get('shipping_data', None):
            if shipping_data.get('first_name', None):
                province = models.Province.objects.filter(
                    id=shipping_data.pop('province')).first()
                country_phone_code = models.CountryPhoneCode.objects.filter(
                    country_id=shipping_data.pop('phone_code')).first()
                shipping_address_id = shipping_data.get('id')
                address = models.Address.objects.filter(Q(id=shipping_address_id) | Q(session=session_obj) | Q(user=user))
                if address.exists():
                    shipping_data_session = shipping_data.pop('session')
                    updated_address = address.first()
                    updated_address.session = Session.objects.filter(session_key=shipping_data_session['session_key']).first()
                    updated_address.province = province
                    updated_address.country_phone_code = country_phone_code
                    for k, v in shipping_data.items():
                        setattr(updated_address, k, v)

                    updated_address.save()

                    data['shipping_address'] = int(shipping_address_id or updated_address.id)
                else:
                    address = models.Address.objects.create(
                        **shipping_data,
                        province=province,
                        phone_code=country_phone_code,
                        user=user,
                        session=session_obj,
                    )
                    data['shipping_address'] = int(address.id)
            elif shipping_data.get('price', None):
                shipping_method_id = shipping_data.get('id')
                shipping_method = models.ShippingMethod.objects.filter(id=shipping_method_id)
                data['shipping_method'] = shipping_method_id or shipping_method.first().id

        serializer = get_serializer(data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.data

        if data.get('shipping_address', None):
            order.shipping_address_id = data.get('shipping_address')
        elif data.get('shipping_method', None):
            order.shipping_method_id = data.get('shipping_method')

        order.save()

        return data
    except Exception as e:
        logger.exception(msg=f'Something went wrong... in {update_shipping_info.__name__}', exc_info=e)
        return None
