import logging
import os
import subprocess
import sys

SERVER_ADDRESS = os.getenv("SERVER_ADDRESS", "0.0.0.0")
SERVER_PORT = os.getenv("SERVER_PORT", 8112)
DJANGO_SETTINGS_DEBUG_MODE = os.getenv("DJANGO_SETTINGS_DEBUG_MODE", 1)


def call_django_functions(args, post_args: list | tuple) -> None:
    _args = args + post_args
    p = subprocess.Popen(_args)
    p.communicate()


def check_db(args, post_args: list | tuple, db: str, seconds: int = 0, attempts: int = 5) -> bool:
    _args = args + post_args
    _args.append(db)

    if seconds > 0:
        _args += ["--seconds", f"{seconds}"]
    if attempts > 0:
        _args += ["--attempts", f"{attempts}"]

    p = subprocess.Popen(_args)
    p.communicate()

    exit_code = p.returncode

    logging.info(msg=f"Task has returned exit code: {exit_code}")

    return exit_code == 0


def main():
    pre_args = ["python", "manage.py"]

    if check_db(pre_args, post_args=["checkdb", "--database"], db="default"):
        call_django_functions(pre_args, ["migrate"])
        call_django_functions(pre_args, ["createsuperuser",
                                         "--username", os.getenv("DJANGO_SUPERUSER_USERNAME", "admin"),
                                         "--noinput",
                                         "--email", os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")])
        call_django_functions(pre_args, ["collectstatic",
                                         "--noinput",
                                         "--clear"])

        # p = subprocess.Popen(["python", "-c", "while True: pass"])
        p = subprocess.Popen(["uvicorn",
                              "timshee.asgi:application",
                              "--host", f"{SERVER_ADDRESS}",
                              "--port", f"{SERVER_PORT}"
                              ])
        p.communicate()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    main()
