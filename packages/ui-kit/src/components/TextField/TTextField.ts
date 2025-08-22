import type { ComponentProps } from 'react'
import type { Control, RegisterOptions } from 'react-hook-form'
type TOmited = 'size' | 'type'

export type TTextFieldProps = Omit<ComponentProps<'input'>, TOmited> & {
  control: Control<any>
  name: string
  type?: 'number' | 'text' | 'tel' | 'email' | 'url'
  rules?: Omit<
    RegisterOptions<any, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  helperText?: string
}
