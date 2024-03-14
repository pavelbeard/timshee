import logging
import os
import subprocess
import sys

SERVER_ADDRESS = os.getenv("SERVER_ADDRESS", "10.1.1.1")
SERVER_PORT = os.getenv("SERVER_PORT", 8112)


def call_django_functions(args, post_args: list | tuple) -> None:
    _args = args + post_args
    p = subprocess.Popen(_args)
    p.communicate()


def check_db(args, post_args: list | tuple, db: str, seconds: int = 0, attempts: int = 5) -> bool:
    _args = args + post_args
    _args.append(db)

    if seconds > 0:
        _args += ["--seconds", seconds]
    if attempts > 0:
        _args += ["--attempts", attempts]

    p = subprocess.Popen(_args)
    p.communicate()

    exit_code = p.returncode

    logging.info(msg=f"Task has returned exit code: {exit_code}")

    return exit_code == 0


def main():
    pre_args = ["python", os.path.join(os.getenv("APP_HOME")), "manage.py"]
    result1 = check_db(pre_args, post_args=["checkdb", "--database"], db="default")

    pass


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    main()
