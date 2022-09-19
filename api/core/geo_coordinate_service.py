import requests
import re
from fastapi import status, HTTPException
from core.config import settings

def get_geo(address, google_map):

    if google_map == True:
        url = settings.GOOGLE_MAP_URL.format(address)
        response = requests.get(url)
        result = response.json()
        return result['results'], result['status']
    else:   
        url = settings.OPENROAD_MAP_URL.format(address)
        response = requests.get(url)
        return response.json(), None
    
    

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

def get_latitude_longitude_service(address_line1, address_line2, city, postal_code, province, google_map):
    

    if address_line1 is None: address_line1 = ""
    if address_line2 is None: address_line2 = ""
    if city is None: city = ""
    if postal_code is None: postal_code = ""
    if province is None: province = ""

    if len(province)<4: 
        province,country = get_name_of_province(province.upper())
    else:
        country="CANADA"

    city = city.lower()

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
    address_line1 = address_line1.replace("#", "no ")
    address_line2 = address_line2.replace("#", "no ")
    address_line2 = address_line2.replace("PO ", "Post Office")
    address_line2 = address_line2.replace("Suite ", "no ")
    address_line2 = address_line2.replace("Unit ", "no ")
    address_line2 = address_line2.replace("Apt", "") 
    
    address_line = address_line1.lower() + ", " + address_line2.lower()    

    # Remove Bag 123 or Box 123  
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
    found_locations, google_map_status = get_geo(address, google_map) 

    if google_map==True and google_map_status == 'REQUEST_DENIED':
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Please review the google map subscription.")

    
    if len(found_locations)==0:
        address = f"{address_line}, {city}, {province}, {country}"
        address = remove_space(address)
        found_locations, google_map_status = get_geo(address, google_map)

    if len(found_locations)==0 and '-' in address_line:
        line = address_line.split('-')[1]
        address = f"{line}, {city}, {province}, {country}"
        address = remove_space(address)
        found_locations, google_map_status = get_geo(address, google_map)

    if len(found_locations)==0:
        if "ave." in address_line or "avenue" in address_line:
            address_line_tmp = re.sub( "ave\.", "st.", address_line)
            address_line_tmp = re.sub( "avenue", "street", address_line_tmp)
        else:
            address_line_tmp = re.sub( "st\.", "ave.", address_line)
            address_line_tmp = re.sub( "street", "avenue", address_line_tmp)

        address = f"{address_line_tmp}, {city}, {province}, {country}"
        address = remove_space(address)
        found_locations, google_map_status = get_geo(address, google_map)
    
    if len(found_locations)==0:
        address_line = re.sub( "(?<!\S)\d+(?!\S)", "", address_line)
        address_line = re.sub( "[0-9]+-[0-9]+", "", address_line)
        address = f"{address_line}, {city}, {province}, {country}"
        address = remove_space(address)
        found_locations, google_map_status = get_geo(address, google_map)
    
    if len(found_locations)==0:        
        address = f"{city}, {province}, {country}"
        address = remove_space(address)        
        found_locations, google_map_status = get_geo(address, google_map)
    


    if google_map == True:
        if len(found_locations)==1:
            return found_locations[0]["geometry"]["location"]["lat"], found_locations[0]["geometry"]["location"]["lng"]
        else:
            for found_location in found_locations:
                if "courthouse" in found_location['types'] :
                    return found_location["geometry"]["location"]["lat"], found_location["geometry"]["location"]["lng"]

            return found_locations[0]["geometry"]["location"]["lat"], found_locations[0]["geometry"]["location"]["lng"]

    else:
        if len(found_locations)==1:
            return found_locations[0]["lat"], found_locations[0]["lon"]
        else:
            for found_location in found_locations:
                if found_location['type'] == "administrative":
                    return found_location["lat"], found_location["lon"]

            return found_locations[0]["lat"], found_locations[0]["lon"]


def remove_space(address):
    address = re.sub(' +', ' ', address)
    address = re.sub(', ,', ',', address)
    return address