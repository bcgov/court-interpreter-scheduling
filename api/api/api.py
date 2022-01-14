from fastapi import APIRouter

from .routers.user_router import router as user_router
from .routers.role_router import router as role_router
from .routers.interpreter_router import router as interpreter_router
from .routers.language_router import router as language_router
from .routers.booking_router import router as booking_router

router = APIRouter( prefix="/api/v1",)


router.include_router(user_router)
router.include_router(role_router)
router.include_router(interpreter_router)
router.include_router(language_router)
router.include_router(booking_router)