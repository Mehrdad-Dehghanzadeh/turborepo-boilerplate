import Button, { ButtonOwnProps } from '@mui/material/Button'

interface ButtonProps extends ButtonOwnProps {
  loading?: boolean
  disabled?: boolean
  icon?: string
  [key: string]: any
}

export function KButton({
  loading = false,
  disabled = false,
  icon = '',
  startIcon,
  endIcon,
  children,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <Button
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      disabled={disabled || loading}
      {...props}
      className={`${props.className || ''} ${loading ? 'button-loading' : ''}`}
    >
      {loading ? <div className="loader" /> : children}
    </Button>
  )
}
