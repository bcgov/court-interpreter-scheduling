import { interpreterLanguageInfoType } from "@/types/Interpreters/json";

export interface bookingInfoType {   
    caseName: string;
    comment: string;
    methodOfAppearance: string;
    prosecutor: string;
    reason: string;
    registry: string;
    requestedBy: string;
    room: string;
    file: string;
    interpretFor: string;
    status: string;
    federal: boolean;
    language: string;
    locationId: number;
    dates: bookingDateInfoType[];
    interpreterId: number;      
}

export interface bookingDateInfoType {
    id: number;
    date: string;
    period: string;
    arrivalTime: string;
}

export interface bookingSearchInfoType {    
    caseName: string;
    comment: string;
    methodOfAppearance: string;
    prosecutor: string;
    reason: string;
    registry: string;
    requestedBy: string;
    room: string;
    file: string;
    interpretFor: string;
    status: string;
    federal: boolean;
    language: string;
    locationId: number;
    dates: bookingDateInfoType[];
    id: number;
    interpreter: bookingInterpreterInfoType;      
}

export interface bookingInterpreterInfoType {
    id: number;
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
    languages: interpreterLanguageInfoType[];
}