import { type FC } from 'react'
import type { TTextFieldProps } from './TTextField'
import { Controller } from 'react-hook-form'
import type { RenderFC } from '@repo/shared-types/Forms'
import useFormElements from '@repo/ui-kit/hooks/useFormElements'
import { classList } from '@repo/utils/dom'
import './TextField.scss'

export const TextField: FC<TTextFieldProps> = ({
  type = 'text',
  control,
  name,
  id,
  onChange,
  rules,
  ...props
}) => {
  const { selfId } = useFormElements({ id })

  const renderFC: RenderFC = {
    render({ field, fieldState, formState }) {
      const onChangeEvent: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        field.onChange(e)
        onChange?.(e)
      }

      return (
        <>
          <div className="text-field__wrapper">
            <input
              className={classList([
                'text-field__input',
                { 'text-field__input--error': fieldState.invalid }
              ])}
              type={type}
              id={selfId}
              onChange={onChangeEvent}
              {...props}
            />
          </div>

          {fieldState.invalid && (
            <em className="text-field__error-message">
              {fieldState.error?.message || ''}
            </em>
          )}
        </>
      )
    }
  }

  return (
    <div className="text-field">
      <Controller control={control} name={name} render={renderFC.render} rules={rules} />
    </div>
  )
}
