from django import forms
from django.forms import BaseModelFormSet, modelformset_factory

from order.models import Province


class ProvinceForm(forms.ModelForm):
    class Meta:
        model = Province
        fields = '__all__'


class ProvinceBaseFormSet(BaseModelFormSet):
    def __init__(self, *args, **kwargs):
        super(ProvinceBaseFormSet, self).__init__(*args, **kwargs)
        self.queryset = Province.objects.none()


ProvinceFormSet = modelformset_factory(
    Province, form=ProvinceForm, formset=ProvinceBaseFormSet, extra=3, fields='__all__', can_delete=True
)