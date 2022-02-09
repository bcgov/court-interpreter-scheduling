from sqlalchemy.orm.session import Session
from models.role_model import RoleModel, UserRoleModel
from fastapi import HTTPException, status

from api.repository.user_transactions import get_update_by


def get_role_ids(roles: list(), db: Session):
    # print(roles)
    role_ids = list()
    for role_name in roles:
        role = db.query(RoleModel).filter(RoleModel.role_name==role_name).first()
        if role is not None:
           role_ids.append(role.id) 
    # print(role_ids)
    return role_ids



def modify_user_role(user_role_ids: list(), user_id: int, db: Session, username):
    
    updated_by = get_update_by(db, username)

    privious_user_role_ids = list()
    user_roles_query = db.query(UserRoleModel).where(UserRoleModel.user_id == user_id).all()
    # print(user_roles_query)
    for user_role_query in user_roles_query:
        privious_role_id = user_role_query.role_id
        privious_user_role_ids.append(privious_role_id)
        if privious_role_id not in user_role_ids:
            # print("_______DEL_EXTRA_ROLE______________")
            # print(privious_role_id)            
            user_role = db.query(UserRoleModel).filter(UserRoleModel.user_id==user_id, UserRoleModel.role_id==privious_role_id)            
            user_role.delete(synchronize_session=False)
            db.commit()
    
    for user_role_id in user_role_ids:  
        role = db.query(RoleModel).filter(RoleModel.id==user_role_id).first()
        if role.role_name == 'super-admin': continue

        if user_role_id not in privious_user_role_ids:
            user_role_relation = UserRoleModel(
                user_id = user_id,
                role_id = user_role_id,
                updated_by = updated_by
            )
            db.add(user_role_relation)
            db.commit()


def create_new_role(role_name, db: Session, username):
    
    updated_by = get_update_by(db, username)

    role = db.query(RoleModel).filter(RoleModel.role_name==role_name).first()

    if role is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Role already exist.")

    new_role = RoleModel(
        role_name = role_name,
        updated_by = updated_by      
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role.id


    
