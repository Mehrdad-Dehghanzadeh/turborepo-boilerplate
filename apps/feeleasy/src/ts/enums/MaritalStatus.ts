import { type EnumList } from '@type/Enums'

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED'
}

export const MaritalStatusList: EnumList = [
  {
    value: MaritalStatus.SINGLE,
    title: 'مجرد',
    color: 'info'
  },

  {
    value: MaritalStatus.MARRIED,
    title: 'متاهل',
    color: 'info'
  }
]
