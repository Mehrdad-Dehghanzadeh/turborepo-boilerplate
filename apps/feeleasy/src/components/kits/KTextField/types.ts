import type { EmptyObject, RegisterOptions } from 'react-hook-form'
import type { FormControlProps } from '@mui/material/FormControl'

export type PropsType = Readonly<{
  className?: string
  control: any
  name: string
  variant?: 'filled' | 'outlined' | 'standard'
  rules?: RegisterOptions | EmptyObject
  onBlur?: (e: any) => void
  onChange?: (e: any) => void
  onFocus?: (e: any) => void
  formControlProps?: FormControlProps
  helperText?: string | number
  helperTextPrice?: boolean | string
  placeholder?: string
  InputProps?: any
  [key: string]: any
}>
