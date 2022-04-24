export interface locationShortInfoType {
    id: number;
    locationCode: string;
    name: string;
    shortDescription: string;
}

export interface ratesInfoType {
    meals: mealAllowanceInfoType;
    spokenLanguage: spokenLanguageInfoType;
    aslLanguage: aslInfoType;
    mileage: string;
    lounge: string;
}

export interface mealAllowanceInfoType {    
    breakfast: string;
    lunch: string;
    dinner: string;
}

export interface spokenLanguageInfoType {    
    level1: string;
    level2: string;
    level3: string;
    level4: string;
}

export interface aslInfoType {    
    level1: string;
    level2: string;
}