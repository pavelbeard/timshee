import random
import string


def calculate_discount(discount, price, quantity):
    if discount == 0:
        return quantity * price
    else:
        return quantity * (price - (price * (discount / 100)))


def generate_random_symbols() -> list:
    chars = []
    for i in range(3):
        chars.append(random.choice(string.ascii_uppercase))

    return chars

