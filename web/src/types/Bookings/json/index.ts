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
    status: string;
    federal: boolean;
    languages: bookingLanguageInfoType[];
    locationId: number;
    interpreterId: number;
    date: string;
    arrivalTime: string;
    actualStartTime?: string;
    finishTime?: string;
    approversInitials?: string;
}

export interface bookingLanguageInfoType{
    language:string;
    level:number;
    interpretFor: string;
}

export interface bookingDateInfoType {
    id: number;
    date: string;
    period: string;
    arrivalTime: string;
    actualStartTime?: string;
    finishTime?: string;
    approversInitials?: string;
}

export interface bookingDateTimesInfoType {    
    date: string;    
    bookingTimes: string[];    
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
    federalYN?:string;
    language: string;
    multipleLanguages?:string;
    level?:number;
    locationId: number;
    dates: bookingDateInfoType[];
    id: number;
    interpreter: bookingInterpreterInfoType;
    created_at: string;
    updated_by: string;
    clerkPhone?: string; 
    recordsApproved?: boolean;   
}

export interface bookingAdmInfoType extends bookingSearchInfoType{    
    date: string;
    dateId: number;
    actualStartTime: string;
    finishTime: string;
    approversInitials: string;
    actualStartTimeState: boolean|null;
    finishTimeState: boolean|null;
    approversInitialsState: boolean|null;
}

export interface bookingInterpreterInfoType {
    id: number;
    lastName: string;
    firstName: string;
    fullName?: string;
    phone: string;
    email: string;
    languages: interpreterLanguageInfoType[];
    highestLevel?: number;    
    fullAddress?:string;    
    address: string;
    city: string;
    province: string;
    postal: string;
}

export interface dateRangeInfoType {
    startDate: string;
    endDate: string;
}