
import time
from typing import Dict, Tuple
from fastapi import HTTPException
from loguru import logger

# Rate-limit configuration
MAX_TOKENS = 50        # Maximum number of requests allowed
REFILL_RATE = 0.1      # Tokens refilled per second (0.1 = 1 token every 10 seconds)
rate_limit_store: Dict[str, Tuple[float, float]] = {}  # {client_ip: (tokens, last_timestamp)}

def check_rate_limit(client_ip: str):
    """
    Implements a simple token-bucket rate limiting algorithm.
    Raises HTTPException if the client has exceeded the rate limit.
    """
    now = time.time()
    tokens, last_ts = rate_limit_store.get(client_ip, (MAX_TOKENS, now))

    # Refill tokens based on elapsed time
    elapsed = now - last_ts
    refill_amount = elapsed * REFILL_RATE
    tokens = min(MAX_TOKENS, tokens + refill_amount)

    if tokens < 1:
        # No tokens available; rate limit exceeded
        logger.warning(f"Rate limit reached for IP={client_ip}")
        raise HTTPException(status_code=429, detail="Too Many Requests. Please slow down.")

    # Use 1 token
    tokens -= 1
    rate_limit_store[client_ip] = (tokens, now)