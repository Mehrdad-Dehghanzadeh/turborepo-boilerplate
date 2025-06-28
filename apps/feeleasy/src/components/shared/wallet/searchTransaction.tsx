import { useForm } from 'react-hook-form'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import { KButton, KTextField } from '@components-kits'
import './wallet.scss'

export default function () {
  const { control, reset, handleSubmit } = useForm<FormData>()

  const onSubmitForm = (data: FormData) => {
    reset()
  }

  return (
    <form className="search-transaction-form" onSubmit={handleSubmit(onSubmitForm)}>
      <Box sx={{ width: '100%' }}>
        <KTextField
          control={control}
          name="search"
          type="text"
          placeholder="جستجوی تراکنش ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <KButton variant="outlined" color="primary" size="large" type="submit">
        جستجو
      </KButton>
    </form>
  )
}
