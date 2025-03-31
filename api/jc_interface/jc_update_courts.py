import re
from datetime import datetime
from api.repository.geo_transactions import get_next_update_date
from jc_interface.jc_calls import JcInterfaceCalls
from models.court_location_model import CourtLocationModel
from sqlalchemy.orm import Session
from models.geo_status_model import GeoStatusModel
from sqlalchemy import exc

from core.geo_coordinate_service import get_clean_address

import logging
logger = logging.getLogger(__name__)

def update_courts_info_in_db(db: Session):
    
    jc_calls = JcInterfaceCalls()    
    jc_locations = jc_calls.get_court_locations()
    efiling_locations = jc_calls.get_court_locations_address()
    # print(efiling_locations)

    geo_status = db.query(GeoStatusModel).where(GeoStatusModel.name=='locations')


    for inx, location in enumerate(jc_locations):        
        
        if location["shortDesc"].isnumeric() and len(location["shortDesc"]):        
            # logger.info(location)            
       
            court_address = {'address_line1':"", 'address_line2':"", 'postal_code':"", 'city':"", 'province':""} 

            efiling_location = [loc for loc in efiling_locations if (loc["short_description"]==location["shortDesc"]and str(loc["location_code"])==location["code"] )]
            if len(efiling_location)==1:
                court_address['address_line1'] = efiling_location[0]['address_line1']                
                court_address['address_line2'] = efiling_location[0]['address_line2']
                court_address['postal_code'] = efiling_location[0]['postal_code']
                court_address['city'] = efiling_location[0]['city']
                court_address['province'] = efiling_location[0]['province']                
            else:
                court_address = other_courts_addresses(location["code"], location["shortDesc"])
            # print(court_address)
            if not court_address:
                continue
             

            location_query = db.query(CourtLocationModel).filter(
                CourtLocationModel.short_description==location["shortDesc"]
            )

            progress = int(100*inx/len(jc_locations))+1
            if progress>99: progress=99
            logger.info("Location Update Progress => "+str(progress)+" %")
            # print(location_query)
            # print(court_address)
            geo_status.update({"progress":progress})
            db.commit()


            if location_query.first() is None:
                adding_location = CourtLocationModel(
                    name = location["longDesc"],
                    short_description = location["shortDesc"],
                    location_code = location["code"],
                    city = court_address['city'],
                    address_line1 = court_address['address_line1'],
                    address_line2 = court_address['address_line2'],
                    postal_code = court_address['postal_code'],
                    province = court_address['province'],
                    latitude = None,
                    longitude = None,
                    timezone = get_timezone(court_address['city']),
                    geo_service = None
                )
                db.add(adding_location)                
                try:
                    db.commit()
                except exc.SQLAlchemyError as e:                                        
                    error_msg = str(e.__dict__['orig'])
                    logger.error(error_msg)
                    logger.error(f"Could not add location ({location['longDesc']}) to db!")

            else:
                court_info = location_query.first()
                new_address = get_clean_address(court_address['address_line1'], court_address['address_line2'], court_address['city'], court_address['postal_code'], court_address['province'])                
                old_address = get_clean_address(court_info.address_line1, court_info.address_line2, court_info.city, court_info.postal_code, court_info.province)
                geo_service = court_info.geo_service
                if new_address != old_address : 
                    geo_service = "UPDATE"
                    print("______________________________")
                location_query.update({ 
                    "name": location["longDesc"],
                    "short_description": location["shortDesc"],
                    "location_code": location["code"],
                    "city": court_address['city'],
                    "address_line1": court_address['address_line1'],
                    "address_line2": court_address['address_line2'],
                    "postal_code": court_address['postal_code'],
                    "province": court_address['province'],
                    "latitude": None,
                    "longitude": None,
                    "timezone": get_timezone(court_address['city']),
                    "geo_service": geo_service
                })


    next_update = None
    update_schedule = geo_status.first().update_schedule
    if update_schedule:
        next_update = get_next_update_date(update_schedule, datetime.now())

    geo_status.update({
        "progress":100, 
        "updated_at":datetime.now(), 
        "update_service": "UPDATE", 
        "next_update_at":next_update
    })          
    db.commit()


def get_timezone(city: str):

    edmonton = ['cranbrook','fernie','sparwood','golden','invermere']
    dawson = ['dawson creek','tumbler ridge','chetwynd','fort st. john','fort st john']
    creston = ['creston']

    if remove_space(city) in edmonton:
        return "America/Edmonton"
    elif remove_space(city) in dawson:
        return "America/Dawson_Creek"
    elif remove_space(city) in creston:
        return "America/Creston"
    else:
        return "America/Vancouver"


def remove_space(address):
    address = re.sub(' +', ' ', address) 
    return address.strip().lower()


def other_courts_addresses(code, shortDesc):
    other_courts = [
        {'code': '10242.0001', 'shortDesc': '1207', 'longDesc': 'Victoria Family and Youth Court', 'address_line1':'850 Burdett Avenue','address_line2':'','postal_code':'V8W 1B4','city':'Victoria','province':'British Columbia'},
        {'code': '10251.0001', 'shortDesc': '2048', 'longDesc': 'Vancouver Traffic Court', 'address_line1':'','address_line2':'','postal_code':'V6B 3V3','city':'Vancouver','province':'British Columbia'},
        {'code': '10265.0001', 'shortDesc': '5895', 'longDesc': 'Prince George Supreme Court', 'address_line1':'250 George Street','address_line2':'','postal_code':'V2L 5S2','city':'Prince George','province':'British Columbia'},
        {'code': '19247.0734', 'shortDesc': '2041', 'longDesc': 'Justice Centre (Judicial)', 'address_line1':'','address_line2':'','postal_code':'V7Y 1E8','city':'Vancouver','province':'British Columbia'},
        {'code': '19307.0734', 'shortDesc': '2009', 'longDesc': 'Klemtu Provincial Court', 'address_line1':'','address_line2':'','postal_code':'V0T 1L0','city':'Klemtu','province':'British Columbia'},
        {'code': '19635.0734', 'shortDesc': '2049', 'longDesc': 'Violation Ticket Centre', 'address_line1':'','address_line2':'','postal_code':'V6B 3V3','city':'Vancouver','province':'British Columbia'},
        {'code': '8813.0001',  'shortDesc': '2040', 'longDesc': 'Vancouver Provincial Court', 'address_line1':'222 Main Street','address_line2':'','postal_code':'V6A 2S8','city':'Vancouver','province':'British Columbia'},
        {'code': '8842.0001',  'shortDesc': '3587', 'longDesc': 'Surrey Family Court', 'address_line1':'14340 - 57th Avenue','address_line2':'','postal_code':'V3X 1B2','city':'Surrey','province':'British Columbia'},
        {'code': '9066.0001',  'shortDesc': '3535', 'longDesc': 'Delta Provincial Court', 'address_line1':'','address_line2':'','postal_code':'','city':'Delta','province':'British Columbia'},
        {'code': '19585.0103', 'shortDesc': '2042', 'longDesc': 'Downtown Community Court', 'address_line1':'211 Gore Avenue','address_line2':'','postal_code':'V6A 2S8','city':'Vancouver','province':'British Columbia'},
    ]

    address = [address for address in other_courts if address['shortDesc']== shortDesc ]
    
    if len(address)==1:
        return {
            'address_line1':address[0]['address_line1'], 
            'address_line2':address[0]['address_line2'], 
            'postal_code':address[0]['postal_code'], 
            'city':address[0]['city'], 
            'province':address[0]['province']
        }
    else:
        return None
