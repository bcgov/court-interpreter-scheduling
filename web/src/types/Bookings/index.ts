export interface bookingStatesInfoType {
    status: null | boolean;    
    location: null | boolean;   
    methodOfAppearance: null | boolean;
    dates: null | boolean;
    start: null | boolean;
    end: null | boolean;
    conflict: null | boolean;    
    cases: bookingCaseStatesInfoType[];
}

export interface bookingCaseStatesInfoType {
    tabNumber: number;
    tmpId: number;
    room: null | boolean;
    remoteLocation: null | boolean;
    vanLocation: null | boolean;
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
    bilingual: null | boolean;
    interpretationMode: null | boolean;
    antcpStartTime: null | boolean;
}

export interface paymentDetailsInfoType{

    includeCourtHrs: boolean;

    //ASL1
    courtHrRateASL1: string;
    courtTotalHrsASL1: string;
    courtTotalASL1: string;
    courtPayableFeeASL1: string;
    
    courtHrRateOldASL1: string;
    courtTotalHrsOldASL1: string;
    courtTotalOldASL1: string;
    courtPayableFeeOldASL1: string;

    //ASL2
    courtHrRateASL2: string;
    courtTotalHrsASL2: string;
    courtTotalASL2: string;
    courtPayableFeeASL2: string;

    courtHrRateOldASL2: string;
    courtTotalHrsOldASL2: string;
    courtTotalOldASL2: string;
    courtPayableFeeOldASL2: string;

    //CART
    courtHrRateCART: string;
    courtTotalHrsCART: string;
    courtTotalCART: string;
    courtPayableFeeCART: string;

    courtHrRateOldCART: string;
    courtTotalHrsOldCART: string;
    courtTotalOldCART: string;
    courtPayableFeeOldCART: string;

    //SPKL1
    courtHrRateSPKL1: string;
    courtTotalHrsSPKL1: string;
    courtTotalSPKL1: string;
    courtPayableFeeSPKL1: string;

    courtHrRateOldSPKL1: string;
    courtTotalHrsOldSPKL1: string;
    courtTotalOldSPKL1: string;
    courtPayableFeeOldSPKL1: string;

    //SPKL2
    courtHrRateSPKL2: string;
    courtTotalHrsSPKL2: string;
    courtTotalSPKL2: string;
    courtPayableFeeSPKL2: string;

    courtHrRateOldSPKL2: string;
    courtTotalHrsOldSPKL2: string;
    courtTotalOldSPKL2: string;
    courtPayableFeeOldSPKL2: string;

    //SPKL3
    courtHrRateSPKL3: string;
    courtTotalHrsSPKL3: string;
    courtTotalSPKL3: string;
    courtPayableFeeSPKL3: string;

    courtHrRateOldSPKL3: string;
    courtTotalHrsOldSPKL3: string;
    courtTotalOldSPKL3: string;
    courtPayableFeeOldSPKL3: string;

    //SPKL4
    courtHrRateSPKL4: string;
    courtTotalHrsSPKL4: string;
    courtTotalSPKL4: string;
    courtPayableFeeSPKL4: string;

    courtHrRateOldSPKL4: string;
    courtTotalHrsOldSPKL4: string;
    courtTotalOldSPKL4: string;
    courtPayableFeeOldSPKL4: string;



    travelHrRate: string;
    travelTotalHrs: string;
    travelTotal: string;
    travelPayableFee: string;

    totalCancellationFees: string;    
    cancellationBestRate: string;
    cancellationTotalHours: string;
    cancellationSubtotalFees: string;
    cancellationTotalGst: string;

    feesSubtotal: string;

    gstNumber: string;
    gstRate: string;

    feesGST: string;
    feesTotal: string;

    travelStatus: string;

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





