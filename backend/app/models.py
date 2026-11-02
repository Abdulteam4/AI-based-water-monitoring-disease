import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Water Specialist")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    locations = relationship("Location", back_populates="owner", cascade="all, delete-orphan")
    samples = relationship("WaterSample", back_populates="user", cascade="all, delete-orphan")


class Location(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    type = Column(String, default="Borewell / Groundwater") # Tap, Well, Tank, River, Lake, Treatment Plant
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner = relationship("User", back_populates="locations")
    samples = relationship("WaterSample", back_populates="location", cascade="all, delete-orphan")


class WaterSample(Base):
    __tablename__ = "water_samples"
    
    id = Column(Integer, primary_key=True, index=True)
    sample_code = Column(String, unique=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Parameters
    ph = Column(Float, nullable=False)
    hardness = Column(Float, nullable=False)
    solids = Column(Float, nullable=False)
    chloramines = Column(Float, nullable=False)
    sulfate = Column(Float, nullable=False)
    conductivity = Column(Float, nullable=False)
    organic_carbon = Column(Float, nullable=False)
    trihalomethanes = Column(Float, nullable=False)
    turbidity = Column(Float, nullable=False)
    dissolved_oxygen = Column(Float, default=8.0)
    nitrate = Column(Float, default=3.0)
    lead = Column(Float, default=0.002)
    
    # Prediction outputs
    water_safety_score = Column(Integer, nullable=False)
    status = Column(String, nullable=False) # SAFE, MODERATE, UNSAFE, CRITICAL
    risk_level = Column(String, nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    is_potable = Column(Boolean, nullable=False)
    potability_probability = Column(Float, nullable=False)
    
    # Rich JSON payloads stored as Text
    explanation_json = Column(Text, nullable=True)
    disease_risks_json = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)
    
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    location = relationship("Location", back_populates="samples")
    user = relationship("User", back_populates="samples")
    alerts = relationship("Alert", back_populates="sample", cascade="all, delete-orphan")


class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(Integer, ForeignKey("water_samples.id"), nullable=True)
    location_name = Column(String, nullable=False)
    alert_type = Column(String, nullable=False) # Parameter Exceedance, Prediction Unsafe, High Disease Risk
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    severity = Column(String, nullable=False) # INFO, WARNING, HIGH, CRITICAL
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    sample = relationship("WaterSample", back_populates="alerts")
