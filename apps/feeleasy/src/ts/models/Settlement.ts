export interface SettlementDto {
  amount: number | string
  dateTime: any | Date
  description: string
  trackingNumber: number | string
  source: string
  destination: string
  sourceIdentity: string
  destinationIdentity: string
  settlementMethod: string
}
