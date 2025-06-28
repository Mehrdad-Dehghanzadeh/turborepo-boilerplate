import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import FormControl, { type FormControlProps } from '@mui/material/FormControl'
import { useMemo, useId, useState } from 'react'
import { Controller, type RegisterOptions } from 'react-hook-form'
import { convertNumber } from '@utils/number'

const appName = process.env.NEXT_PUBLIC_APP_NAME

type PropsType = {
  className?: string
  control: any
  name: string
  rules?: RegisterOptions | object
  variant?: 'filled' | 'outlined' | 'standard'
  onBlur?: (e: any) => void
  onChange?: (e: any) => void
  formControlProps?: FormControlProps
  helperText?: string
  InputProps?: any
  placeholder?: string
  [key: string]: any
}

export function KPasswordField({
  className = '',
  control,
  name,
  rules = {},
  formControlProps = {},
  onBlur,
  onChange,
  helperText = '',
  variant = 'outlined',
  InputProps = {},
  placeholder = '',
  isConvertPersianNumber = true,
  ...props
}: Readonly<PropsType>) {
  let selfPlaceHolder = useMemo(
    () => (placeholder || props?.label ? `لطفا ${props.label} را وارد کنید` : ''),
    [props.label]
  )

  const render = ({ field, fieldState }: { field: any; fieldState: any }) => {
    const { onChange: onChangeField, onBlur: onBlurField, ...fieldProps } = field
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const _id = useId()
    const selfId = `${appName}_${name}_${_id}`

    let attrs = useMemo(() => {
      return { ...props, ...fieldProps }
    }, [props, fieldProps])

    return (
      <FormControl {...formControlProps} fullWidth>
        <TextField
          {...attrs}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            if (isConvertPersianNumber) {
              e.target.value = convertNumber(e.target.value ?? '')
            }
            onChange?.(e)
            onChangeField?.(e)
          }}
          onBlur={(e) => {
            onBlur?.(e)
            onBlurField?.(e)
          }}
          placeholder={variant !== 'filled' && selfPlaceHolder}
          name={selfId}
          error={!!fieldState?.invalid}
          InputProps={{
            ...InputProps,
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )
          }}
          helperText={fieldState?.error?.message || helperText}
          variant={variant}
        />
      </FormControl>
    )
  }

  let defaultValue = useMemo(
    () => control?._defaultValues?.[name] || '',
    [control?._defaultValues]
  )

  return (
    <div className={`k-password-field ${className}`}>
      <Controller
        defaultValue={defaultValue}
        control={control}
        name={name}
        render={render}
        rules={rules}
      />
    </div>
  )
}
