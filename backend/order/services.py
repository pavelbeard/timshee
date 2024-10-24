def letter_to_number(char):
    if char.isalpha():
        return ord(char.upper()) - ord('A') + 1
    else:
        return int(char)


def letters_to_numbers(s):
    return [letter_to_number(char) for char in s]


def order_number(s):
    numbers = letters_to_numbers(s)
    return "".join([str(num) for num in numbers])[:8]
