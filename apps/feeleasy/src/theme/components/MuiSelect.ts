export const MuiSelect = {
  styleOverrides: {
    root: {
      borderRadius: '13px',

      '&:before': {
        borderBottom: 'none'
      },

      '&:after': {
        borderBottom: 'none'
      },

      '&:hover': {
        borderBottom: 'none'
      },

      ':hover:not(.Mui-disabled, .Mui-error):before': {
        borderBottom: 'none'
      },

      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--color-bg-700)',
          borderWidth: '1px'
        }
      },

      '&.Mui-focused:not(.MuiInputBase-filled)': {
        // backgroundColor: 'var(--color-white)'
      },

      '&.MuiInputBase-root.Mui-disabled': {
        backgroundColor: 'var(--color-gray-100)'
      },

      '& .MuiInputBase-input.Mui-disabled': {
        cursor: 'not-allowed'
      },

      '&.MuiOutlinedInput-root': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--color-border-100)'
        }
      }
    }
  }
}
