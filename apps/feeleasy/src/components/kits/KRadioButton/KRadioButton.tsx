import { useMemo } from 'react'
import { Controller, type RegisterOptions } from 'react-hook-form'
import FormControl, { type FormControlProps } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

type PropsType = {
  className?: string
  id?: string
  control: any
  name: string
  label?: string
  rules?: RegisterOptions | object
  value: string | number
  formLabel?: string
  color?: 'info' | 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'default'
  size?: 'small' | 'medium'
  formControlProps?: FormControlProps
  onChange?: (e: any) => any
  [key: string]: any
}

export function KRadioButton({
  className = '',
  id = '',
  control,
  name,
  rules = {},
  label = '',
  formControlProps = {},
  value,
  formLabel,
  color = 'info',
  size = 'small',
  onChange,
  ...props
}: Readonly<PropsType>) {
  let defaultValue = useMemo(
    () => control?._defaultValues?.[name] || '',
    [control?._defaultValues]
  )

  const render = ({ field, fieldState }: { field: any; fieldState: any }) => {
    const { onChange: onChangeField, ...fieldProps } = field
    let attrs = useMemo(() => {
      return { ...props, ...fieldProps }
    }, [props, fieldProps])

    return (
      <FormControl className={className} component={'span'} {...formControlProps}>
        <RadioGroup
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            onChange?.(e)
            onChangeField?.(e)
          }}
          {...attrs}
        >
          <FormControlLabel
            value={value}
            control={<Radio color={color} size={size} />}
            label={label}
          />
        </RadioGroup>

        <FormHelperText error={fieldState.error}>
          {fieldState.error && fieldState.error.message}
        </FormHelperText>
      </FormControl>
    )
  }

  return (
    <div className={`k-radioButton ${className}`}>
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
