"""Utility functions to fetch data from external APIs.

This module demonstrates how to use asynchronous HTTP calls with
`httpx` to gather blockchain and price data. In a production app you
would likely cache these results and handle API errors more robustly.
"""

import os
import httpx
from typing import Dict

COINGECKO_API = "https://api.coingecko.com/api/v3"
ETHERSCAN_API = "https://api.etherscan.io/api"

# Etherscan requires an API key. It can be stored in an environment variable.
ETHERSCAN_TOKEN = os.getenv("ETHERSCAN_TOKEN", "")

async def fetch_price(symbol: str) -> float:
    """Fetch the latest USD price for a symbol using CoinGecko."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{COINGECKO_API}/simple/price", params={"ids": symbol, "vs_currencies": "usd"})
        resp.raise_for_status()
        return resp.json()[symbol]["usd"]

async def fetch_supply(contract: str) -> float:
    """Fetch total supply for an ERC20 token from Etherscan."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(ETHERSCAN_API, params={
            "module": "stats",
            "action": "tokensupply",
            "contractaddress": contract,
            "apikey": ETHERSCAN_TOKEN,
        })
        resp.raise_for_status()
        data = resp.json()
        return float(data.get("result", 0)) / 1e6  # USDC uses 6 decimals

async def fetch_mint_burn(contract: str) -> Dict[str, float]:
    """Fetch recent mint and burn volumes. Here we simply return zero as a placeholder."""
    # A real implementation would query transfer events.
    return {"mint": 0.0, "burn": 0.0}
