
from jc_interface.jc_calls import JcInterfaceCalls
from models.court_location_model import CourtLocationModel
from sqlalchemy.orm import Session

from core.geo_coordinate_service import get_latitude_longitude_service

def update_courts_info_in_db(db: Session, google_map: bool):
    
    jc_calls = JcInterfaceCalls()    
    jc_locations = jc_calls.get_court_locations()
    efiling_locations = jc_calls.get_court_locations_address()
    # print(efiling_locations)

    if google_map:
        geo_service = "Google Map"
    else:
        geo_service = "Nominatim"

    for inx, location in enumerate(jc_locations):        
        
        if location["shortDesc"].isnumeric() and len(location["shortDesc"]):        
            # print(location["longDesc"])            
       
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
                
            latitude, longitude = get_latitude_longitude_service(court_address['address_line1'], court_address['address_line2'], court_address['city'], court_address['postal_code'], court_address['province'], google_map=google_map)

            location_query = db.query(CourtLocationModel).filter(
                CourtLocationModel.short_description==location["shortDesc"],
                CourtLocationModel.location_code==location["code"]
            )
            print("Location Update Progress => "+str(int(100*inx/len(jc_locations)))+" %")
            # print(location_query)
            # print(court_address)
            


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
                    latitude = latitude,
                    longitude = longitude,
                    geo_service = geo_service
                )
                db.add(adding_location)                
            else:
                location_query.update({ 
                    "name": location["longDesc"],
                    "short_description": location["shortDesc"],
                    "location_code": location["code"],
                    "city": court_address['city'],
                    "address_line1": court_address['address_line1'],
                    "address_line2": court_address['address_line2'],
                    "postal_code": court_address['postal_code'],
                    "province": court_address['province'],
                    "latitude": latitude,
                    "longitude": longitude,
                    "geo_service": geo_service
                })
                
    db.commit()


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
        {'code': '9066.0001',  'shortDesc': '2010', 'longDesc': 'Delta Provincial Court', 'address_line1':'','address_line2':'','postal_code':'','city':'Delta','province':'British Columbia'},
    ]

    address = [address for address in other_courts if address['code']==code and address['shortDesc']== shortDesc ]
    
    if len(address)==1:
        return {
            'address_line1':address[0]['address_line1'], 
            'address_line2':address[0]['address_line2'], 
            'postal_code':address[0]['postal_code'], 
            'city':address[0]['city'], 
            'province':address[0]['province']
        }
    else:
        return {'address_line1':"", 'address_line2':"", 'postal_code':"", 'city':"", 'province':""}
