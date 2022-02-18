export interface interpreterInfoType {
    id: number;
    lastName: string;
    firstName: string;
    fullAddress?:string;
    address: string;
    city: string;
    province: string;
    postal: string;
    homePhone: string;
    businessPhone: string;
    phone: string;
    email: string;
    supplier: string;
    'site_code'?: string;
    gst: string;
    comments: string;
    criminalRecordCheckDate: string;
    criminalRecordCheckComment?: string;
    contractExtension: boolean;
    languages: interpreterLanguageInfoType[]
    highestLevel?: number;
    events: [];
    bookings: [];
    adminComments: string;
}

export interface interpreterLanguageInfoType {
    level: number;
    languageName: string;
    commentOnLevel: null | string;
}



