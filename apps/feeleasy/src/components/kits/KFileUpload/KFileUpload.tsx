import { useRef, useState } from 'react'
import { Controller, type EmptyObject, type RegisterOptions } from 'react-hook-form'
import {
  Box,
  Button,
  FormControl,
  type FormControlProps,
  Typography
} from '@mui/material'
import { CloudUpload, Delete, PictureAsPdf } from '@mui/icons-material'
import Grid from '@mui/material/Grid'
import './KFileUpload.scss'
import { KIconButton } from '@components/kits'

type PropsType = {
  className?: string
  control: any
  name: string
  label?: string | number
  rules?: RegisterOptions | EmptyObject
  inputText?: string
  variant?: 'outlined' | 'contained'
  isRequired?: boolean
  color?: 'info' | 'error' | 'success' | 'primary' | 'secondary'
  onBlur?: (e: any) => void
  onChange?: (e: any) => void
  onFocus?: (e: any) => void
  formControlProps?: FormControlProps
}

export function KFileUpload({
  className = '',
  control,
  name,
  rules = {},
  label = '',
  formControlProps = {},
  variant = 'outlined',
  color = 'info',
  isRequired = false,
  inputText = '',
  onBlur,
  onFocus
}: Readonly<PropsType>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = event.target.files?.[0]

    if (currentFile) {
      const fileUrl = URL.createObjectURL(currentFile)
      setPreviewUrl(fileUrl)
      setSelectedFile(currentFile)
    }
  }

  const handleFileRemove = (onChangeField: (file: File | null) => void) => {
    setSelectedFile(null)
    setPreviewUrl(null)
    onChangeField(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const render = ({ field, fieldState }: { field: any; fieldState: any }) => {
    const { onChange: onChangeField, onBlur: onBlurField } = field

    return (
      <FormControl {...formControlProps} fullWidth error={!!fieldState.error}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">{label}</Typography>
            <Button
              variant={variant}
              component="label"
              startIcon={<CloudUpload />}
              sx={{ mb: 2 }}
              fullWidth
              color={fieldState.error ? 'error' : color}
              size="large"
              className="upload-btn"
            >
              {selectedFile ? selectedFile?.name : inputText || 'انتخاب فایل'}
              <input
                name={name}
                type="file"
                ref={fileInputRef}
                hidden
                onChange={(e) => {
                  handleFileChange(e)
                  onChangeField?.(e.target.files?.[0])
                }}
                onBlur={(e) => {
                  onBlurField?.(e)
                  onBlur?.(e)
                }}
                onFocus={(e) => onFocus?.(e)}
              />
            </Button>

            {fieldState.error && (
              <Typography color="error" sx={{ marginBottom: '10px' }}>
                {fieldState.error.message}
              </Typography>
            )}

            {selectedFile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0 10px' }}>
                <Typography variant="body1">
                  نام فایل انتخاب شده : {selectedFile.name}
                </Typography>
                <KIconButton
                  toolTipTitle="حذف فایل انتخاب شده"
                  color="error"
                  onClick={() => handleFileRemove(onChangeField)}
                  sx={{ margin: '5px 0' }}
                >
                  <Delete />
                </KIconButton>
              </Box>
            )}
          </Grid>

          {previewUrl && (
            <Grid item xs={12} md={5}>
              {selectedFile?.type === 'application/pdf' ? (
                <Box className="preview-pdf">
                  <PictureAsPdf color="error" sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="body1" textAlign="center">
                    {selectedFile?.name}
                  </Typography>
                  <Typography variant="caption" color="var(--color-gray-500)">
                    حجم فایل: {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
              ) : (
                <img
                  src={previewUrl}
                  alt={selectedFile?.name}
                  className="preview-image"
                />
              )}
            </Grid>
          )}
        </Grid>
      </FormControl>
    )
  }

  return (
    <div className={`k-file-upload ${className}`}>
      <Controller
        control={control}
        name={name}
        render={render}
        rules={{
          ...(isRequired ? { required: 'انتخاب فایل ضروری است' } : {}),
          ...rules
        }}
      />
    </div>
  )
}
