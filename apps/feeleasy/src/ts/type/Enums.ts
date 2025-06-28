export type EnumType = {
  value: string | number
  title: string | number
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  [key: string]: unknown
}

export type EnumList = Array<EnumType>
