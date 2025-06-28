import { type EnumList } from '@type/Enums'

export enum RequiredDocuments {
  ID_CARD_BACK = 'ID_CARD_BACK',
  ID_CARD_FRONT = 'ID_CARD_FRONT',
  SALARY_STATEMENT = 'SALARY_STATEMENT',
  BANK_STATEMENT = 'BANK_STATEMENT',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  BIRTH_CERTIFICATE_MAIN = 'BIRTH_CERTIFICATE_MAIN',
  BIRTH_CERTIFICATE_SPOUSE_CHILDREN = 'BIRTH_CERTIFICATE_SPOUSE_CHILDREN',
  BIRTH_CERTIFICATE_ADDITIONAL_NOTE = 'BIRTH_CERTIFICATE_ADDITIONAL_NOTE',
  SANA_CERTIFICATE = 'SANA_CERTIFICATE',
  EMPLOYMENT_CERTIFICATE = 'EMPLOYMENT_CERTIFICATE',
  CREDIT_REPORT = 'CREDIT_REPORT',
  RESIDENCE_PROPERTY_DOCUMENT = 'RESIDENCE_PROPERTY_DOCUMENT',
  BUSINESS_PROPERTY_DOCUMENT = 'BUSINESS_PROPERTY_DOCUMENT'
}

export const RequiredDocumentsList: EnumList = [
  {
    value: RequiredDocuments.ID_CARD_FRONT,
    title: 'عکس روی کارت ملی',
    color: 'info'
  },

  {
    value: RequiredDocuments.ID_CARD_BACK,
    title: 'عکس پشت کارت ملی',
    color: 'info'
  },

  {
    value: RequiredDocuments.BIRTH_CERTIFICATE_MAIN,
    title: 'صفحه اول شناسنامه',
    color: 'info'
  },

  {
    value: RequiredDocuments.BIRTH_CERTIFICATE_SPOUSE_CHILDREN,
    title: 'صفحه مشخصات همسر و فرزندان',
    color: 'info'
  },

  {
    value: RequiredDocuments.BIRTH_CERTIFICATE_ADDITIONAL_NOTE,
    title: 'صفحه توضیحات شناسنامه',
    color: 'info'
  },

  {
    value: RequiredDocuments.EMPLOYMENT_CERTIFICATE,
    title: 'مدرک شغلی',
    color: 'info'
  },

  {
    value: RequiredDocuments.SALARY_STATEMENT,
    title: 'عکس فیش حقوقی',
    color: 'info'
  },

  {
    value: RequiredDocuments.BUSINESS_LICENSE,
    title: 'عکس پروانه کسب و کار',
    color: 'info'
  },

  {
    value: RequiredDocuments.SANA_CERTIFICATE,
    title: 'گواهی ثنا',
    color: 'info'
  },

  {
    value: RequiredDocuments.BANK_STATEMENT,
    title:
      'صورتحساب گردش حساب بانکی فعال موید درآمدهای اظهاری متقاضی برای حداقل 6 ماه ماه اخیر',
    color: 'info'
  },

  {
    value: RequiredDocuments.CREDIT_REPORT,
    title: 'گزارش رتبه اعتباری از nics24.ir',
    color: 'info'
  },

  {
    value: RequiredDocuments.RESIDENCE_PROPERTY_DOCUMENT,
    title:
      'سند مالكيت يا اجاره‌نامه محل سکونت (سند رسمی یا اجاره نامه رسمی دارای کد رهگیری/ هولوگرام)',
    color: 'info'
  },

  {
    value: RequiredDocuments.BUSINESS_PROPERTY_DOCUMENT,
    title:
      'سند مالكيت يا اجاره‌نامه محل فعاليت (سند رسمی یا اجاره نامه رسمی دارای کد رهگیری/ هولوگرام)',
    color: 'info'
  }
]
