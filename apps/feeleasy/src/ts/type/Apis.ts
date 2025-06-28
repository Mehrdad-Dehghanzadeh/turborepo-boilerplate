export type TApis = {
  auth: any
  users: any
  leasingCompanies: any
  productCategoryGroups: any
  leasingProtocols: any
  leaseRequests: any
  shop: any
  orders: any
  leases: any
  wallet: any
  transactions: any
  inquiry: any
  contract: any
  repayment: any
  assets: any
  guarantee: any
  repaymentCheques: any
  invoice: any
  leasingAgent: any
}

export type Resource = keyof TApis

export type ResponseErrorItem = {
  name: string
  value: string | null
  type?: string
  description: string
  expected?: string
}

export type ResponseErrorItemsList = ResponseErrorItem[]
