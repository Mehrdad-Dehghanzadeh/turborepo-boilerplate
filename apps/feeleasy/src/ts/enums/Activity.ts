import { type EnumList } from '@type/Enums'

export enum Activity {
  Inactive,
  Active
}

export const ActivityEnumList: EnumList = [
  {
    value: Activity.Inactive,
    title: 'غیرفعال',
    color: 'error'
  },

  {
    value: Activity.Active,
    title: 'فعال',
    color: 'success'
  }
]
