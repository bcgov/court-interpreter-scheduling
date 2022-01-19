from sqlalchemy.orm.session import Session
from models.role_model import RoleModel, UserRoleModel


def get_role_ids(roles: list(), db: Session):
    # print(roles)
    role_ids = list()
    for role_name in roles:
        role = db.query(RoleModel).filter(RoleModel.role_name==role_name).first()
        if role is not None:
           role_ids.append(role.id) 
    # print(role_ids)
    return role_ids



def modify_user_role(user_role_ids: list(), user_id: int, db: Session):

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
        if user_role_id not in privious_user_role_ids:
            user_role_relation = UserRoleModel(
                user_id = user_id,
                role_id = user_role_id
            )
            db.add(user_role_relation)
            db.commit()