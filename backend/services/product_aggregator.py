"""
backend/services/product_aggregator.py
Aggregates full product details: master info + all platform listings
+ sellers + reviews + local store listings.
"""

from backend.dbase.supabase_client import supabase


def get_product_full_details(master_product_id: str) -> dict | None:
    # 1. Master product
    product_res = (
        supabase.table("master_products")
        .select("*")
        .eq("master_product_id", master_product_id)
        .single()
        .execute()
    )
    if not product_res.data:
        return None

    # 2. Platform listings
    platforms_res = (
        supabase.table("platform_products")
        .select("*")
        .eq("master_product_id", master_product_id)
        .execute()
    )
    platform_data = []
    for item in platforms_res.data:
        # Seller info
        if item.get("seller_id"):
            seller_res = (
                supabase.table("sellers")
                .select("*")
                .eq("seller_id", item["seller_id"])
                .single()
                .execute()
            )
            item["seller"] = seller_res.data
        else:
            item["seller"] = None

        # Reviews
        reviews_res = (
            supabase.table("reviews")
            .select("*")
            .eq("platform_product_id", item["platform_product_id"])
            .order("date", desc=True)
            .execute()
        )
        item["reviews"] = reviews_res.data
        platform_data.append(item)

    # Sort platform listings by price ascending
    platform_data.sort(key=lambda x: x.get("price") or float("inf"))

    # 3. Local store listings
    local_res = (
        supabase.table("local_store_products")
        .select("*")
        .eq("master_product_id", master_product_id)
        .execute()
    )
    local_data = []
    for item in local_res.data:
        store_res = (
            supabase.table("local_stores")
            .select("*")
            .eq("store_id", item["store_id"])
            .single()
            .execute()
        )
        item["store"] = store_res.data
        local_data.append(item)

    return {
        "product": product_res.data,
        "platform_listings": platform_data,
        "local_store_listings": local_data,
    }
