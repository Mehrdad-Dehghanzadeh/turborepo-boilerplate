type AuthType = 'KYC' | 'SCORING' | 'REPAYMENT_CHEQUE' | 'GUARANTEE_CHEQUE'

export interface OtpIntent {
  intent: 'CREDIT_SCORING_INQUIRIES'
}

export interface OtpResponse {
  sent: boolean
  trackingCode: string
}

export interface ScoringDto {
  mobilePhoneNumber: string
  nationalCode: NumberString
  type: AuthType
  subjectUuid: string
  otp: {
    value: NumberString
    intent: 'CREDIT_SCORING_INQUIRIES'
    reference: string
  }
}

export interface ChequeInquiryDto {
  type: AuthType
  subjectUuid: string | number | any
  chequeParameters: ChequeParameters[]
}

export interface ChequeParameters {
  identifier: NumberString
  dueDate: Date | string
  amount: number
}

export interface AuthenticationDto {
  nationalCode: NumberString
  dateOfBirth: Date | string
  postalCode: NumberString
  mobilePhoneNumber: NumberString
  iban: string
  type?: AuthType
  subjectUuid: NumberString
}

export interface FormData {
  chequeParameters: {
    amount: string
    identifier: string
    dueDate: string | Date
  }
  secondaryId: number
}

export interface GuaranteeChequeInquiryDto extends FormData {
  type: 'GUARANTEE_CHEQUE'
  subjectUuid: string
}
