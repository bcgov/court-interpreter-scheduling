from fastapi import APIRouter
from .routers.config_router import router as config_web_router
from .routers.user_router import router as user_router

router = APIRouter( prefix="/api/v1",)

router.include_router(config_web_router)
router.include_router(user_router)
#router.include_router(language_router)
