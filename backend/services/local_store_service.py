"""
backend/services/local_store_service.py
Handles local store CRUD and inventory management.
"""

import uuid
from typing import Optional
from backend.dbase.supabase_client import supabase


def get_local_stores(city: Optional[str] = None) -> list:
    query = supabase.table("local_stores").select("*")
    if city:
        query = query.ilike("city", f"%{city}%")
    return query.execute().data


def create_local_store(
    store_name: str,
    address: str,
    city: Optional[str] = None,
    phone: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    store_rating: Optional[float] = None,
) -> dict:
    data = {
        "store_id": str(uuid.uuid4()),
        "store_name": store_name,
        "address": address,
        "city": city,
        "phone": phone,
        "latitude": latitude,
        "longitude": longitude,
        "store_rating": store_rating,
    }
    supabase.table("local_stores").insert(data).execute()
    return data


def add_local_store_product(
    master_product_id: str,
    store_id: str,
    price: float,
    in_stock: bool = True,
    notes: Optional[str] = None,
) -> dict:
    data = {
        "local_product_id": str(uuid.uuid4()),
        "master_product_id": master_product_id,
        "store_id": store_id,
        "price": price,
        "in_stock": in_stock,
        "notes": notes,
    }
    supabase.table("local_store_products").insert(data).execute()
    return data


def get_local_products_for_master(master_product_id: str) -> list:
    items = (
        supabase.table("local_store_products")
        .select("*")
        .eq("master_product_id", master_product_id)
        .execute()
        .data
    )
    result = []
    for item in items:
        store_res = (
            supabase.table("local_stores")
            .select("*")
            .eq("store_id", item["store_id"])
            .single()
            .execute()
        )
        item["store"] = store_res.data
        result.append(item)
    return result
