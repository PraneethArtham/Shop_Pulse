"""
backend/models/schemas.py
Pydantic request/response schemas for the ShopPulse API.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


# ── Master Product ─────────────────────────────────────────────
class MasterProductOut(BaseModel):
    master_product_id: str
    product_name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


# ── Seller ─────────────────────────────────────────────────────
class SellerIn(BaseModel):
    seller_name: str
    platform_name: str
    seller_rating: Optional[float] = None
    reviews_count: Optional[int] = None
    seller_url: Optional[str] = None


# ── Platform Product ───────────────────────────────────────────
class PlatformProductIn(BaseModel):
    product_name: str
    price: float
    platform_name: str
    seller_id: Optional[str] = None
    rating: Optional[float] = None
    product_url: Optional[str] = None
    image_url: Optional[str] = None
    category: str = "General"


# ── Review ─────────────────────────────────────────────────────
class ReviewIn(BaseModel):
    platform_product_id: str
    reviewer_name: Optional[str] = "Anonymous"
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    verified_purchase: bool = False


# ── Local Store ────────────────────────────────────────────────
class LocalStoreIn(BaseModel):
    store_name: str
    address: str
    city: Optional[str] = None
    phone: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    store_rating: Optional[float] = None


class LocalStoreProductIn(BaseModel):
    master_product_id: str
    store_id: str
    price: float
    in_stock: bool = True
    notes: Optional[str] = None
