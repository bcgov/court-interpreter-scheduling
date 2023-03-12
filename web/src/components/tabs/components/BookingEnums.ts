export enum bookingStatus {
    'Pending'='Pending', 
    'Booked'='Booked', 
    'Cancelled'='Cancelled'
};

export const statusOptions = [
    {text: 'Pending',         value: bookingStatus.Pending}, 
    {text: 'Booked',          value: bookingStatus.Booked},
    {text: 'Cancelled',       value: bookingStatus.Cancelled}
]


export enum bookingMethodOfAppearance {
    'In Person'='In-Person', 
    'MS Teams'='MS Teams', 
    'Via Teleconference'='Via Teleconference', 
    'RIS'='RIS'
}
export const bookingMethodOfAppearanceOptions = [
    {text: 'In Person',           value: bookingMethodOfAppearance['In Person']}, 
    {text: 'MS Teams',            value: bookingMethodOfAppearance['MS Teams']},
    {text: 'Via Teleconference',  value: bookingMethodOfAppearance['Via Teleconference']},
    {text: 'RIS',                 value: bookingMethodOfAppearance.RIS}
] 


export enum bookingInterpretFor {
    'Witness'='Witness', 
    'Party'='Party', 
    'Accused'='Accused'
}
export const interpretForOptions = [
    {text: 'Witness',       value: bookingInterpretFor.Witness}, 
    {text: 'Party',         value: bookingInterpretFor.Party},
    {text: 'Accused',       value: bookingInterpretFor.Accused}
]


export enum bookingRequest {
    'Court'='Court', 
    'Crown'='Crown', 
    'Applicant'='Applicant', 
    'Defence'='Defence', 
    'Respondent'='Respondent'
}
export const requestOptions = [
    {text: 'Court',         value: bookingRequest.Court}, 
    {text: 'Crown',         value: bookingRequest.Crown},
    {text: 'Applicant',     value: bookingRequest.Applicant},
    {text: 'Defence',       value: bookingRequest.Defence},
    {text: 'Respondent',    value: bookingRequest.Respondent}
]


export enum bookingPeriod {
    'Morning'='MORNING', 
    'Afternoon'='AFTERNOON', 
    'Full Day'='WHOLE_DAY'
}
export const bookingPeriodOptions = [
    {text: 'Full Day',      value: bookingPeriod['Full Day']}, 
    {text: 'Morning',       value: bookingPeriod.Morning},
    {text: 'Afternoon',     value: bookingPeriod.Afternoon}
]


export enum caseType {
    'Criminal'='Criminal', 
    'Civil'='Civil'
}
export const caseTypeOptions = [
    {text: 'Criminal',   value: caseType.Criminal}, 
    {text: 'Civil',      value: caseType.Civil}
]


export enum courtLevel {
    'Provincial'='Provincial',
    'Supreme'='Supreme',
    'Court of Appeal'='Court of Appeal'
}
export const courtLevelOptions = [
    {text: 'Provincial',   value: courtLevel.Provincial}, 
    {text: 'Supreme',   value: courtLevel.Supreme},
    {text: 'Court of Appeal',   value: courtLevel['Court of Appeal']}
]


export enum criminalCourtClass {
    'Adult'='Adult',
    'Ticket (Traffic/Bylaw)'='Ticket (Traffic/Bylaw)',
    'Youth'='Youth'    
}
export const criminalCourtClassOptions = [
    {text: 'Adult',                   value: criminalCourtClass.Adult},
    {text: 'Ticket (Traffic/Bylaw)',  value: criminalCourtClass['Ticket (Traffic/Bylaw)']},
    {text: 'Youth',                   value: criminalCourtClass.Youth},
    {text: 'Other',                   value: 'OTHER'}
]


export enum civilCourtClass {
    'Bankruptcy and insolvency'='Bankruptcy and insolvency',
    'Small Claims'='Small Claims',
    'Family Law Proceeding (Divorce Act and Family Law Act)'='Family Law Proceeding (Divorce Act and Family Law Act)',
    'Family'='Family',
    'Divorce'='Divorce',
    'Foreclosure'='Foreclosure',
    'Enforcement Proceedings'='Enforcement Proceedings',
    'Motor Vehicle Accidents'='Motor Vehicle Accidents',
    'Adoption'='Adoption',
    'Appeal Civil'='Appeal Civil',
    'Probate and Administration'='Probate and Administration',
    'Appeal Criminal'='Appeal Criminal',
    'Supreme Civil (General)'='Supreme Civil (General)',
    'Caveat'='Caveat'
}
export const civilCourtClassOptions = [
    {text: 'Bankruptcy and insolvency',   value: civilCourtClass['Bankruptcy and insolvency']}, 
    {text: 'Small Claims',                value: civilCourtClass['Small Claims']},
    {text: 'Family Law Proceeding (Divorce Act and Family Law Act)',  value: civilCourtClass['Family Law Proceeding (Divorce Act and Family Law Act)']}, 
    {text: 'Family',                      value: civilCourtClass.Family},
    {text: 'Divorce',                      value: civilCourtClass.Divorce},
    {text: 'Foreclosure',                 value: civilCourtClass.Foreclosure}, 
    {text: 'Enforcement Proceedings',     value: civilCourtClass["Enforcement Proceedings"]},
    {text: 'Motor Vehicle Accidents',     value: civilCourtClass["Motor Vehicle Accidents"]}, 
    {text: 'Adoption',                    value: civilCourtClass.Adoption},
    {text: 'Appeal Civil',                value: civilCourtClass["Appeal Civil"]}, 
    {text: 'Probate and Administration',  value: civilCourtClass["Probate and Administration"]},
    {text: 'Appeal Criminal',             value: civilCourtClass["Appeal Criminal"]}, 
    {text: 'Supreme Civil (General)',     value: civilCourtClass["Supreme Civil (General)"]},
    {text: 'Caveat',                      value: civilCourtClass.Caveat},
    {text: 'Other',                       value: 'OTHER'}
]

export enum reasonCodeClass {
    'CLC'='Consult legal counsel', 
    'CNT'='Continuation',  
    'DSP'='Disposition', 
    'FA'='First Appearance',
    'FT'='For Trial',
    'FXD'='Fix date',
    'HR'='Hearing',
    'IAR'='Initial appearance',
    'JIR'='Judicial interim release',
    'DA'='Divorce Act',
    'FSC'='Family settlement conference',
    'JSL'='Jury selection',
    'OTHER'='Other'   
}
export const reasonCodeClassOptions = [
    {text: 'CLC-Consult legal counsel',    value: "CLC"},
    {text: 'FA-First Appearance',          value: "FA"},
    {text: 'FT-For Trial',                 value: "FT"},
    {text: 'DSP-Disposition',              value: "DSP"},
    {text: 'CNT-Continuation',             value: "CNT"},
    {text: 'FXD-Fix date',                 value: "FXD"},
    {text: 'HR-Hearing',                   value: "HR"},
    {text: 'IAR-Initial appearance',       value: "IAR"},
    {text: 'JIR-Judicial interim release', value: "JIR"},
    {text: 'DA-Divorce Act',               value: "DA"},
    {text: 'FSC-Family settlement conference', value: "FSC"},
    {text: 'JSL-Jury selection',           value: "JSL"},
    {text: 'Other',                        value: "OTHER"}    
]

export enum bookingInterpretationMode {
    'Consecutive'='Consecutive',
    'Simultaneous'='Simultaneous',
    'Both'='Both'
}
export const bookingInterpretationModeOptions = [
    {text: 'Consecutive',   value: bookingInterpretationMode.Consecutive}, 
    {text: 'Simultaneous',  value: bookingInterpretationMode.Simultaneous},
    {text: 'Both',          value: bookingInterpretationMode.Both}
]