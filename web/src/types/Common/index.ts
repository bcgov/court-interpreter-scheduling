export interface locationShortInfoType {
    id: number;
    locationCode: string;
    name: string;
    timezone: string;
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

export interface holidaysInfoType {
    BcDay: string;
    BcFamilyDay: string;
    BoxingDay: string;
    CanadaDay: string;
    ChristmasDay: string;
    EasterMonday: string;
    GoodFriday: string;
    LabourDay: string;
    NewYearsDay: string;
    NextYearNewYearsDay: string;
    RemembranceDay: string;
    Thanksgiving: string;
    TruthAndReconciliationDay: string;
    VictoriaDay: string;
    Year: string;
}

export interface optionsInfoType {    
    text: string;
    value: string;
}