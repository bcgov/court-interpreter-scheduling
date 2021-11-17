from typing import List
from fastapi import APIRouter, Depends
from app.core.multi_database_middleware import get_db_session
from app.crud.language_db import LanguageDb
from app.schemas import ApiKey, LanguageResponse
# from app.core.authorization import get_current_user TODO:// finish me and change the user dependency injection method

router = APIRouter()


# NOTE:// RBAC Depends needs to be added to all endpoints
@router.get("/language",
            tags=["language"],
            summary="returns all",
            response_model=List[LanguageResponse])
async def find_all(db_session=Depends(get_db_session)) -> List[LanguageResponse]:
                   #user: KeycloakUser = Depends(get_current_user)
    language_db = LanguageDb(db_session)
    languages = language_db.find_all()
    result = [LanguageResponse.from_orm(x) for x in languages]
    return result


@router.get("/language/names",
            tags=["language"],
            summary="returns all language names",
            response_model=List[str])
async def find_all(db_session=Depends(get_db_session)) -> List[str]:
                   #user: KeycloakUser = Depends(get_current_user)
    language_db = LanguageDb(db_session)
    result = language_db.get_language_names()
    return result


@router.post("/language",
             tags=["language"],
             summary="returns all",
             response_model=LanguageResponse)
async def create(name: str,
                 db_session=Depends(get_db_session)) -> LanguageResponse:
                 #user: KeycloakUser = Depends(get_current_user)
    language_db = LanguageDb(db_session)
    result = LanguageResponse.from_orm(language_db.create(name))
    return result
