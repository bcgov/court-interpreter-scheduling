export enum bookingStatus {'Pending'='Pending', 'Booked'='Booked', 'Cancelled'='Cancelled'}
export enum bookingPeriod {'Morning'='MORNING', 'Afternoon'='AFTERNOON', 'Full Day'='WHOLE_DAY'}
export enum bookingMethodOfAppearance {'In Person'='In-Person', 'MS Teams'='MS Teams', 'Via Teleconference'='Via Teleconference', 'RIS'='RIS'}
export enum bookingRequest {'Court'='Court', 'Crown'='Crown', 'Applicant'='Applicant', 'Defence'='Defence', 'Respondent'='Respondent'}
export enum bookingInterpretFor {'Witness'='Witness', 'Party'='Party', 'Accused'='Accused'}

export const statusOptions = [
    {text: 'Pending',         value: bookingStatus.Pending}, 
    {text: 'Booked',          value: bookingStatus.Booked},
    {text: 'Cancelled',       value: bookingStatus.Cancelled}
]

export const interpreterRequestOptions = [
    {text: 'Witness',       value: bookingInterpretFor.Witness}, 
    {text: 'Party',         value: bookingInterpretFor.Party},
    {text: 'Accused',       value: bookingInterpretFor.Accused}
]

export const requestOptions = [
    {text: 'Court',         value: bookingRequest.Court}, 
    {text: 'Crown',         value: bookingRequest.Crown},
    {text: 'Applicant',     value: bookingRequest.Applicant},
    {text: 'Defence',       value: bookingRequest.Defence},
    {text: 'Respondent',    value: bookingRequest.Respondent}
]

export const bookingPeriodOptions = [
    {text: 'Full Day',      value: bookingPeriod['Full Day']}, 
    {text: 'Morning',       value: bookingPeriod.Morning},
    {text: 'Afternoon',     value: bookingPeriod.Afternoon}
]

export const bookingMethodOfAppearanceOptions = [
    {text: 'In Person',            value: bookingMethodOfAppearance['In Person']}, 
    {text: 'MS Teams',             value: bookingMethodOfAppearance['MS Teams']},
    {text: 'Afternoon',            value: bookingMethodOfAppearance['Via Teleconference']},
    {text: 'Via Teleconference',   value: bookingMethodOfAppearance.RIS}
] 

export const interpretForOptions = [
    {text: 'Witness',       value: bookingInterpretFor.Witness}, 
    {text: 'Party',         value: bookingInterpretFor.Party},
    {text: 'Accused',       value: bookingInterpretFor.Accused}
]
