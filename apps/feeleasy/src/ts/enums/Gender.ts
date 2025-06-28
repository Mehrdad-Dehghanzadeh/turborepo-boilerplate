import { type EnumList } from '@type/Enums'

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export const GenderList: EnumList = [
  {
    value: Gender.MALE,
    title: 'مرد',
    color: 'info'
  },

  {
    value: Gender.FEMALE,
    title: 'زن',
    color: 'info'
  },

  {
    value: Gender.OTHER,
    title: 'سایر',
    color: 'info'
  }
]
