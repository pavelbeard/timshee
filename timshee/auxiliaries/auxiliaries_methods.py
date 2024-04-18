def calculate_discount(discount, price, quantity):
    if discount == 0:
        return quantity * price
    else:
        return quantity * (price - (price * (discount / 100)))
