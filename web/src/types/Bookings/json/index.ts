import { interpreterLanguageInfoType } from "@/types/Interpreters/json";

export interface bookingInfoType { //OK
    id?: number;  
    caseName: string;
    caseType: string;
    courtLevel: string;
    courtClass: string;
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
    bilingual: boolean;
    languages: bookingLanguageInfoType[];
    locationId: number;
    interpreterId: number;
    date: string;
    startTime: string;
    finishTime: string;
    actualStartTime?: string;
    actualFinishTime?: string;
    approversInitials?: string;
    cancellationComment?: string;
    cancellationDate?: string;
    cancellationFee?: string;
    cancellationReason?: string;
    cancellationTime?: string;
}

export interface bookingSearchResultInfoType{ //OK
    id?: number;
    clerkPhone:string;
    schedulingClerk:string;
    created_at:string;
    createdDate?:string;
    updated_by:string;
    interpreter: bookingInterpreterInfoType;
    dates: bookingInfoType[];
    //TODO NEW add to DB
    recordsApproved?: boolean;
    approverName?: string;
    interpreterSigned?: boolean;
    interpreterName?: string;
    interpreterSigningDate?: string;
    qualifiedReceiverSigned?: boolean;
    qualifiedReceiverName?: string;
    qualifiedReceiverSigningDate?: string;

    //Optional for ADM & PDF
    language?: string;
    level?: number;
    multipleLanguages?: string;

}

export interface bookingLanguageInfoType{ //OK
    languageId: number;
    language:string;
    level:number;
    interpretFor: string;
}

export interface bookingInterpreterInfoType { //OK
    id: number;
    lastName: string;
    firstName: string;
    fullName?: string;
    phone: string;
    email: string;
    languages: interpreterLanguageInfoType[];
    languageHistory? :string;
    highestLevel?: number;    
    fullAddress?:string;    
    address: string;
    city: string;
    province: string;
    postal: string;
}

export interface bookingAdmCancellationInfoType extends bookingInfoType{ //OK   
    time?: string;
    cancelledBy?: string; 
    cancelReason?: string;
    registryWarning?: boolean;
    reasonCd?: string;
    federalYN?: string;
    feeChanged?: boolean;
    feeDisabled?: boolean; 
}

export interface bookingAdmRecordInfoType extends bookingInfoType{ //OK
    time?: string;
    federalYN?: string;
    bilingualYN?: string;
    registryWarning?: boolean; 
    reasonCd?: string;
    reasonDesc?: string;
    courtClassDesc?: string;
    actualStartTimeState?: boolean|null;            
    actualFinishTimeState?: boolean|null;            
    approversInitialsState?: boolean|null;
}

export interface bookingDateTimesInfoType {    
    date: string;    
    bookingTimes: bookingTimeInfoType[];    
}

export interface bookingTimeInfoType{
    start: string;
    end: string;
    original?: boolean;
}

export interface dateRangeInfoType {
    startDate: string;
    endDate: string;
}

// export interface bookingDateInfoType {
//     id: number;
//     date: string;
//     period: string;
//     arrivalTime: string;
//     actualStartTime?: string;
//     finishTime?: string;
//     approversInitials?: string;
// }

// export interface bookingSearchInfoType {    
//     caseName: string;
//     comment: string;
//     methodOfAppearance: string;
//     prosecutor: string;
//     reason: string;
//     registry: string;
//     requestedBy: string;
//     room: string;
//     file: string;
//     interpretFor: string;
//     status: string;
//     federal: boolean;
//     federalYN?:string;
//     language: string;
//     multipleLanguages?:string;
//     level?:number;
//     locationId: number;
//     dates: bookingDateInfoType[];
//     id: number;
//     interpreter: bookingInterpreterInfoType;
//     created_at: string;
//     updated_by: string;
//     clerkPhone?: string; 
//     recordsApproved?: boolean;   
// }

// export interface bookingAdmInfoType extends bookingSearchInfoType{    
//     time: string;
//     date: string;
//     dateId: number;
//     actualStartTime: string;
//     finishTime: string;
//     approversInitials: string;
//     actualStartTimeState: boolean|null;
//     finishTimeState: boolean|null;
//     approversInitialsState: boolean|null;
// }



