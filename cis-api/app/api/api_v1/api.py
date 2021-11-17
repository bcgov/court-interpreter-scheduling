from fastapi import APIRouter
from .endpoints.language_controller import router as language_router
from .endpoints.probes_controller import router as probes_router

router = APIRouter()

router.include_router(probes_router)
router.include_router(language_router)
