import { KButton, KTextField } from '@components/kits'
import InputAdornment from '@mui/material/InputAdornment'
import { useForm } from 'react-hook-form'

type PropsType = {
  name: string
  placeholder: string
  buttonColor: string
  borderColor: string
}

export default function SearchInput({
  name,
  placeholder,
  buttonColor,
  borderColor
}: Readonly<PropsType>) {
  const { control, handleSubmit } = useForm<any>()

  const onSubmitForm = () => {}

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <KTextField
        control={control}
        name={name}
        placeholder={placeholder}
        fullWidth
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '30px',
            margin: {
              xs: '20px auto',
              md: '35px auto'
            },
            padding: {
              sx: '5px ',
              md: '8px'
            },
            boxShadow: ' 0px 15px 25px 0px rgba(165, 165, 165, 0.15)',

            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: borderColor,
                borderWidth: '2px'
              }
            },
            '&:hover:not(.Mui-focused)': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-gray-400)'
              }
            }
          },
          '& fieldset': {
            borderColor: '#F0EBF5'
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="start"
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex'
                }
              }}
            >
              <KButton
                type="submit"
                sx={{
                  color: 'var(--color-white)',
                  borderRadius: '30px',
                  backgroundColor: buttonColor,
                  padding: '10px 25px',

                  '&:hover': {
                    backgroundColor: buttonColor
                  }
                }}
              >
                جستجو کن
              </KButton>
            </InputAdornment>
          )
        }}
      />
      <KButton
        type="submit"
        sx={{
          display: {
            xs: 'block',
            md: 'none'
          },
          width: '100%',
          color: 'var(--color-white)',
          borderRadius: '30px',
          backgroundColor: buttonColor,
          padding: '10px 25px',

          '&:hover': {
            backgroundColor: buttonColor
          }
        }}
      >
        جستجو کن
      </KButton>
    </form>
  )
}
