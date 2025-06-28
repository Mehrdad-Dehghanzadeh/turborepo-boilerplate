export const MuiInputLabel = {
  styleOverrides: {
    root: {
      color: 'var(--color-bg-500)',

      '&.Mui-focused': {
        color: 'var(--color-bg-500)'
      },

      '&.Mui-error': {
        color: 'var(--color-error-600)'
      },

      '& .Mui-disabled': {
        color: 'red',
        backgroundColor: 'transparent'
      }
    }
  }
}
