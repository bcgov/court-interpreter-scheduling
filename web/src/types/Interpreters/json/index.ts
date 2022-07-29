export interface interpreterInfoType {
    id: number;
    lastName: string;
    firstName: string;
    fullAddress?:string;
    fullName?:string;
    address: string;
    city: string;
    province: string;
    postal: string;
    homePhone: string;
    businessPhone: string;
    phone: string;
    email: string;
    supplier: string;
    siteCode?: string;
    gst: string;
    comments: string;
    criminalRecordCheckDate: string;
    criminalRecordCheckComment?: string;
    contractExtension: boolean;
    languages: interpreterLanguageInfoType[]
    highestLevel?: number;
    events: [];
    booking: [];
    adminComments: string;
}

export interface interpreterLanguageInfoType {
    languageId: number;
    level: number;
    languageName: string;
    commentOnLevel: null | string;
}



