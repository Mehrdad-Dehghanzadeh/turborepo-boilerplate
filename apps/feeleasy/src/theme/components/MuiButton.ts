const generateButtonStyles = (colorName: string, variableBase: string) => ({
  [`&.MuiButton-contained${colorName}:not(.Mui-disabled)`]: {
    backgroundColor: `var(--color-${variableBase}-800)`,

    '&:hover': {
      backgroundColor: `var(--color-${variableBase}-700)`
    },

    '&:active': {
      backgroundColor: `var(--color-${variableBase}-900)`,
      boxShadow: 'none'
    }
  },

  [`&.MuiButton-contained${colorName}`]: {
    '&.button-loading.Mui-disabled': {
      backgroundColor: `var(--color-${variableBase}-800)`
    }
  },

  [`&.MuiButton-outlined${colorName}`]: {
    '&.button-loading': {
      backgroundColor: 'transparent'
    }
  }
})

export const MuiButton = {
  styleOverrides: {
    root: {
      borderRadius: '13px',
      ...generateButtonStyles('Success', 'success'),
      ...generateButtonStyles('Error', 'error'),
      ...generateButtonStyles('Warning', 'warning'),
      ...generateButtonStyles('Info', 'info'),
      ...generateButtonStyles('Primary', 'primary')
    }
  }
}
