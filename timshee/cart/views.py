from rest_framework import status, permissions
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import service


# Create your views here.

class CartAPIView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = [JWTAuthentication]
    allowed_methods = ("GET", "POST", "PUT", "DELETE", "OPTIONS")

    def get(self, request, *args, **kwargs):
        cart = service.Cart(request)
        data = {
            "data": list(cart.__iter__()),
            "total_quantity": cart.get_total_quantity(),
            "total_price": cart.get_total_price(),
            "order_id": cart.get_order_id() or "",
        }
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        cart = service.Cart(request)

        cart.add_item(
            item_id=data["item_id"],
            size_id=data["size_id"],
            color_id=data["color_id"],
            quantity=data["quantity"],
        )
        data = {
            "data": list(cart.__iter__()) or [],
            "total_quantity": cart.get_total_quantity() or 0,
            "total_price": cart.get_total_price() or 0,
            "order_id": cart.get_order_id() or "",
        }
        return Response(data, status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        data = request.data
        cart = service.Cart(request)

        cart.change_quantity(
            stock_id=data["stock_id"],
            quantity=data["quantity"],
            increase=data["increase"]
        )

        data = {
            "data": list(cart.__iter__()) or [],
            "total_quantity": cart.get_total_quantity() or 0,
            "total_price": cart.get_total_price() or 0,
            "order_id": cart.get_order_id() or "",
        }
        return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        cart = service.Cart(request)

        if "remove" in request.data:
            cart.remove_item(stock_id=request.data["stock_id"])
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif "clear" in request.data:
            cart.clear()
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif "clear_by_has_ordered" in request.data:
            cart.clear(has_ordered=True)
            return Response(status=status.HTTP_204_NO_CONTENT)
