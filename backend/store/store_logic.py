import math
import os.path
import pathlib
import sys
from io import BytesIO

from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile

from auxiliaries.auxiliaries_methods import get_logger

logger = get_logger(__name__)

def resize_image(img, max_width, max_height):
    """
    Changing the size of image with saving proportions.

    :param img: Object img Pillow.
    :param max_width: Max width of image.
    :param max_height: Max height of image.
    :return: Changed image.
    """
    img_ratio = img.width / img.height
    new_width, new_height = img.width, img.height

    if img.width > max_width:
        new_width = max_width
        new_height = int(new_width / img_ratio)

    if new_height > max_height:
        new_height = max_height
        new_width = int(new_height * img_ratio)

    return img.resize((new_width, new_height), Image.LANCZOS)

def compress_image(image, format_ = 'webp', content_type='image/webp', in_memory=True):
    try:
        max_kb = 100
        min_kb = 50
        max_width = 800
        max_height = 600

        tmp = Image.open(image)
        tmp = resize_image(tmp, max_width, max_height)
        quality = 90
        step = 10
        file_size = math.inf
        tmp_path = 'temp.webp'

        while file_size > max_kb * 1024 and quality > 10:
            print('progress: file_size=', file_size)
            tmp.save(tmp_path, 'webp', quality=quality)
            file_size = os.path.getsize(tmp_path)
            if file_size > max_kb * 1024:
                quality -= step
                print('quality: ', quality)
                if quality < 10:
                    quality = 5
                else:
                    break

        if hasattr(image, 'name'):
            image_name = image.name.split(".")[0]
        else:
            image_name = image.split(".")[0]
        full_image_name = f'{image_name}.{format_}'
        *rest, name = str(image).split('/')
        new_image_path = "/".join(rest)
        output_path = os.path.join(new_image_path, full_image_name)

        def save_in_memory(f, q, img_path, content_tp):
            out_to_stream = BytesIO()
            tmp.save(out_to_stream, format=f, quality=q)
            out_to_stream.seek(0)
            return InMemoryUploadedFile(
                out_to_stream, 'ImageField',
                img_path,
                content_tp,
                sys.getsizeof(out_to_stream),
                None
            )

        if file_size < min_kb * 1024:
            quality += step
            if quality > 100:
                quality = 100
            if in_memory:
                save_in_memory(f=format_, q=quality, img_path=output_path, content_tp='image/webp')
            else:
                tmp.save(output_path, 'webp', quality=quality)
        else:
            if in_memory:
                save_in_memory(f=format_, q=quality, img_path=output_path, content_tp='image/webp')
            else:
                tmp.save(output_path, 'webp', quality=quality)

    except Exception as e:
        logger.error(msg=f"{e.args}", exc_info=True)


if __name__ == '__main__':
    # img = input('Enter a path of img: ', )
    compress_image('/Users/pavelbeard/Downloads/Para timshee/1/NNM08671.jpg', in_memory=False)