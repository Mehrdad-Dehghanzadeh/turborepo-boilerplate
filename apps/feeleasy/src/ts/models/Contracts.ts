import { BooleanPlus } from '@enums/BooleanPlus'

interface Party {
  name: string
  uuid: NumberString
}

export interface ContractParties {
  party: Party
  partyCategory: 'INDIVIDUAL' | 'LEGAL'
  signatory: null
  signed: BooleanPlus
}

export default interface Contract {
  uuid: NumberString
  referenceUuid: NumberString
  markedUpTerm: string
  dulyExecuted: boolean
  contractParties: ContractParties[]
}

export interface SendOtpPayload {
  intent: 'SIGN_LEASE_CONTRACT'
  referenceUuid: string
}

export interface SigninigContractPayload {
  principalUuid: NumberString
  signatoryUuid: NumberString
  otp: NumberString
}
