from datetime import date
import pandas as pd
from beanie import PydanticObjectId

from app.models.models import Bid, Position
from app.services.grid_service import GridService

class SimulationService:
    """Contains the core business logic for the P&L simulation."""
    def __init__(self):
        self.grid_service = GridService()

    async def run_simulation_for_user(self, user_id: PydanticObjectId, iso_name: str, target_date: date) -> list[Position]:
        # 1. Clear any previous simulation results for this user, ISO, and date
        await Position.find(
            Position.owner_id == user_id,
            Position.iso == iso_name,
            Position.position_date == target_date
        ).delete()

        # 2. Fetch all of the user's bids for the target date and ISO
        user_bids = await Bid.find(
            Bid.owner_id == user_id,
            Bid.bid_date == target_date,
            Bid.iso == iso_name
        ).to_list()

        if not user_bids:
            raise ValueError(f"No bids found for {iso_name} on the specified date to run a simulation.")

        # 3. Fetch the market data from the external API
        da_data, rt_data = await self.grid_service.get_market_prices(iso_name, target_date)
        if da_data.empty or rt_data.empty:
            raise ValueError(f"Market data is not available for {iso_name} on {target_date}.")

        da_prices_by_hour = {pd.to_datetime(p['x'], unit='ms').hour: p['y'] for p in da_data.to_dict('records')}

        # 4. Determine which bids cleared and create the initial positions
        cleared_positions_to_create = []
        for bid in user_bids:
            clearing_price = da_prices_by_hour.get(bid.hour)
            if clearing_price is None: continue

            if (bid.bid_type == 'buy' and bid.price >= clearing_price) or \
               (bid.bid_type == 'sell' and bid.price <= clearing_price):
                new_position = Position(
                    owner_id=user_id, iso=iso_name, position_date=target_date,
                    hour=bid.hour, position_type=bid.bid_type, quantity=bid.quantity,
                    clearing_price=clearing_price
                )
                cleared_positions_to_create.append(new_position)

        if not cleared_positions_to_create:
            return []

        await Position.insert_many(cleared_positions_to_create)

        # 5. Calculate P&L by offsetting against the 5-minute Real-Time closing prices
        rt_df = pd.DataFrame(rt_data)
        rt_df['timestamp'] = pd.to_datetime(rt_df['x'], unit='ms')

        for pos in cleared_positions_to_create:
            rt_prices_for_hour = rt_df[rt_df['timestamp'].dt.hour == pos.hour]
            if rt_prices_for_hour.empty: continue

            num_intervals = len(rt_prices_for_hour)
            quantity_per_interval = pos.quantity / num_intervals

            # The core P&L logic: for each 5-minute closing price, calculate the profit/loss
            # against the day-ahead clearing price.
            pnl_series = (rt_prices_for_hour['y'] - pos.clearing_price) * quantity_per_interval
            if pos.position_type == 'sell':
                pnl_series = -pnl_series

            pos.realized_pnl = round(pnl_series.sum(), 2)
            await pos.save()

        return cleared_positions_to_create
