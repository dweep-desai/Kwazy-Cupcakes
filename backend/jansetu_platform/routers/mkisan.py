"""Mkisan router for farmer marketplace."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import hashlib
import uuid
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..security import get_current_user
from ..models.user import User
from ..config import settings

router = APIRouter(prefix="/mkisan", tags=["mkisan"])


class UpdateKisanIdRequest(BaseModel):
    kisan_id: str


class RegisterSellerRequest(BaseModel):
    land_area: Optional[float] = None
    land_unit: Optional[str] = None
    primary_crop: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None


class CreateProductRequest(BaseModel):
    product_name: str
    product_type: str  # 'Cereals', 'Vegetables', 'Fruits', 'Oilseeds', 'Pulses', 'Livestock'
    category: str
    quantity: str
    price_per_unit: float
    location: Optional[str] = None
    description: Optional[str] = None


class ProductResponse(BaseModel):
    product_id: str
    mkisan_citizen_id: str
    product_name: str
    product_type: str
    category: str
    quantity: str
    price_per_unit: float
    location: Optional[str]
    description: Optional[str]
    seller_name: str
    seller_phone: Optional[str]
    created_at: str
    updated_at: str


@router.get("/check-kisan-id")
async def check_kisan_id(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user has a kisan_id."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        query = text("SELECT kisan_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        result = db.execute(query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        has_kisan_id = result and result[0] is not None
        
        # Check if already registered as seller
        is_registered = False
        if has_kisan_id:
            citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
            citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
            if citizen_result:
                mkisan_query = text("SELECT mkisan_citizen_id FROM mkisan_citizens WHERE citizen_id = :citizen_id")
                mkisan_result = db.execute(mkisan_query, {"citizen_id": citizen_result[0]}).fetchone()
                is_registered = mkisan_result is not None
        
        return {
            "has_kisan_id": has_kisan_id,
            "is_registered_as_seller": is_registered,
            "kisan_id": result[0] if has_kisan_id else None
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking kisan_id: {str(e)}"
        )


@router.post("/register-seller")
async def register_seller(
    request: RegisterSellerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Register as a seller on Mkisan platform."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Get citizen info
        citizen_query = text("""
            SELECT citizen_id, kisan_id FROM citizens 
            WHERE aadhaar_hash = :aadhaar_hash
        """)
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Citizen profile not found"
            )
        
        citizen_id = citizen_result[0]
        kisan_id = citizen_result[1]
        
        if not kisan_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kisan ID is required. Please add your Kisan ID in your profile first."
            )
        
        # Check if already registered
        check_query = text("SELECT mkisan_citizen_id FROM mkisan_citizens WHERE citizen_id = :citizen_id")
        existing = db.execute(check_query, {"citizen_id": citizen_id}).fetchone()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already registered as seller"
            )
        
        # Register as seller
        mkisan_citizen_id = str(uuid.uuid4())
        insert_query = text("""
            INSERT INTO mkisan_citizens 
            (mkisan_citizen_id, citizen_id, kisan_id, land_area, land_unit, primary_crop, district, state)
            VALUES (:mkisan_citizen_id, :citizen_id, :kisan_id, :land_area, :land_unit, :primary_crop, :district, :state)
        """)
        
        db.execute(insert_query, {
            "mkisan_citizen_id": mkisan_citizen_id,
            "citizen_id": citizen_id,
            "kisan_id": kisan_id,
            "land_area": request.land_area,
            "land_unit": request.land_unit,
            "primary_crop": request.primary_crop,
            "district": request.district,
            "state": request.state
        })
        
        db.commit()
        
        return {"message": "Successfully registered as seller", "mkisan_citizen_id": mkisan_citizen_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering seller: {str(e)}"
        )


@router.post("/products")
async def create_product(
    request: CreateProductRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new product listing."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Get citizen_id
        citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Citizen not found")
        
        citizen_id = citizen_result[0]
        
        # Get mkisan_citizen_id
        mkisan_query = text("SELECT mkisan_citizen_id FROM mkisan_citizens WHERE citizen_id = :citizen_id")
        mkisan_result = db.execute(mkisan_query, {"citizen_id": citizen_id}).fetchone()
        
        if not mkisan_result:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must be registered as a seller first"
            )
        
        mkisan_citizen_id = mkisan_result[0]
        product_id = str(uuid.uuid4())
        
        # Insert product
        insert_query = text("""
            INSERT INTO mkisan_products 
            (product_id, mkisan_citizen_id, product_name, product_type, category, quantity, 
             price_per_unit, location, description)
            VALUES (:product_id, :mkisan_citizen_id, :product_name, :product_type, :category, 
                    :quantity, :price_per_unit, :location, :description)
        """)
        
        db.execute(insert_query, {
            "product_id": product_id,
            "mkisan_citizen_id": mkisan_citizen_id,
            "product_name": request.product_name,
            "product_type": request.product_type,
            "category": request.category,
            "quantity": request.quantity,
            "price_per_unit": request.price_per_unit,
            "location": request.location,
            "description": request.description
        })
        
        db.commit()
        
        return {"message": "Product created successfully", "product_id": product_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating product: {str(e)}"
        )


@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    product_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all products with seller information."""
    try:
        query = text("""
            SELECT 
                p.product_id,
                p.mkisan_citizen_id,
                p.product_name,
                p.product_type,
                p.category,
                p.quantity,
                p.price_per_unit,
                p.location,
                p.description,
                p.created_at,
                p.updated_at,
                c.full_name as seller_name,
                c.phone as seller_phone
            FROM mkisan_products p
            JOIN mkisan_citizens mc ON p.mkisan_citizen_id = mc.mkisan_citizen_id
            JOIN citizens c ON mc.citizen_id = c.citizen_id
            WHERE 1=1
        """)
        
        params = {}
        if category:
            query = text(str(query) + " AND p.category = :category")
            params["category"] = category
        if product_type:
            query = text(str(query) + " AND p.product_type = :product_type")
            params["product_type"] = product_type
        
        query = text(str(query) + " ORDER BY p.created_at DESC")
        
        results = db.execute(query, params).fetchall()
        
        products = []
        for row in results:
            products.append({
                "product_id": row[0],
                "mkisan_citizen_id": row[1],
                "product_name": row[2],
                "product_type": row[3],
                "category": row[4],
                "quantity": row[5],
                "price_per_unit": float(row[6]),
                "location": row[7],
                "description": row[8],
                "created_at": str(row[9]),
                "updated_at": str(row[10]),
                "seller_name": row[11],
                "seller_phone": row[12]
            })
        
        return products
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching products: {str(e)}"
        )


@router.get("/my-products", response_model=List[ProductResponse])
async def get_my_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get products listed by current user."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        query = text("""
            SELECT 
                p.product_id,
                p.mkisan_citizen_id,
                p.product_name,
                p.product_type,
                p.category,
                p.quantity,
                p.price_per_unit,
                p.location,
                p.description,
                p.created_at,
                p.updated_at,
                c.full_name as seller_name,
                c.phone as seller_phone
            FROM mkisan_products p
            JOIN mkisan_citizens mc ON p.mkisan_citizen_id = mc.mkisan_citizen_id
            JOIN citizens c ON mc.citizen_id = c.citizen_id
            WHERE c.aadhaar_hash = :aadhaar_hash
            ORDER BY p.created_at DESC
        """)
        
        results = db.execute(query, {"aadhaar_hash": aadhaar_hash}).fetchall()
        
        products = []
        for row in results:
            products.append({
                "product_id": row[0],
                "mkisan_citizen_id": row[1],
                "product_name": row[2],
                "product_type": row[3],
                "category": row[4],
                "quantity": row[5],
                "price_per_unit": float(row[6]),
                "location": row[7],
                "description": row[8],
                "created_at": str(row[9]),
                "updated_at": str(row[10]),
                "seller_name": row[11],
                "seller_phone": row[12]
            })
        
        return products
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching your products: {str(e)}"
        )


@router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    request: CreateProductRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a product listing (only owner can update)."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Get citizen_id
        citizen_query = text("SELECT citizen_id FROM citizens WHERE aadhaar_hash = :aadhaar_hash")
        citizen_result = db.execute(citizen_query, {"aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not citizen_result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Citizen not found")
        
        citizen_id = citizen_result[0]
        
        # Verify ownership
        check_query = text("""
            SELECT p.product_id 
            FROM mkisan_products p
            JOIN mkisan_citizens mc ON p.mkisan_citizen_id = mc.mkisan_citizen_id
            JOIN citizens c ON mc.citizen_id = c.citizen_id
            WHERE p.product_id = :product_id AND c.aadhaar_hash = :aadhaar_hash
        """)
        
        result = db.execute(check_query, {"product_id": product_id, "aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this product"
            )
        
        # Update product
        if settings.DATABASE_URL.startswith('sqlite'):
            update_query = text("""
                UPDATE mkisan_products 
                SET product_name = :product_name,
                    product_type = :product_type,
                    category = :category,
                    quantity = :quantity,
                    price_per_unit = :price_per_unit,
                    location = :location,
                    description = :description,
                    updated_at = datetime('now')
                WHERE product_id = :product_id
            """)
        else:
            update_query = text("""
                UPDATE mkisan_products 
                SET product_name = :product_name,
                    product_type = :product_type,
                    category = :category,
                    quantity = :quantity,
                    price_per_unit = :price_per_unit,
                    location = :location,
                    description = :description,
                    updated_at = NOW()
                WHERE product_id = :product_id
            """)
        
        db.execute(update_query, {
            "product_id": product_id,
            "product_name": request.product_name,
            "product_type": request.product_type,
            "category": request.category,
            "quantity": request.quantity,
            "price_per_unit": request.price_per_unit,
            "location": request.location,
            "description": request.description
        })
        
        db.commit()
        
        return {"message": "Product updated successfully", "product_id": product_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating product: {str(e)}"
        )


@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a product listing (only owner can delete)."""
    try:
        aadhaar_hash = hashlib.sha256(current_user.aadhar.encode()).hexdigest()
        
        # Verify ownership
        check_query = text("""
            SELECT p.product_id 
            FROM mkisan_products p
            JOIN mkisan_citizens mc ON p.mkisan_citizen_id = mc.mkisan_citizen_id
            JOIN citizens c ON mc.citizen_id = c.citizen_id
            WHERE p.product_id = :product_id AND c.aadhaar_hash = :aadhaar_hash
        """)
        
        result = db.execute(check_query, {"product_id": product_id, "aadhaar_hash": aadhaar_hash}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this product"
            )
        
        delete_query = text("DELETE FROM mkisan_products WHERE product_id = :product_id")
        db.execute(delete_query, {"product_id": product_id})
        db.commit()
        
        return {"message": "Product deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting product: {str(e)}"
        )
