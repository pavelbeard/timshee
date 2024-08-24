import logging

def get_logger(__name__):
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    return logger


