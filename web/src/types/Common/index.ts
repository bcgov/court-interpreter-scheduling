export interface locationShortInfoType {
    id: number;
    locationCode: string;
    name: string;
    shortDescription: string;
}

export interface ratesInfoType {

    mileage: number;
    lodge: number;
   
    breakfast: number;
    lunch: number;
    dinner: number;
  
    spkl1: number;
    spkl2: number;
    spkl3: number;
    spkl4: number;  
    asl1: number;
    asl2: number;
    cart: number;
}

export interface rateJsonInfoType {
    id: number;
    name: string;
    value: number;
    previousValue: number;
    valueChangedDate: string;
}