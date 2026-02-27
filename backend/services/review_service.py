"""
backend/services/review_service.py
"""

import uuid
from typing import Optional
from datetime import date
from backend.dbase.supabase_client import supabase


def add_review(
    platform_product_id: str,
    rating: float,
    reviewer_name: Optional[str] = "Anonymous",
    comment: Optional[str] = None,
    verified_purchase: bool = False,
) -> dict:
    data = {
        "review_id": str(uuid.uuid4()),
        "platform_product_id": platform_product_id,
        "reviewer_name": reviewer_name,
        "rating": rating,
        "comment": comment,
        "verified_purchase": verified_purchase,
        "date": str(date.today()),
    }
    supabase.table("reviews").insert(data).execute()
    return data


def get_reviews_for_platform_product(platform_product_id: str) -> list:
    return (
        supabase.table("reviews")
        .select("*")
        .eq("platform_product_id", platform_product_id)
        .order("date", desc=True)
        .execute()
        .data
    )


def get_all_reviews_for_master(master_product_id: str) -> list:
    platform_products = (
        supabase.table("platform_products")
        .select("platform_product_id, platform_name")
        .eq("master_product_id", master_product_id)
        .execute()
        .data
    )
    all_reviews = []
    for pp in platform_products:
        reviews = (
            supabase.table("reviews")
            .select("*")
            .eq("platform_product_id", pp["platform_product_id"])
            .execute()
            .data
        )
        for r in reviews:
            r["platform_name"] = pp["platform_name"]
        all_reviews.extend(reviews)
    return sorted(all_reviews, key=lambda x: x.get("date", ""), reverse=True)
