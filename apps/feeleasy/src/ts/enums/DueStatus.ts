import { type EnumList } from '@type/Enums'

export enum DueStatus {
  DUE = 'DUE',
  PAST_DUE = 'PAST_DUE',
  NOT_DUE = 'NOT_DUE'
}

export const DueStatusList: EnumList = [
  {
    value: DueStatus.DUE,
    title: 'سررسید شده',
    color: 'success'
  },

  {
    value: DueStatus.PAST_DUE,
    title: 'سررسید گذشته',
    color: 'error'
  },

  {
    value: DueStatus.NOT_DUE,
    title: 'سررسید نشده',
    color: 'warning'
  }
]
