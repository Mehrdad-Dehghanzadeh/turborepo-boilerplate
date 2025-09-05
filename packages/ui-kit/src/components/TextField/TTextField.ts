import type { ComponentProps } from 'react'
import type { Control, RegisterOptions } from 'react-hook-form'
type TOmitted = 'size' | 'type'

export type TTextFieldProps = Omit<ComponentProps<'input'>, TOmitted> & {
  control: Control<any>
  name: string
  type?: 'number' | 'text' | 'tel' | 'email' | 'url'
  rules?: Omit<
    RegisterOptions<any, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  helperText?: string
}
