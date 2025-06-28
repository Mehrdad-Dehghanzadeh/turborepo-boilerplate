import type { CompanyType } from '@enums/CompanyType'
import { BooleanPlus } from '@enums/BooleanPlus'

export interface CreateLeasingCompaniesDto {
  name: string
  websiteAddress: string
  ownerUuid: string
}

export interface CompanyItem {
  name: string
  websiteAddress: string
  ownerUuid: string
  contactInfo?: ContactInfoDto
  postalAddress?: PostalAddressDto
  corporateInfo?: CorporateInfoDto
  licence?: LicenseInfoDto
  assetInfo?: AssetInfoDto
  approved: BooleanPlus
  uuid: NumberString
}

export interface CorporateInfoDto {
  officialName: string
  nationalId: string
  registrationNumber: string
  incorporationInfo: {
    incorporationDate: string | null | Date
    announcementNumber: string
  }
  companyType: CompanyType | ''
  businessCode: number | `${number}` | ''
}

export interface PostalAddressDto {
  postalCode: string
}

export interface ContactInfoDto {
  mobilePhoneNumber: string
  landlinePhoneNumber: string
  emailAddress: string
}

export interface LicenseInfoDto {
  licenseNumber: NumberString | null
  startDate: Date | null | string
  endDate: Date | null | string
}

export interface AssetInfoDto {
  registeredCapital: NumberString | null
  totalEquity: NumberString | null
}
