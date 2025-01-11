from loguru import logger
import sys

def configure_logger():
    """
    Configures Loguru logger with standard settings.
    """
    logger.remove()  # Remove default logger
    logger.add(sys.stdout, format="{time} | {level} | {message}", level="DEBUG")
    logger.add("logs/app.log", rotation="10 MB", retention="10 days", compression="zip", format="{time} | {level} | {message}")

configure_logger()