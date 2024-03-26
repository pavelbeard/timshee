from rest_framework import serializers

from .models import Country, City, Address, Order, CountryPhoneCode


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"


class CountryPhoneCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryPhoneCode
        fields = "__all__"




class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


