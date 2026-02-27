"""
backend/services/seller_service.py
"""

import uuid
from typing import Optional
from backend.dbase.supabase_client import supabase


def get_all_sellers(platform: Optional[str] = None) -> list:
    query = supabase.table("sellers").select("*")
    if platform:
        query = query.eq("platform_name", platform)
    return query.execute().data


def get_seller(seller_id: str) -> dict | None:
    res = (
        supabase.table("sellers")
        .select("*")
        .eq("seller_id", seller_id)
        .single()
        .execute()
    )
    return res.data


def create_seller(
    seller_name: str,
    platform_name: str,
    seller_rating: Optional[float] = None,
    reviews_count: Optional[int] = None,
    seller_url: Optional[str] = None,
) -> dict:
    existing = (
        supabase.table("sellers")
        .select("seller_id")
        .ilike("seller_name", seller_name)
        .eq("platform_name", platform_name)
        .execute()
        .data
    )
    if existing:
        return existing[0]

    data = {
        "seller_id": str(uuid.uuid4()),
        "seller_name": seller_name,
        "platform_name": platform_name,
        "seller_rating": seller_rating,
        "reviews_count": reviews_count,
        "seller_url": seller_url,
    }
    supabase.table("sellers").insert(data).execute()
    return data
