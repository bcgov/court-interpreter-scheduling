export interface bookingStatesInfoType {
    status: null | boolean;
    room: null | boolean;
    location: null | boolean;
    file: null | boolean;
    interpretFor: null | boolean;
    caseName: null | boolean;
    caseType: null | boolean;
    courtLevel: null | boolean;
    courtClass: null | boolean;
    courtClassOther: null | boolean;
    request: null | boolean;
    language: null | boolean;
    federal: null | boolean;    
    prosecutor: null | boolean;
    reason: null | boolean;
    reasonOther: null | boolean;
    methodOfAppearance: null | boolean;
    dates: null | boolean;
    start: null | boolean;
    end: null | boolean;
    conflict: null | boolean;
    bilingual: null | boolean;
}

export interface paymentDetailsInfoType{
    courtHrRate: string;
    courtTotalHrs: string;
    courtTotal: string;
    courtPayableFee: string;

    travelHrRate: string;
    travelTotalHrs: string;
    travelTotal: string;
    travelPayableFee: string;

    feesSubtotal: string;

    gstNumber: string;
    gstRate: string;

    feesGST: string;
    feesTotal: string;

    travelKMsRate: string;
    travelTotalKMs: string;
    travelSubExp: string;
    travelTotalExp: string;

    breakfastRate: string;
    breakfastTotalDays: string;
    breakfastSubExp: string;
    breakfastTotalExp: string;

    lunchRate: string;
    lunchTotalDays: string;
    lunchSubExp: string;
    lunchTotalExp: string;

    dinnerRate: string;
    dinnerTotalDays: string;
    dinnerSubExp: string;
    dinnerTotalExp: string;

    lodgingRate: string;
    lodgingTotalDays: string;
    lodgingSubExp: string;
    lodgingGST: string;
    lodgingTotalExp: string;

    ferryExp: string;
    ferrySubExp: string;
    ferryGST: string;
    ferryTotalExp: string;

    miscExp: string;
    miscSubExp: string;
    miscGST: string;
    miscTotalExp: string;

    expPreGST: string;
    expTotalGST: string;
    expTotal: string;

    expPayable: string;
    GSTifApplic: string;
    totalExpenses: string;
    totalPayable: string;
    
    totalPaidByCourt: string;
    totalPaidByCrown: string;
}





