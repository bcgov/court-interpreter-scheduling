export interface interpreterInfoType {
    id: number;
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    province: string;
    postal: string;
    homePhone: string;
    businessPhone: string;
    phone: string;
    email: string;
    supplier: string;
    gst: string;
    comments: string;
    criminalRecordCheckDate: string;
    contractExtension: boolean;
    languages: interpreterLanguageInfoType[]
    events: [];
    bookings: [];
    adminComments: string;
}

export interface interpreterLanguageInfoType {
    level: number;
    languageName: string;
    commentOnLevel: null | string;
}



