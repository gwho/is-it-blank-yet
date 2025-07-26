"""FastAPI application serving stablecoin data.

FastAPI is a modern, fast (high-performance) web framework for building
APIs with Python 3.7+. It uses Python type hints to validate requests and
responses. Here we define a couple of endpoints that the frontend can
call to retrieve stablecoin information in JSON format.
"""

from fastapi import FastAPI
import asyncio

from .models import StablecoinData
from . import fetch

app = FastAPI(title="Stablecoin Tracker")

# Example contract addresses for major stablecoins on Ethereum
STABLECOINS = {
    "usd-coin": {
        "name": "USDC",
        "contract": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "decimals": 6,
    },
    "tether": {
        "name": "USDT",
        "contract": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "decimals": 6,
    },
}

@app.get("/stablecoins", response_model=list[StablecoinData])
async def get_stablecoins() -> list[StablecoinData]:
    """Return data for supported stablecoins.

    This endpoint gathers price and supply data asynchronously, then
    determines if the price deviates from $1 by more than 1% (simple
    depegging logic).
    """
    tasks = []
    for symbol, meta in STABLECOINS.items():
        tasks.append(_build_data(symbol, meta))
    return await asyncio.gather(*tasks)

async def _build_data(symbol: str, meta: dict) -> StablecoinData:
    """Helper function to construct StablecoinData for one token."""
    price, supply = await asyncio.gather(
        fetch.fetch_price(symbol),
        fetch.fetch_supply(meta["contract"]),
    )
    mints = await fetch.fetch_mint_burn(meta["contract"])
    depeg = abs(price - 1.0) > 0.01
    return StablecoinData(
        name=meta["name"],
        price=price,
        circulating_supply=supply,
        mint_volume=mints["mint"],
        burn_volume=mints["burn"],
        depeg_flag=depeg,
    )
