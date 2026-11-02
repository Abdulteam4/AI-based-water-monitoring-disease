from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.models import Location, WaterSample, User
from app.schemas import LocationCreate, LocationOut
from app.auth import get_current_user_optional

router = APIRouter(prefix="/locations", tags=["Water Locations"])

@router.get("", response_model=List[LocationOut])
def get_locations(db: Session = Depends(get_db)):
    locs = db.query(Location).order_by(desc(Location.created_at)).all()
    results = []
    for loc in locs:
        samples_count = db.query(func.count(WaterSample.id)).filter(WaterSample.location_id == loc.id).scalar() or 0
        latest_sample = db.query(WaterSample).filter(WaterSample.location_id == loc.id).order_by(desc(WaterSample.created_at)).first()
        
        results.append({
            "id": loc.id,
            "name": loc.name,
            "type": loc.type,
            "address": loc.address,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "sample_count": samples_count,
            "latest_score": latest_sample.water_safety_score if latest_sample else None,
            "latest_status": latest_sample.status if latest_sample else "No Data",
            "created_at": loc.created_at
        })
    return results


@router.post("", response_model=LocationOut, status_code=status.HTTP_201_CREATED)
def create_location(
    loc_in: LocationCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    loc = Location(
        name=loc_in.name,
        type=loc_in.type,
        address=loc_in.address,
        latitude=loc_in.latitude,
        longitude=loc_in.longitude,
        user_id=current_user.id if current_user else None
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    
    return {
        "id": loc.id,
        "name": loc.name,
        "type": loc.type,
        "address": loc.address,
        "latitude": loc.latitude,
        "longitude": loc.longitude,
        "sample_count": 0,
        "latest_score": None,
        "latest_status": "No Data",
        "created_at": loc.created_at
    }


@router.delete("/{loc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(loc_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == loc_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(loc)
    db.commit()
    return None
