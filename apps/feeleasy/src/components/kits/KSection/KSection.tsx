import Box from '@mui/material/Box'
import './KSection.scss'

type PropsType = {
  children: React.ReactNode
  [key: string]: any
}

export default function KSection({ children, ...props }: Readonly<PropsType>) {
  return (
    <Box className="section" {...props}>
      {children}
    </Box>
  )
}
