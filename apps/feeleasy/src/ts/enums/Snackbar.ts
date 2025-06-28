import { type EnumList } from '@type/Enums'

export enum SnackbarType {
  Info = 'info',
  Error = 'error',
  Success = 'success',
  Alert = 'alert'
}

export const SnackbarEnumList: EnumList = [
  {
    value: SnackbarType.Error,
    title: 'خطا',
    color: 'error'
  },

  {
    value: SnackbarType.Success,
    title: 'موفق',
    color: 'success'
  },

  {
    value: SnackbarType.Info,
    title: 'اطلاع',
    color: 'info'
  },

  {
    value: SnackbarType.Alert,
    title: 'توجه',
    color: 'warning'
  }
]
