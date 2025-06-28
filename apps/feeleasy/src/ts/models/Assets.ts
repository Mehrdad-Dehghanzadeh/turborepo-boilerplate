import { VehicleDocumens } from '@enums/VehicleDocumnetType'
import { InsuranceTypes } from '@enums/Insurance'

export interface VehiclesDetails {
  uuid?: string
  name: string
  chassisNumber: string
  engineNumber: string
  vin: string
  model: string
  manufacturer: string
  yearOfManufacture: NumberString | string
  color: string
  licensePlate: string
  thirdPartyInsurance: InsuranceType | null
}

export interface InsuranceType {
  type: InsuranceTypes.COMPREHENSIVE | InsuranceTypes.THIRD_PARTY
  insuranceNumber: string
  endDate: string | null | Date
  uniqueInsuranceCode: string
}

export interface VehiclesDto extends VehiclesDetails {
  orderUuid: string | null
  orderItemIndex: number
}

export interface VehiclesDocuments {
  name: string
  type: VehicleDocumens
  path: string
}

export interface VehiclesDocumentsDto {
  type: string
  file: File
}
