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