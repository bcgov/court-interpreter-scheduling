from typing import List
from fastapi import APIRouter, status, HTTPException, Depends, Request
from core.multi_database_middleware import get_db_session
from sqlalchemy.orm import Session
from api.schemas import BookingRequestSchema, BookingResponsePageSchema
from models.booking_model import BookingModel
from core.auth import logged_in_user
from api.repository.booking_transactions import create_booking_in_db

router = APIRouter(
    prefix="/booking",
    tags=['Booking']
)


@router.get('', status_code=status.HTTP_200_OK, response_model=BookingResponsePageSchema)
def get_All_Bookings(locationId: int = 0, db: Session= Depends(get_db_session)):
    
    bookings = db.query(BookingModel)
    
    if locationId>0:
        bookings = bookings.filter(BookingModel.location_id==locationId)
  
    return BookingResponsePageSchema(data = bookings.all(), pagination = {"page":1, "limit":1000})


@router.post('', status_code=status.HTTP_200_OK)
def create_Booking(request: BookingRequestSchema, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
    return create_booking_in_db(request, db, user['username'])


# @router.get('/{id}', status_code=status.HTTP_200_OK)
# def get_Role_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):

#     role = db.query(RoleModel).filter(RoleModel.id==id).first()
#     role.user
#     return role

# @router.delete('/{id}', status_code=status.HTTP_202_ACCEPTED)
# def delete_Role_By_Id(id: int, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
#     role = db.query(RoleModel).filter(RoleModel.id==id)    
#     role.delete(synchronize_session=False)
#     db.commit()      
#     return 'Role deleted.'


# @router.put('/assign', status_code=status.HTTP_202_ACCEPTED)
# def assign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
#     relation = UserRoleModel(
#         user_id = request.user_id,
#         role_id = request.role_id
#     )
#     db.add(relation)
#     db.commit()
#     return "Role assigned."


# @router.delete('/unassign', status_code=status.HTTP_202_ACCEPTED)
# def unassign_Role_To_User(request: UserRoleSchemaRequest, db: Session= Depends(get_db_session), user = Depends(logged_in_user)):
    
#     user_role = db.query(UserRoleModel).where(
#         UserRoleModel.user_id==request.user_id, 
#         UserRoleModel.role_id==request.role_id
#     )
#     user_role.delete(synchronize_session=False)
#     db.commit()      
#     return 'Role unassigned.'    




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
