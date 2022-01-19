
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import UserRoleSchemaRequest, RoleSchemaRequest, RoleSchema, RoleRequestAccessSchema
from models.role_model import RoleModel, UserRoleModel
from core.auth import logged_in_user
from typing import List
from api.repository.role_transactions import modify_user_role

router = APIRouter(
    prefix="/role",
    tags=['Role']
)

@router.get('/all', status_code=status.HTTP_200_OK, response_model=List[RoleSchema])
def get_All_Roles(db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    role = db.query(RoleModel).all()
    return role

@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_Role_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

    role = db.query(RoleModel).filter(RoleModel.id==id).first()
    role.user
    return role


@router.post('', status_code=status.HTTP_200_OK)
def create_Role(request: RoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    role = db.query(RoleModel).filter(RoleModel.role_name==request.role_name).first()

    if role is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Role already exist.")

    new_role = RoleModel(
        role_name = request.role_name        
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


@router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete_Role_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    role = db.query(RoleModel).filter(RoleModel.id==id)    
    role.delete(synchronize_session=False)
    db.commit()      
    return 'Role deleted.'


@router.put('/assign', status_code=status.HTTP_202_ACCEPTED)
def assign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session)):#, user = Depends(logged_in_user)):
    modify_user_role(request.roles, request.user_id, db)    
    return "Role assigned."


@router.delete('/unassign', status_code=status.HTTP_202_ACCEPTED)
def unassign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    user_role = db.query(UserRoleModel).where(
        UserRoleModel.user_id==request.user_id, 
        UserRoleModel.role_id==request.role_id
    )
    user_role.delete(synchronize_session=False)
    db.commit()      
    return 'Role unassigned.'    


@router.post('/request-access', status_code=status.HTTP_200_OK)
def request_Access(request: RoleRequestAccessSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    print("__________REQUEST_ACCESS___________")

    return "sent"


# @router.post('/', status_code=status.HTTP_200_OK )
# def createUser(request:UserSchema, db: Session = Depends(get_db_session)):
#     new_user = UserModel(
#         first_name= request.first_name, 
#         last_name= request.last_name,
#         gu_id = 1        
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user
