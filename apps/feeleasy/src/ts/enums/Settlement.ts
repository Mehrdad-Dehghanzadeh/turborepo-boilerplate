import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const Settlement: EnumList = [
  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تسویه با تامین کننده کالا',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'تسویه شده با تامین کننده کالا',
    color: 'success'
  },

  {
    value: BooleanPlus.NA,
    title: 'نامشخص',
    color: 'default'
  }
]
