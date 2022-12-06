
from fastapi import APIRouter, status, Depends
from core.auth import user_in_role
# from typing import List
from api.utils.holidays import Holidays
# import datetime


router = APIRouter(
    prefix="/holidays",
    tags=['Holidays']
)


@router.get('/stats/{year}', status_code=status.HTTP_200_OK)
def get_Stat_Holidays(year: int, user = Depends(user_in_role)):
    holidays = Holidays().BcStats(year)
    return  holidays




@router.get('/stats/{year_start}/{year_end}', status_code=status.HTTP_200_OK)
def get_Stat_Holidays_In_Range(year_start: int, year_end: int, user = Depends(user_in_role)):
    
    holidays = list()
    for year in range(year_start, (year_end+1)):
        holidays.append(Holidays().BcStats(year))

    return  holidays



