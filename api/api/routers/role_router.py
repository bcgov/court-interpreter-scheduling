
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas.role_schema import UserRoleSchemaRequest, RoleSchemaRequest, RoleSchema, RoleRequestAccessSchema
from models.role_model import RoleModel, UserRoleModel
from core.auth import logged_in_user, admin_user
from typing import List
from api.repository.role_transactions import modify_user_role, create_new_role

from api.repository.access_request_transactions import EmailRequestAccess

import logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/role",
    tags=['Role']
)


@router.get('/all', status_code=status.HTTP_200_OK, response_model=List[RoleSchema])
def get_All_Roles(db: Session= Depends(get_db_session), user = Depends(admin_user)):

    role = db.query(RoleModel).filter(RoleModel.role_name!='super-admin').all()
    return role


@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Role_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(admin_user)):

    role = db.query(RoleModel).filter(RoleModel.id==id).first()
    role.user
    return role


@router.post('', status_code=status.HTTP_200_OK)
def create_Role(request: RoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(admin_user)):
    
    return create_new_role(request.role_name, db, user['username'])


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Role_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(admin_user)):
    
    role = db.query(RoleModel).filter(RoleModel.id==id)
    if role.first().role_name == 'super_user': 
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=f"Forbidden.")   
    role.delete(synchronize_session=False)
    db.commit()      
    return 'Role deleted.'


@router.put('/assign', status_code=status.HTTP_202_ACCEPTED)
def assign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(admin_user)):
    modify_user_role(request.roles, request.user_id, db, user['username'])    
    return "Role assigned."


@router.delete('/unassign', status_code=status.HTTP_202_ACCEPTED)
def unassign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(admin_user)):
    
    role = db.query(RoleModel).filter(RoleModel.id==request.role_id)
    if role.first().role_name == 'super_user': 
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=f"Forbidden.") 

    user_role = db.query(UserRoleModel).where(
        UserRoleModel.user_id==request.user_id, 
        UserRoleModel.role_id==request.role_id
    )
    user_role.delete(synchronize_session=False)
    db.commit()      
    return 'Role unassigned.'    


@router.post('/request-access', status_code=status.HTTP_200_OK)
def request_Access(request: RoleRequestAccessSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    logger.info("__________REQUEST_ACCESS___________")
    EmailRequestAccess().request_access(db, user['username'], request.message)
    return "sent"

