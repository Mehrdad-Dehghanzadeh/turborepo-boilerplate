import { BooleanPlus } from '@enums/BooleanPlus'
import { type EnumList } from '@type/Enums'

export const ProviderApprove: EnumList = [
  {
    value: BooleanPlus.REQUESTED,
    title: 'در انتظار تایید توسط تامین کننده کالا',
    color: 'warning'
  },

  {
    value: BooleanPlus.GRANTED,
    title: 'تایید شده توسط تامین کننده کالا',
    color: 'success'
  },

  {
    value: BooleanPlus.REJECTED,
    title: 'رد شده توسط تامین کننده کالا',
    color: 'error'
  },

  {
    value: BooleanPlus.NA,
    title: 'نامشخص',
    color: 'default'
  }
]
