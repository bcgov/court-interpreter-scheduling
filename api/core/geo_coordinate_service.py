import requests
import re
from fastapi import status, HTTPException
from core.config import settings
from urllib.parse import quote
import logging
logger = logging.getLogger(__name__)


def call_geo_service(court_address, interpreter_address):
    # print(court_code)
    url = settings.GOOGLE_MAP_URL.format(quote(interpreter_address), quote(court_address))
    # print(url)
    
    response = requests.get(url)
    result = response.json()
    # print("_____")
    # print(response)
    # print(result)
    # print("__")

    route = {
        "distance": 0,
        "duration": 0,
        "court_latitude": 0.0,
        "court_longitude": 0.0,
        "interpreter_latitude": 0.0,
        "interpreter_longitude": 0.0
    }
    
    try:
        route_base = result['routes'][0]['legs'][0]
        route["distance"] = route_base['distance']['value']
        route["duration"] = route_base['duration']['value']
        route["court_latitude"] = route_base['end_location']['lat']
        route["court_longitude"] = route_base['end_location']['lng']
        route["interpreter_latitude"] = route_base['start_location']['lat']
        route["interpreter_longitude"] = route_base['start_location']['lng']        
    except:
        logger.error(f"Google Route NOT found ({interpreter_address}) __TO__ ({court_address})!")

    # print(route)

    # raise HTTPException(status_code=400, detail=f"Terminate.")
    return route

    

def get_name_of_province(abvr):
    states={
        'BC':'British Columbia', 
        'ON':'Ontario', 
        'ONT':'Ontario', 
        'QC':'Quebec', 
        'AB':'Alberta', 
        'SK':'Saskatchewan', 
        'MB':'Manitoba',
        'NL':'Newfoundland and Labrador',
        'PE':'Prince Edward Island',
        'NS':'Nova Scotia',
        'NB':'New Brunswick',
        'YT':'Yukon',
        'NT':'Northwest Territories',
        'NU':'Nunavut',
        'WA':'Washington',
    }
    if abvr == "WA":
        country="USA"
    else:
        country="CANADA"
    return states[abvr], country


def remove_space(address):
    address = re.sub(' +', ' ', address)
    address = address.replace(", ,", ",")
    address = re.sub(', ,', ',', address)
    address = re.sub('^,', '', address)   
    return address.strip()


def get_clean_address(address_line1, address_line2, city, postal_code, province):
    

    if address_line1 is None: address_line1 = ""
    if address_line2 is None: address_line2 = ""
    if city is None: city = ""
    if postal_code is None: postal_code = ""
    if province is None: province = ""

    province = re.sub(" +", " ", province)

    if len(province)>0 and len(province)<4: 
        province,country = get_name_of_province(province.upper())
    else:
        country="CANADA"

    city = re.sub(" +", " ", city)
    city = city.lower()

    if city == "van": city="vancouver"
    if city == "north van": city="north vancouver"
    if city == "west Van": city="west vancouver"
    if city == "new west": city="new westminster"
    if city == "buranby": city="burnaby"
    if city == "vacnouver": city="vancouver"
    if city == "conrich rockyview county": city="conrich"
    if city == "massett" : city="masset"
    if city == "leech town" : city="leechtown"
    if city == "hudsons hope" : city="hudson's hope"
    if city == "kelowna" and "Sparwood" in address_line1: city="sparwood"

    address_line1 = address_line1.replace("R.R.#", "")
    address_line2 = address_line2.replace("R.R.#", "") 
    # address_line1 = address_line1.replace("#", "no ")
    # address_line2 = address_line2.replace("#", "no ")
    address_line2 = address_line2.replace("PO ", "Post Office")
    address_line2 = address_line2.replace("Suite ", "no ")
    address_line2 = address_line2.replace("Unit ", "no ")
    address_line2 = address_line2.replace("Apt", "") 
    
    address_line = address_line1.lower() # + ", " + address_line2.lower()    
    
    address_line = address_line.replace("c/o ", "")

    # Remove Bag 123 or Box 123 
    address_line = re.sub( "p.o. box [0-9]+", "", address_line)
    address_line = re.sub( "bag [0-9]+,", "", address_line)
    address_line = re.sub( "box [0-9]+,", "", address_line)
    address_line = re.sub( "bag [0-9]+", "", address_line)
    address_line = re.sub( "box [0-9]+", "", address_line)
    address_line = re.sub( "bag[0-9]+,", "", address_line)
    address_line = re.sub( "box[0-9]+,", "", address_line)
    address_line = re.sub( "bag[0-9]+", "", address_line)
    address_line = re.sub( "box[0-9]+", "", address_line)    
    
    # Typos
    address_line = re.sub( "yellowhwad", "yellowhead", address_line)
    address_line = re.sub( "mirtle", "Murtle", address_line)
    

    address = f"{address_line}, {city}, {postal_code}, {province}, {country}"
    address = remove_space(address)
    # print(address)

    return address