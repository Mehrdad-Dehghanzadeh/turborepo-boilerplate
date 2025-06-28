import { BooleanPlus } from '@enums/BooleanPlus'

export interface Agent {
  uuid: string
  name: string
  websiteAddress: `www.${string}.ir`
  contactInfo: ContactInfo
  postalAddress: PostalAddress
  approved: BooleanPlus
  enabled: boolean
}

interface ContactInfo {
  mobilePhoneNumber: NumberString
  landlinePhoneNumber: NumberString
  emailAddress: string
}

interface PostalAddress {
  state: string
  city: string
  address: string
  postalCode: string
  comment: string
}

export type AgentType = Agent | null
