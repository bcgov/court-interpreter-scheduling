export interface allUsersInfoType {
    id: number;
    display_name: string;
    email: string;
    first_name: string;
    last_name: string;
    location: locationShortInfoType;
    role: roleInfoType[];
}

export interface roleInfoType{
    id: number;
    role_name: string;
}

export interface locationShortInfoType{
    id: number;
    locationCode: string;
    name: string;
    shortDescription: string;
}



