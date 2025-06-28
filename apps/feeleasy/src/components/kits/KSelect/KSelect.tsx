import { useMemo, useId, useState } from 'react'
import { Controller, type RegisterOptions } from 'react-hook-form'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl, { type FormControlProps } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import ListItemText from '@mui/material/ListItemText'
import './KSelect.scss'
import { Box, Chip } from '@mui/material'

const appName = process.env.NEXT_PUBLIC_APP_NAME

type PropsType = {
  className?: string
  control: any
  name: string
  items: any[]
  valueKey?: string
  titleKey?: string
  titleKey2?: string
  flatList?: boolean
  label?: string
  helperText?: string
  rules?: RegisterOptions | object
  formControlProps?: FormControlProps
  multiple?: boolean
  onChange?: (e: any) => any
  [key: string]: any
}

export function KSelect({
  className = '',
  control,
  name,
  rules = {},
  items = [],
  valueKey = 'value',
  titleKey = 'title',
  titleKey2 = '',
  flatList = false,
  helperText = '',
  label = '',
  multiple = false,
  formControlProps = {},
  onChange,
  ...props
}: Readonly<PropsType>) {
  const render = ({ field, fieldState }: { field: any; fieldState: any }) => {
    const { onChange: onChangeField, ...fieldProps } = field
    const [itemValue, setItemValue] = useState<any[]>([])
    const _id = useId()
    let attrs = useMemo(() => {
      return { ...props, ...fieldProps }
    }, [props, fieldProps])

    const selfId = `${appName}_${name}_${_id}`

    const handleDelete = (value: any) => {
      const newValue =
        Array.isArray(field.value) &&
        multiple &&
        field.value.filter((item: any) => item !== value)
      onChangeField(newValue)
    }

    return (
      <FormControl {...formControlProps} error={fieldState.invalid} fullWidth>
        <InputLabel>{label}</InputLabel>

        <Select
          {...attrs}
          name={selfId}
          multiple={multiple}
          labelId={`${selfId}-label`}
          label={label}
          onChange={(e) => {
            if (multiple) {
              setItemValue([...itemValue, e?.target?.value])
            }
            onChange?.(e)
            onChangeField?.(e)
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {Array.isArray(selected) && multiple
                ? selected.map((select: any) => {
                    const value = items.find((item: any) => item.value === select)?.title
                    return (
                      <Chip
                        key={select}
                        label={value}
                        className="value-chip"
                        onDelete={() => handleDelete(select)}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    )
                  })
                : valueKey
                  ? items.find((item: any) => item[valueKey] === selected)?.[titleKey]
                  : items.find((item: any) => item.value === selected)?.title}
            </Box>
          )}
        >
          {items.map((el: any) => {
            const value = flatList ? el : el[valueKey]
            const title = flatList ? el : el[titleKey]
            const title2 = flatList ? el : el[titleKey2]

            return (
              <MenuItem key={`key-${_id}-${value}`} value={value}>
                {multiple ? (
                  <ListItemText primary={title} />
                ) : !title2 ? (
                  title
                ) : (
                  `${title} - ${title2}`
                )}
              </MenuItem>
            )
          })}
        </Select>
        {(fieldState?.error?.message || helperText) && (
          <FormHelperText>{fieldState?.error?.message || helperText}</FormHelperText>
        )}
      </FormControl>
    )
  }

  let defaultValue = useMemo(
    () => control?._defaultValues?.[name] || '',
    [control?._defaultValues]
  )

  return (
    <div className={`k-select ${className}`}>
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
