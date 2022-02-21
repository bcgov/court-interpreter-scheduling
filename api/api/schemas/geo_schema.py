from pydantic import BaseModel
from typing import Optional

class GeoUpdateScheduleRequestSchema(BaseModel):
    update_schedule: Optional[str]
    