from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True


# --- Location Schemas ---
class LocationCreate(BaseModel):
    name: str = Field(..., min_length=2)
    type: str = "Borewell / Groundwater"
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationOut(BaseModel):
    id: int
    name: str
    type: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    sample_count: Optional[int] = 0
    latest_score: Optional[int] = None
    latest_status: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True


# --- Water Analysis Schemas ---
class WaterAnalysisRequest(BaseModel):
    location_id: Optional[int] = None
    location_name: Optional[str] = "Main Water Supply"
    ph: float = Field(..., ge=0.0, le=14.0, description="pH level (0-14)")
    hardness: float = Field(..., ge=0.0, le=1000.0, description="Hardness mg/L")
    solids: float = Field(..., ge=0.0, le=10000.0, description="TDS mg/L")
    chloramines: float = Field(..., ge=0.0, le=20.0, description="Chloramines mg/L")
    sulfate: float = Field(..., ge=0.0, le=2000.0, description="Sulfate mg/L")
    conductivity: float = Field(..., ge=0.0, le=5000.0, description="Conductivity µS/cm")
    organic_carbon: float = Field(..., ge=0.0, le=100.0, description="Total Organic Carbon mg/L")
    trihalomethanes: float = Field(..., ge=0.0, le=500.0, description="Trihalomethanes µg/L")
    turbidity: float = Field(..., ge=0.0, le=200.0, description="Turbidity NTU")
    dissolved_oxygen: Optional[float] = Field(8.0, ge=0.0, le=30.0, description="Dissolved Oxygen mg/L")
    nitrate: Optional[float] = Field(3.0, ge=0.0, le=200.0, description="Nitrate mg/L")
    lead: Optional[float] = Field(0.002, ge=0.0, le=5.0, description="Lead mg/L")


class WaterSampleOut(BaseModel):
    id: int
    sample_code: str
    location_name: Optional[str] = "Main Water Supply"
    ph: float
    hardness: float
    solids: float
    chloramines: float
    sulfate: float
    conductivity: float
    organic_carbon: float
    trihalomethanes: float
    turbidity: float
    dissolved_oxygen: float
    nitrate: float
    lead: float
    water_safety_score: int
    status: str
    risk_level: str
    is_potable: bool
    potability_probability: float
    explanation: Dict[str, Any]
    disease_risks: Dict[str, Any]
    recommendations: List[Dict[str, str]]
    created_at: datetime
    class Config:
        from_attributes = True


# --- Alert Schemas ---
class AlertOut(BaseModel):
    id: int
    sample_id: Optional[int]
    location_name: str
    alert_type: str
    title: str
    message: str
    severity: str
    is_resolved: bool
    created_at: datetime
    class Config:
        from_attributes = True
