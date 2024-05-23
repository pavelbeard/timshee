from rest_framework import status, permissions
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from . import service


# Create your views here.

class CartAPIView(APIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ("GET", "POST", "PUT", "DELETE", "OPTIONS")

    def get(self, request, *args, **kwargs):
        cart = service.Cart(request)
        return Response({
            "data": list(cart.__iter__()),
            "total_quantity": cart.get_total_quantity(),
            "total_price": cart.get_total_price(),
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        cart = service.Cart(request)

        stock_id = cart.add_item(
            item_id=data["item_id"],
            size_id=data["size_id"],
            color_id=data["color_id"],
            quantity=data["quantity"],
        )

        return Response({
            "detail": "item has been added",
            "quantity": cart.__getitem__(str(stock_id))['quantity'],
            "cart_item": cart.__getitem__(str(stock_id))['stock'],
        },
            status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        data = request.data
        cart = service.Cart(request)
        stock_id = str(data["stock_id"])

        if cart[stock_id]:
            cart.change_quantity(
                stock_id=data["stock_id"],
                quantity=data["quantity"],
                increase=data["increase"]
            )

            quantity = cart.__getitem__(str(stock_id)).get('quantity')
            stock = cart.__getitem__(str(stock_id)).get('stock')

            if quantity and stock:
                return Response({
                    "detail": f"item's quantity has been {"increased" if not data['increase'] else "decreased"}",
                    "quantity": quantity,
                    "stock": stock
                },
                    status=status.HTTP_200_OK)

        return Response({
            "detail": f"stock id {data['stock_id']} not exists"
        },
            status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, *args, **kwargs):
        cart = service.Cart(request)

        if "remove" in request.data:
            cart.remove_item(stock_id=request.data["stock_id"])

            return Response({
                "detail": "item has been removed"
            },
                status=status.HTTP_204_NO_CONTENT)
        elif "clear" in request.data:
            cart.clear()
            return Response({
                "detail": "cart has been removed"
            },
                status=status.HTTP_204_NO_CONTENT)
        elif "clear_by_has_ordered" in request.data:
            cart.clear(has_ordered=True)
            return Response({
                "detail": "cart has been removed by reason: order has been paid"
            },
                status=status.HTTP_204_NO_CONTENT)
        if not cart[str(request.data.get("stock_id"))]:
            return Response({
                "detail": f"stock id {request['data']} not exists"
            },
                status=status.HTTP_204_NO_CONTENT)
