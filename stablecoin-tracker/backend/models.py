"""Data models for the stablecoin tracker backend.

This file uses Pydantic's BaseModel to define the shape of the JSON
responses returned by the API.
"""

from pydantic import BaseModel
from typing import Optional

class StablecoinData(BaseModel):
    """Represents data for a single stablecoin."""
    name: str  # Name of the stablecoin, e.g. "USDC"
    price: float  # Current price in USD
    circulating_supply: float  # Circulating supply on-chain
    reported_reserves: Optional[float] = None  # Reserves reported by issuers
    mint_volume: Optional[float] = None  # Recent mint volume
    burn_volume: Optional[float] = None  # Recent burn volume
    depeg_flag: bool = False  # Indicates potential depegging risk
