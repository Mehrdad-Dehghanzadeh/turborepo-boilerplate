export const MuiTextField = {
  styleOverrides: {
    root: {
      // outlined
      '& .MuiOutlinedInput-root': {
        borderRadius: '13px',

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--color-border-100)'
        },

        '&.Mui-disabled': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-border-100)'
          }
        },

        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-bg-700)',
            borderWidth: '1px'
          }
        },

        '&:hover:not(.Mui-focused)': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-border-100)'
          }
        },

        '&.Mui-error': {
          borderColor: 'var(--color-error-600)'
        }
      },

      '& .MuiInputLabel-outlined': {
        color: 'var(--color-bg-500)',

        '&.Mui-focused': {
          color: 'var(--color-bg-500)'
        },

        '&.Mui-error': {
          color: 'var(--color-error-600)'
        }
      },

      // filled
      '& .MuiFilledInput-root': {
        backgroundColor: 'var(--color-white)',
        borderRadius: '13px',
        border: '1px solid var(--color-border-0)',
        paddingTop: '5px',

        '&:before': {
          border: 'none'
        },
        '&:after': {
          border: 'none'
        },

        ':hover:not(.Mui-focused)': {
          '&:before': {
            border: 'none'
          },
          backgroundColor: 'var(--color-gray-100)'
        },

        '&.Mui-disabled': {
          ':hover': {
            backgroundColor: 'var(--color-gray-100)'
          },

          '&:before': {
            border: 'none'
          }
        },

        '&.Mui-focused': {
          backgroundColor: 'var(--color-gray-50)',
          borderColor: 'var(--color-bg-800)',

          '&:hover': {
            '&:before': {
              border: 'none'
            }
          }
        },

        '&.Mui-error': {
          borderColor: 'var(--color-error-600)'
        }
      },

      '& .MuiInputLabel-filled': {
        backgroundColor: 'transparent',
        color: 'var(--color-bg-500)',

        '&.Mui-focused': {
          color: 'var(--color-bg-500)'
        },

        '&.Mui-error': {
          color: 'var(--color-error-600)'
        }
      },

      '& .MuiInputBase-root.Mui-disabled': {
        backgroundColor: 'var(--color-gray-100)'
      },

      '& .MuiInputBase-input.Mui-disabled': {
        cursor: 'not-allowed'
      },

      '& .MuiInputLabel-root.Mui-disabled': {
        color: 'var(--color-bg-800)',
        backgroundColor: 'transparent'
      }
    }
  }
}
