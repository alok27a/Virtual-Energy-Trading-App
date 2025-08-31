from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime, time, date

from app.models.models import User, Bid
from app.schemas.bid import BidCreate, BidRead
from app.auth.dependencies import get_current_active_user

router = APIRouter()
BIDDING_DEADLINE = time(11, 0) # 11:00 AM UTC

@router.post("/", response_model=BidRead)
async def create_bid(
    bid_data: BidCreate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Submits a new bid for a specific ISO's day-ahead market.
    The 11 AM UTC deadline is enforced ONLY for bids placed for the current day.
    Bids for past or future dates are always allowed, enabling historical simulation.
    """
    # --- LOGIC UPDATE: Re-implementing the 11 AM Deadline ---
    current_utc_date = datetime.utcnow().date()
    current_utc_time = datetime.utcnow().time()

    # Apply the 11:00 AM UTC deadline ONLY if a user is bidding for the current day.
    if bid_data.bid_date == current_utc_date and current_utc_time >= BIDDING_DEADLINE:
        raise HTTPException(
            status_code=400, 
            detail=f"Bidding deadline of {BIDDING_DEADLINE} UTC for today has passed."
        )
    # --- END UPDATE ---

    bids_for_hour_count = await Bid.find(
        Bid.owner_id == current_user.id,
        Bid.iso == bid_data.iso.upper(),
        Bid.bid_date == bid_data.bid_date,
        Bid.hour == bid_data.hour
    ).count()

    if bids_for_hour_count >= 10:
        raise HTTPException(status_code=400, detail=f"Maximum of 10 bids per hour for {bid_data.iso} exceeded.")

    bid = Bid(**bid_data.model_dump(exclude={"iso"}), owner_id=current_user.id, iso=bid_data.iso.upper())
    await bid.insert()
    return bid

@router.get("/{iso}/{bid_date}", response_model=List[BidRead])
async def get_user_bids_for_date(
    iso: str,
    bid_date: date,
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieves all bids submitted by the current user for a specific ISO and date.
    """
    bids = await Bid.find(
        Bid.owner_id == current_user.id,
        Bid.iso == iso.upper(),
        Bid.bid_date == bid_date
    ).to_list()
    return bids

