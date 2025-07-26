"""Streamlit frontend for the stablecoin tracker.

Streamlit allows building data apps with minimal boilerplate. It handles
sending HTTP requests to our FastAPI backend and displaying the results
as simple tables and charts.
"""

import streamlit as st
import requests

BACKEND_URL = "http://localhost:8000"  # where the FastAPI app runs

st.title("Stablecoin Tracker")

st.write(
    "This demo fetches data from a FastAPI backend and highlights potential"
    " depegging if the price deviates from $1 by more than 1%."
)

# Fetch data from the backend
resp = requests.get(f"{BACKEND_URL}/stablecoins")
resp.raise_for_status()
coins = resp.json()

for coin in coins:
    st.subheader(coin["name"])
    st.write(f"Price: ${coin['price']}")
    st.write(f"Supply: {coin['circulating_supply']}")
    if coin.get("depeg_flag"):
        st.error("Potential depeg detected!")
    st.markdown("---")
