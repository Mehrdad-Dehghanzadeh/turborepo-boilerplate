import { BooleanPlus } from '@enums/BooleanPlus'

export interface OrderDto {
  providerUuid: string
  orderItemList: OrderItemListDto[]
}

export interface Order {
  uuid: string
  orderItemList: OrderItemList[]
  leasePayment: string | number
  provider: PartyInfo
  approved: BooleanPlus | any
  paid: BooleanPlus | any
  delivered: BooleanPlus | any
  customer: PartyInfo
}

export interface OrderItemListDto {
  productName: string
  unitPrice: string
  description: string
  categoryCode: string
  quantity: string
  serialNumber?: string
}

export interface OrderItemList {
  productName: string
  unitPrice: number
  description: string
  category: {
    name: string
    code: string
  }
  quantity: string
  serialNumber?: string
  assetUuid?: string
}

export interface OrderPaymentDto {
  amount: string
  paymentType?: 'CREDIT'
  leaseUuid: string
}

interface PartyInfo {
  name: string
  uuid: string
}
