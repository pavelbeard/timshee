from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.exceptions import InvalidToken

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }

    def save(self, **kwargs):
        username = self.validated_data['username']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError("Passwords don't match.")

        if User.objects.filter(email=username).exists():
            raise serializers.ValidationError("User already exists.")

        user = User(username=username, email=username, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()

        return user


class SigninSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})


class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken("There isn't a refresh token in the cookies.")
