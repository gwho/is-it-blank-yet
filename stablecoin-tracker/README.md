# Stablecoin Tracker

This folder contains a simple tutorial project showing how to build a
stablecoin tracker with a **FastAPI** backend and a **Streamlit**
frontend. The goal is to help beginners understand how APIs and simple
web apps work together.

## Folder structure

```
stablecoin-tracker/
├── backend/            # FastAPI application
│   ├── __init__.py
│   ├── main.py         # API endpoints
│   ├── fetch.py        # Helper functions to call external APIs
│   └── models.py       # Pydantic data models
├── frontend/
│   └── streamlit_app.py  # Streamlit interface
├── requirements.txt    # Python dependencies
└── README.md           # Project documentation
```

## Setup

1. Install Python 3.10+ and create a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Export an Etherscan API token (for supply data):
   ```bash
   export ETHERSCAN_TOKEN="<your-token>"
   ```
   You can obtain a free token by signing up at [etherscan.io/apis](https://etherscan.io/apis).
4. Start the FastAPI backend:
   ```bash
   uvicorn stablecoin_tracker.backend.main:app --reload
   ```
5. In another terminal, launch the Streamlit frontend:
   ```bash
   streamlit run stablecoin_tracker/frontend/streamlit_app.py
   ```
6. Visit the Streamlit URL shown in the console.

## How it works

- `backend/main.py` defines **endpoints** using FastAPI. An *endpoint* is
  a URL path that the frontend can call to get data. The endpoint returns
  a JSON **response** created from the `StablecoinData` model.
- `backend/fetch.py` contains asynchronous functions that call public
  APIs (CoinGecko and Etherscan) to retrieve prices and supply.
- `frontend/streamlit_app.py` sends HTTP **requests** to the backend and
  displays the JSON results with Streamlit widgets.
- A very simple rule flags a potential **depeg** whenever the price is
  more than 1% away from $1.

## Extending this project

Here are a few ideas you could try:

1. **Add Binance reserves** – find an API that publishes Binance's
   stablecoin holdings and display them.
2. **Integrate Chainlink price feeds** – use on-chain oracle data to
   compare against CoinGecko prices.
3. **Improve UX with charts** – use `streamlit.chart` or a React
   frontend to visualize history of prices and supply.

## Open source projects to explore

1. [web3.py](https://github.com/ethereum/web3.py) – Python library for
   interacting with Ethereum, useful for querying on-chain data.
2. [fastapi](https://github.com/tiangolo/fastapi) – The framework used
   in this project; check the issues labeled "good first issue".
3. [streamlit](https://github.com/streamlit/streamlit) – Streamlit's own
   repository has beginner-friendly bugs and feature requests.
