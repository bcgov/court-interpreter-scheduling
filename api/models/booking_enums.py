import enum


class BookingStatusEnum(str, enum.Enum):
    PENDING = 'Pending'
    BOOKED = 'Booked'
    CANCELLED = 'Cancelled'

class BookingPeriodEnum(str, enum.Enum):
    MORNING = 'MORNING'
    AFTERNOON = 'AFTERNOON'
    WHOLE_DAY = 'WHOLE_DAY'

class BookingInterpretForEnum(str, enum.Enum):
    WITNESS = 'Witness'
    PARTY = 'Party'
    ACCUSED = 'Accused'
    DISPUTANT = 'Disputant'
    APPLICANT = 'Applicant'
    RESPONDENT = 'Respondent'

class BookingMethodOfAppearanceEnum(str, enum.Enum):
    IN_PERSON = 'In-Person'
    MS_TEAMS = 'MS Teams'
    VIA_TELECONF = 'Via Teleconference'
    RIS = 'RIS'

class BookingRequestedByEnum(str, enum.Enum):
    COURT = 'Court'
    CROWN = 'Crown'
    APPLICANT = 'Applicant'
    DEFENCE = 'Defence'
    RESPONDENT = 'Respondent'
    ACCUSED = 'Accused',
    DISPUTANT = 'Disputant'