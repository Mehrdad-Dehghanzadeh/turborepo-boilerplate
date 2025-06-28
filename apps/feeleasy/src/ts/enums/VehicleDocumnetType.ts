export enum VehicleDocumens {
  VEHICLE_TITLE = 'VEHICLE_TITLE',
  VEHICLE_INSPECTION_REPORT = 'VEHICLE_INSPECTION_REPORT',
  SALES_AGREEMENT = 'SALES_AGREEMENT',
  COMPREHENSIVE_INSURANCE = 'COMPREHENSIVE_INSURANCE',
  THIRD_PARTY_INSURANCE = 'THIRD_PARTY_INSURANCE'
}

export const VehicleDocumensList = [
  {
    title: 'برگ سبز',
    value: VehicleDocumens.VEHICLE_TITLE
  },

  {
    title: 'برگه کارشناسی',
    value: VehicleDocumens.VEHICLE_INSPECTION_REPORT
  },

  {
    title: 'مبایعه نامه',
    value: VehicleDocumens.SALES_AGREEMENT
  },

  {
    title: 'بیمه نامه بدنه',
    value: VehicleDocumens.COMPREHENSIVE_INSURANCE
  },

  {
    title: 'بیمه نامه شخص ثالث',
    value: VehicleDocumens.THIRD_PARTY_INSURANCE
  }
]
