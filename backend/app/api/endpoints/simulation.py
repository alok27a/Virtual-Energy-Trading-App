from fastapi import APIRouter, Depends, HTTPException
from datetime import date
from typing import List

from app.models.models import User
from app.schemas.position import PositionRead
from app.services.simulation_service import SimulationService
from app.auth.dependencies import get_current_active_user

router = APIRouter()

@router.post("/{iso}/{simulation_date}", response_model=List[PositionRead])
async def run_pnl_simulation(
    iso: str,
    simulation_date: date,
    current_user: User = Depends(get_current_active_user)
):
    """
    Runs the P&L simulation for the current user's bids for a specific ISO and date.
    """
    simulation_service = SimulationService()
    try:
        positions = await simulation_service.run_simulation_for_user(
            user_id=current_user.id,
            iso_name=iso.upper(),
            target_date=simulation_date
        )
        return positions
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Simulation Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during simulation.")
