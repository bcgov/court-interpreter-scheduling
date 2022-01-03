import requests
import re

from core.config import settings

def get_geo(address, google_map):

    if google_map == True:
        url = settings.GOOGLE_MAP_URL.format(address)
    else:   
        url = settings.OPENROAD_MAP_URL.format(address)
    
    response = requests.get(url)
    return response.json()

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
    
    # google_map = True
    # address = "BC, Canada"
    
    # response = get_geo(address, google_map)
    # # print(response)
    # if response['status'] == 'REQUEST_DENIED':
    #     google_map = False


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
    
    address_line = address_line1.lower() + ", " + address_line2.lower()    
    # print("____")
    # print(address_line) 

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
    
    # print(address_line)


    # address_line

    address = f"{address_line}, {city}, {postal_code}, {province}, {country}"
    found_locations = get_geo(address, google_map)   
    
    if len(found_locations)==0:
        address = f"{address_line}, {city}, {province}, {country}"
        found_locations = get_geo(address, google_map)

    if len(found_locations)==0:
        if "ave." in address_line or "avenue" in address_line:
            address_line_tmp = re.sub( "ave\.", "st.", address_line)
            address_line_tmp = re.sub( "avenue", "street", address_line_tmp)
        else:
            address_line_tmp = re.sub( "st\.", "ave.", address_line)
            address_line_tmp = re.sub( "street", "avenue", address_line_tmp)

        address = f"{address_line_tmp}, {city}, {province}, {country}"
        found_locations = get_geo(address, google_map)
    
    if len(found_locations)==0:
        address_line = re.sub( "(?<!\S)\d+(?!\S)", "", address_line)
        address_line = re.sub( "[0-9]+-[0-9]+", "", address_line)
        # print("+++++++++++++++")
        # print(address_line)
        address = f"{address_line}, {city}, {province}, {country}"
        found_locations = get_geo(address, google_map)
    
    if len(found_locations)==0:
        # print("======================")
        # print(city)
        address = f"{city}, {province}, {country}"
        # print(address)
        found_locations = get_geo(address, google_map)
    
    # print(len(found_locations))
    # print(found_locations)

    # return len(found_locations)

    if len(found_locations)==1:
        return found_locations[0]["lat"], found_locations[0]["lon"]
    else:
        for found_location in found_locations:
            if found_location['type'] == "administrative":
                return found_location["lat"], found_location["lon"]

        return found_locations[0]["lat"], found_locations[0]["lon"]

