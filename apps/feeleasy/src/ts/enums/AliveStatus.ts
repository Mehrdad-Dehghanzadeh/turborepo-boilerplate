import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const AliveStatus: EnumList = [
  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تایید',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'در قید حیات',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'متوفی',
    color: 'error'
  }
]
