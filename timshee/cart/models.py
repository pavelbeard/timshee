from auxiliaries.auxiliaries_methods import calculate_discount
from django.contrib.auth.models import User
from django.db import models
from store.models import ItemSizeColor


# Create your models here.


class Cart(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"


class CartItem(models.Model):
    # had to write obviously
    id = models.BigAutoField(primary_key=True)
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE, verbose_name="Корзина")
    item = models.ForeignKey(ItemSizeColor, on_delete=models.CASCADE, verbose_name="Товар")
    quantity_in_cart = models.PositiveIntegerField(default=1, verbose_name="Количество")
    date_added = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def __str__(self):
        return f"{self.item} - {self.quantity_in_cart} - {self.cart}"

    @classmethod
    def add_item(cls, cart, item, quantity=1):
        cart_item, created = cls.objects.get_or_create(cart=cart, item=item)
        if not created:
            cart_item.quantity_in_cart += quantity
        else:
            cart_item.quantity_in_card = quantity

        cart_item.save()

    @classmethod
    def remove_item(cls, cart, item, quantity=1):
        try:
            cart_item = cls.objects.get(cart=cart, item=item)
            if cart_item.quantity_in_card > quantity:
                cart_item.quantity_in_card -= quantity
                cart_item.save()
            elif cart_item.quantity_in_card == quantity:
                cart_item.delete()
        except cls.DoesNotExist:
            print("Item not found")





    def total_price(self):
        discount = self.item.discount
        price = self.item.price
        quantity = self.quantity_in_cart

        return calculate_discount(price, quantity, discount)
