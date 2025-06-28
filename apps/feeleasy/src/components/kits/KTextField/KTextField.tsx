import type { PropsType } from './types'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import { useMemo, useId, useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import useFilters from '@hooks/useFilters'
import { getValue } from '@utils/object'
import './KTextField.scss'
import { convertNumber } from '@utils/number'

const appName = process.env.NEXT_PUBLIC_APP_NAME

export function KTextField({
  className = '',
  control,
  name,
  rules = {},
  formControlProps = {},
  variant = 'outlined',
  onBlur,
  onChange,
  onFocus,
  helperText = '',
  placeholder = '',
  isConvertPersianNumber = true,
  filterPrice = false,
  InputProps = {},
  defaultValue = '',
  ...props
}: PropsType) {
  const { price } = useFilters()

  const optional = useMemo<string>(() => (rules?.required ? '' : 'اختیاری'), [rules])

  const filterPriceCurrency = useMemo(
    () => (typeof filterPrice === 'string' ? filterPrice : 'ریال'),
    [filterPrice]
  )

  const [helperTextSelf, setHelperTextSelf] = useState<string | number>(
    filterPrice ? price('', filterPriceCurrency) : helperText
  )

  let selfPlaceHolder = useMemo(
    () => placeholder || (props?.label ? `لطفا ${props.label} را وارد کنید` : ''),
    [props.label]
  )

  const disabledWheel = (e: any) => {
    if (!e.target.onwheel) {
      e.target.onwheel = (e: any) => e.preventDefault()
    }
  }

  const render = ({ field, fieldState }: { field: any; fieldState: any }) => {
    const { onChange: onChangeField, onBlur: onBlurField, ...fieldProps } = field

    const _id = useId()
    const selfId = `${appName}_${name}_${_id}`

    let attrs = useMemo(() => {
      return { ...props, ...fieldProps }
    }, [props, fieldProps])

    return (
      <FormControl {...formControlProps} fullWidth>
        <TextField
          className="textfield"
          {...attrs}
          variant={variant}
          onChange={(e) => {
            if (isConvertPersianNumber) {
              e.target.value = convertNumber(e.target.value ?? '')
            }
            onChangeField?.(e)
            onChange?.(e)
            if (filterPrice) {
              setHelperTextSelf(price(e.target.value))
            }
          }}
          onBlur={(e) => {
            onBlurField?.(e)
            onBlur?.(e)
          }}
          onFocus={(e) => {
            onFocus?.(e)
            disabledWheel(e)
          }}
          name={selfId}
          placeholder={variant !== 'filled' ? selfPlaceHolder : null}
          error={!!fieldState?.invalid}
          helperText={fieldState?.error?.message || helperTextSelf}
          InputProps={InputProps}
        />
      </FormControl>
    )
  }

  let defaultVal = useMemo(() => {
    if (filterPrice) {
      setHelperTextSelf(price(control?._defaultValues?.[name], filterPriceCurrency))
    }

    return control?._defaultValues?.[name] || defaultValue
  }, [control?._defaultValues])

  useEffect(() => {
    if (filterPrice) {
      const val: string = getValue(control?._formValues, name)
      setHelperTextSelf(price(val, filterPriceCurrency))
    }
  }, [])

  return (
    <div className={`k-text-field ${className}`}>
      <Controller
        defaultValue={defaultVal}
        control={control}
        name={name}
        render={render}
        rules={rules}
      />
    </div>
  )
}
