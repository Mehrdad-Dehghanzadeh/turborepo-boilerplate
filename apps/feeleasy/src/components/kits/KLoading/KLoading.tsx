import { Stack, CircularProgress } from '@mui/material'

interface KLoadingProps {
  children?: React.ReactNode
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  textStyles?: Object
  loadingStyles?: Object
}

export const KLoading: React.FC<KLoadingProps> = ({
  color = 'primary',
  textStyles,
  loadingStyles,
  children
}) => {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} direction="row">
      <span style={textStyles}>{children ?? 'درحال بارگذاری...'}</span>
      <CircularProgress color={color} style={loadingStyles} />
    </Stack>
  )
}
