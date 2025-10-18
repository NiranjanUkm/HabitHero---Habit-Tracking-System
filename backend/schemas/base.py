from pydantic import BaseModel as PydanticBaseModel
from typing import Optional
from datetime import datetime

class BaseSchema(PydanticBaseModel):
    """Base Pydantic schema"""
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class PaginatedResponse(BaseSchema):
    """Base paginated response schema"""
    total: int
    page: int
    per_page: int
    items: list
