import { CompanyType } from '@enums/CompanyType'

export interface CreateShopDto {
  ownerUuid?: string
  websiteAddress: string
  name: string
}
export interface BasicInfo {
  uuid?: string
  websiteAddress: string
  name: string
}

export interface ContactInfo {
  mobilePhoneNumber: string
  landlinePhoneNumber: string
  emailAddress: string
}

export interface PostalAddress {
  state: string
  city: string
  address: string
  postalCode: NumberString
}

export interface IncorporationInfo {
  incorporationDate: string | null | Date
  announcementNumber: string
}

export interface CorporateInfo {
  officialName: string
  nationalId: string
  registrationNumber: string
  incorporationInfo: IncorporationInfo
  companyType: CompanyType | EmptyString
  businessCode: string
}

export interface UpdateShopDto extends Partial<BasicInfo> {
  corporateInfo?: CorporateInfo
  contactInfo?: ContactInfo
  postalCode?: NumberString | EmptyString
}

export interface TShopInfo extends BasicInfo {
  postalAddress?: PostalAddress
  contactInfo?: ContactInfo
  corporateInfo?: CorporateInfo
  approved: string
}

export type ShopInfo = TShopInfo | null

export type ShopInfoProps = Readonly<{
  shop: ShopInfo
  getShopInfo: () => Promise<any>
  disabled: boolean
}>
