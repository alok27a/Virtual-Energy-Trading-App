from fastapi import APIRouter, HTTPException, Query
from datetime import date

from app.services.grid_service import GridService
from app.schemas.market_data import MarketDataResponse, MarketDataError

router = APIRouter()
grid_service = GridService()

@router.get(
    "/{iso}",
    response_model=MarketDataResponse,
    responses={404: {"model": MarketDataError}, 500: {"model": MarketDataError}},
)
async def get_market_data(iso: str, target_date: date = Query(..., description="The date for which to fetch data, in YYYY-MM-DD format.")):
    """
    Fetches Day-Ahead (DA) and Real-Time (RT) market prices for a given ISO and date.
    """
    try:
        da_data, rt_data = await grid_service.get_market_prices(iso.upper(), target_date)

        if da_data.empty or rt_data.empty:
            raise HTTPException(status_code=404, detail=f"No data available for ISO '{iso}' on {target_date}.")

        return {
            "iso": iso.upper(),
            "date": target_date,
            "daData": da_data.to_dict('records'),
            "rtData": rt_data.to_dict('records')
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")