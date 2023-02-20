import { interpreterLanguageInfoType } from "@/types/Interpreters/json";

export interface bookingCaseInfoType { //OK
    id?: number;

    tmpId?: number;

    file: string; 
    caseName: string;
    room: string;

    caseType: string;
    courtLevel: string;
    courtClass: string;
    reason: string;

    bilingual: boolean;
    interpretationMode: string;

    language: interpreterLanguageInfoType;
    interpretFor: string;

    federal: boolean;
    prosecutor: string;

    remoteRegistry: string;
    remoteLocationId: number;

    vanRegistry: string;
    vanLocationId: number;    

    requestedBy: string;
    methodOfAppearance: string;
    
}

export interface bookingInfoType { //OK
    id?: number;
    cases: bookingCaseInfoType[];   
    comment: string;
    methodOfAppearance: string;   
    registry: string;
    status: string;
    
    languages: bookingLanguageInfoType[]; //TODO
    
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
    location_id: number;
    location_name: string; 
    
    recordsApproved?: boolean;
    approverName?: string;
    interpreterSigned?: boolean;    
    interpreterSigningDate?: string;
    qualifiedReceiverSigned?: boolean;    
    qualifiedReceiverSigningDate?: string;
    feesGST: number;
    feesTotal: number;
    expenseGST: number;
    expenseTotal: number;
    invoiceTotal: number;
    invoiceDate: string;
    invoiceNumber: string;
    admDetail: any;
    adm_updated_by: string;

    //Optional for ADM & PDF
    language?: string;
    level?: number;
    multipleLanguages?: string;

    interpreterName?: string;

    formSender?: string;
    formSenderEmail?: string;
    formRecipientEmail?: string;
    formSentDate?: string;

    invoiceSender?: string;
    invoiceSenderEmail?: string;
    invoiceRecipientEmail?: string;
    invoiceSentDate?: string;
}

export interface bookingLanguageInfoType{ //NOT-OK  //TODO
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
    languageHistory? :languageHistoryInfoType[];
    highestLevel?: number;    
    fullAddress?:string;    
    address: string;
    city: string;
    province: string;
    postal: string;
    supplier?: string;
    siteCode?: string;
    gst?: string;
    addressLatitude?: number;
    addressLongitude?: number;
    courts?: courtsDistanceInfoType[];
}

export interface courtsDistanceInfoType {
    court_code: string;
    court_id: number;
    distance: number;
    duration: number;
    interpreter_id: number;
}

export interface languageHistoryInfoType {
    disabled?: boolean;
    effective_date: string;
    language: string;
    language_id?: number;
    level: number;
    prvlevel: number;
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
    startAfterFinishState?: boolean|null;
    sessionLargerThan8hrsWarning?: boolean|null;

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




export interface officeUseOnlyVars{    
    addressVerified: string;
    addressInstructions: string;    
    expenseAuthorityName: string;
    contractNumber: string;
    payStubComment: string;
    additionalInstructions: string;
}

export interface paymentDetailsVars{
    invoiceTotalAmount: number;
    totalPaidByCourt: number;
    totalPaidByCrown: number;
    lodgingRate: number;
    lodgingGST: number;
    ferryExp: number;
    ferryGST: number;
    miscExp: number;
    miscGST: number; 
}

//__________calculation______

export interface calculationVars{    
    totalInterpretingHours: totalInterpretingHoursInfoType;
    travelInformation: travelInformationInfoType;
    cancellation: cancellationInfoType;
    gst: gstInfoType;
}

export interface totalInterpretingHoursInfoType {
    SPKL1: number;
    OldSPKL1: number;
    SPKL2: number;
    OldSPKL2: number;
    SPKL3: number;
    OldSPKL3: number;
    SPKL4: number;
    OldSPKL4: number;
    ASL1: number;
    OldASL1: number;
    ASL2: number;
    OldASL2: number;
    CART: number;
    OldCART: number;
}

export interface travelInformationInfoType {
    startDate: string;
    status: string; 
    totalHours: number;
    totalKilometers: number; 
    breakfast: number; 
    lunch: number; 
    dinner: number;
}

export interface sentEmailContentInfoType {
    attachments: string;
    body: string;
    from: string;
    subject: string;
    to: string;
}

export interface cancellationInfoType {
    totalFees: number;
}

export interface gstInfoType {
    gstRate: number;
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



