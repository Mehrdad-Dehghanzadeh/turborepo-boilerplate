import { type EnumList } from '@type/Enums'

export enum EducationLevel {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  ASSOCIATE_DEGREE = 'ASSOCIATE_DEGREE',
  BACHELOR_DEGREE = 'BACHELOR_DEGREE',
  MASTER_DEGREE = 'MASTER_DEGREE',
  DOCTORATE = 'DOCTORATE'
}

export const EducationLevelList: EnumList = [
  {
    value: EducationLevel.HIGH_SCHOOL,
    title: 'دیپلم',
    color: 'info'
  },

  {
    value: EducationLevel.ASSOCIATE_DEGREE,
    title: 'فوق دیپلم',
    color: 'info'
  },

  {
    value: EducationLevel.BACHELOR_DEGREE,
    title: 'کارشناسی',
    color: 'info'
  },

  {
    value: EducationLevel.MASTER_DEGREE,
    title: 'کارشناسی ارشد',
    color: 'info'
  },

  {
    value: EducationLevel.DOCTORATE,
    title: 'دکترا',
    color: 'info'
  }
]
