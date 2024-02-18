export interface locationsInfoType {
    addressLine1: string|null;
    addressLine2: string|null;
    city: string|null;
    createdAt: string;
    id: number;
    latitude: number;
    locationCode: string;
    longitude: number;
    name: string;
    timezone: string;
    postalCode: string|null;
    shortDescription: string;
    updatedAt: string;
}

export interface languagesInfoType {
    id: number;
    name: string;
}