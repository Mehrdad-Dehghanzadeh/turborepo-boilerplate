import { EnumList } from '@type/Enums'

export enum FacilityTypes {
  QARZ_ALHASANAH = 'QARZ_ALHASANAH',
  MUSHARAKA_MADANI = 'MUSHARAKA_MADANI',
  MUSHARAKA_HOQOQI = 'MUSHARAKA_HOQOQI',
  DIRECT_INVESTMENT = 'DIRECT_INVESTMENT',
  MOZARABA = 'MOZARABA',
  SALAF_TRANSACTIONS = 'SALAF_TRANSACTIONS',
  INSTALLMENT_SALE_RAW_MATERIALS = 'INSTALLMENT_SALE_RAW_MATERIALS',
  INSTALLMENT_SALE_EQUIPMENT = 'INSTALLMENT_SALE_EQUIPMENT',
  INSTALLMENT_SALE_HOUSING = 'INSTALLMENT_SALE_HOUSING',
  LEASING_WITH_CONDITION = 'LEASING_WITH_CONDITION',
  JUALEH = 'JUALEH',
  MOZAREH = 'MOZAREH',
  MOSAGHAT = 'MOSAGHAT',
  DISCOUNTING_RECEIVABLES = 'DISCOUNTING_RECEIVABLES',
  OLD_TRANSACTIONS = 'OLD_TRANSACTIONS',
  ISTISNA = 'ISTISNA',
  MURABAHA = 'MURABAHA'
}

export const FacilityTypesList: EnumList = [
  {
    value: FacilityTypes.QARZ_ALHASANAH,
    title: 'قرض الحسنه',
    color: 'info'
  },

  {
    value: FacilityTypes.MUSHARAKA_MADANI,

    title: 'مشارکت مدنی',
    color: 'info'
  },

  {
    value: FacilityTypes.MUSHARAKA_HOQOQI,
    title: 'مشارکت حقوقی',
    color: 'info'
  },

  {
    value: FacilityTypes.DIRECT_INVESTMENT,
    title: 'سرمایه گذاری مستقیم',
    color: 'info'
  },

  {
    value: FacilityTypes.MOZARABA,
    title: 'مضاربه',
    color: 'info'
  },

  {
    value: FacilityTypes.SALAF_TRANSACTIONS,
    title: 'معاملات سلف',
    color: 'info'
  },

  {
    value: FacilityTypes.INSTALLMENT_SALE_RAW_MATERIALS,
    title: 'فروش اقساطی مواد اولیه، لوازم یدکی و ابزار کار',
    color: 'info'
  },

  {
    value: FacilityTypes.INSTALLMENT_SALE_EQUIPMENT,
    title: 'فروش اقساطی وسایل تولید ماشین‌آلات و تاسیسات',
    color: 'info'
  },

  {
    value: FacilityTypes.INSTALLMENT_SALE_HOUSING,
    title: 'فروش اقساطی مسکن',
    color: 'info'
  },

  {
    value: FacilityTypes.LEASING_WITH_CONDITION,
    title: 'اجاره به شرط تملیک',
    color: 'info'
  },

  {
    value: FacilityTypes.JUALEH,
    title: 'جعاله',
    color: 'info'
  },

  {
    value: FacilityTypes.MOZAREH,
    title: 'مزارعه',
    color: 'info'
  },

  {
    value: FacilityTypes.MOSAGHAT,
    title: 'مساقات',
    color: 'info'
  },

  {
    value: FacilityTypes.DISCOUNTING_RECEIVABLES,
    title: 'خرید دین',
    color: 'info'
  },

  {
    value: FacilityTypes.OLD_TRANSACTIONS,
    title: 'معاملات قدیم',
    color: 'info'
  },

  {
    value: FacilityTypes.ISTISNA,
    title: 'استصناع',
    color: 'info'
  },

  {
    value: FacilityTypes.MURABAHA,
    title: 'مرابحه',
    color: 'info'
  }
]
