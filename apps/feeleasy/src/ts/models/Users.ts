import { EducationLevel } from '@enums/EducationLevel'
import { Gender } from '@enums/Gender'
import { MaritalStatus } from '@enums/MaritalStatus'
import { PartyCategory } from '@enums/PartyCategory'
import type { ResponseErrorItemsList } from '@type/Apis'

type Status = 'GRANTED' | 'REJECTED' | 'REQUESTED'

export interface SendOtpDto {
  mobilePhoneNumber: NumberString
  intent: string
}

export interface CheckOtp {
  mobilePhoneNumber: NumberString
  verificationCode: NumberString
}

export interface CheckPasswordOtpDto {
  verificationCode: NumberString
  intent: 'VERIFY_MOBILE'
}

export interface SetCredentialDto {
  password: string
  email: string
}

export interface UserNationalCardDto {
  firstName: string
  lastName: string
  nationalCode: string
  dateOfBirth: string | null | Date
}

export interface ContactInfoDto {
  mobilePhoneNumber: string
  emailAddress: string
  landlinePhoneNumber: string
}

export interface PostalAddressDto {
  comment: string
}

export interface PersonalInfoDto {
  gender: keyof typeof Gender | ''
  maritalStatus: keyof typeof MaritalStatus | ''
  educationLevel: keyof typeof EducationLevel | ''
}

export interface IdentityCardDto {
  identityNumber: string
  fatherName: string
  birthPlace: string
  idIssuePlace: string
}

export type HeadLine = {
  headline1: string
  headline2: string
}

export type ContributionItem = {
  partyId: string
  partyCategory: PartyCategory
  partyName: string
  role: string
}

export type Contributions = ContributionItem[]

export interface ValidationUser {
  valid: boolean
  items: ResponseErrorItemsList
  itemsTranslation: string[]
}

export interface ProfileSetting {
  viewAddShopForm: boolean
  viewAddLeasingCompanyForm: boolean
}

export interface Verification {
  mobilePhoneNumberVerified: Status
  simCardOwnershipConfirmed: Status
  identityCardVerified: Status
  postalAddressValid: Status
  verifiedIban: string | null
}
