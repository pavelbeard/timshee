import os.path
import pathlib
import sys
from io import BytesIO

from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile

from auxiliaries.auxiliaries_methods import get_logger

logger = get_logger(__name__)

def compress_image(image, format_ = 'webp', quality=55, content_type='image/webp', in_memory=True):
    try:
        tmp = Image.open(image)
        image_temp = tmp.convert('RGB')
        output_to_stream = BytesIO()
        if hasattr(image, 'name'):
            image_name = image.name.split(".")[0]
        else:
            image_name = image.split(".")[0]
        full_image_name = f'{image_name}.{format_}'

        if in_memory:
            image_temp.save(output_to_stream, format=format_, quality=quality)
            output_to_stream.seek(0)
            return InMemoryUploadedFile(
                output_to_stream, 'ImageField',
                full_image_name,
                content_type,
                sys.getsizeof(output_to_stream),
                None
            )
        else:
            path = os.path.join(os.path.curdir, full_image_name)
            image_temp.save(path, format=format_, quality=quality)
    except Exception as e:
        logger.error(msg=f"{e.args}", exc_info=True)


if __name__ == '__main__':
    # img = input('Enter a path of img: ', )
    compress_image('/Users/pavelbeard/Downloads/Para timshee/1/NNM08671.jpg', in_memory=False)