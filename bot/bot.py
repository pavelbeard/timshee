import asyncio
import logging
import os
import sys

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode

token = os.getenv("TIMSHEE_CLOTHES_BOT")
dp = Dispatcher()


async def run_bot():
    bot = Bot(token=token, parse_mode=ParseMode.HTML)
    await dp.start_polling(bot)


def main():
    asyncio.run(run_bot())


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    main()
