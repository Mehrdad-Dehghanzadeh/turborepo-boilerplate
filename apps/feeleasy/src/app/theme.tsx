'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { faIR } from '@mui/material/locale'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { prefixer } from 'stylis'
import { Snack } from '@components-includes'
import {
  MuiTextField,
  MuiButton,
  palette,
  typography,
  MuiSelect,
  MuiInputLabel
} from '@/theme'

export const theme = createTheme(
  {
    direction: 'rtl',

    components: {
      MuiTextField,
      MuiButton,
      MuiSelect,
      MuiInputLabel
    },

    palette,
    typography
  },

  faIR
)

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin]
})

export default function Theme({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Snack>{children}</Snack>
      </ThemeProvider>
    </CacheProvider>
  )
}
