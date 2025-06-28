import KSection from '@components/kits/KSection/KSection'
import Box from '@mui/material/Box'
import './calculator.scss'
import { Grid, Typography } from '@mui/material'
import { KButton, KSelect, KTextField } from '@components/kits'
import { useForm } from 'react-hook-form'
import SliderTab from './sliderTab'
import { useState } from 'react'
import useFilters from '@hooks/useFilters'
import useValidations from '@hooks/useValidations'
import useSnackbar from '@hooks/useSnackbar'

export default function Calculator() {
  const { control, handleSubmit } = useForm<any>()
  const [selectedItem, setSelectedItem] = useState<string>('')

  const { snackbar } = useSnackbar()

  const leaseTypes = [
    { title: 'خودرو', value: 'vahicle' },
    { title: 'کالای خرد', value: 'others' }
  ]

  const { price } = useFilters()
  const { required } = useValidations()

  const createPayload = (data: any) => {
    data.contractTime = selectedItem
    return data
  }

  const onSubmitForm = (data: any) => {
    const payload = createPayload(data)
    if (!payload.contractTime.length) {
      snackbar('error', 'لطفا مدت قرارداد را تعیین کنید')
      return
    }
  }

  return (
    <KSection
      sx={{
        backgroundColor: 'var(--color-primary)',
        padding: {
          md: '65px',
          xs: '10px'
        }
      }}
      id="calculate_requested_amount"
    >
      <Box className="calculator">
        <Typography variant="h6" className="calculator-title">
          مبلغ اعتبار خود را محاسبه کنید
        </Typography>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container className="calculator-wrapper">
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                borderRight: { md: '1px solid var(--color-primary-300)' }
              }}
              className="calculator-wrapper_item"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    md: 'row',
                    xs: 'column'
                  },
                  alignItems: {
                    md: 'center',
                    xs: 'start'
                  },
                  gap: {
                    md: '0 5px',
                    xs: '20px 0'
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'nowrap', fontSize: '18px' }}
                >
                  نوع تسهیلات :
                </Typography>
                <KSelect
                  control={control}
                  name="type"
                  titleKey="title"
                  valueKey="value"
                  items={leaseTypes}
                  className="calculator-wrapper_select"
                  sx={{ backgroundColor: 'var(--color-white)' }}
                  rules={{ required: required() }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    md: 'row',
                    xs: 'column'
                  },
                  alignItems: {
                    xs: 'start'
                  },
                  gap: {
                    md: '0 5px',
                    xs: '10px 0'
                  },
                  marginTop: '30px'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    transform: {
                      md: 'translateY(20px)'
                    },
                    fontSize: '18px'
                  }}
                >
                  مبلغ درخواستی :
                </Typography>
                <KTextField
                  name="amount"
                  control={control}
                  variant="filled"
                  className="calculator-wrapper_amount"
                  filterPrice
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '16px'
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'var(--color-white)'
                    }
                  }}
                  rules={{ required: required() }}
                />
              </Box>

              <Box
                sx={{
                  margin: {
                    md: '30px 0 0 0 0',
                    xs: '30px 0'
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'nowrap', fontSize: '18px' }}
                >
                  مدت قرارداد تسهیلات :
                </Typography>
                <SliderTab
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6} className="calculator-wrapper_item">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'nowrap', fontSize: '18px' }}
                >
                  مبلغ هر قسط:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    color: 'var(--color-secondary-600)',
                    fontSize: '26px'
                  }}
                >
                  {price(500000)}
                </Typography>
              </Box>

              <Box
                sx={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'nowrap', fontSize: '18px' }}
                >
                  مبلغ پرداختی نهایی:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'nowrap',
                    color: 'var(--color-secondary-600)',
                    fontSize: '26px',
                    fontWeight: 'bold'
                  }}
                >
                  {price(500000)}
                </Typography>
              </Box>

              <Box sx={{ marginTop: '30px' }}>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'nowrap', fontSize: '18px' }}
                >
                  شرایط :
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--color-primary-100)',
                    marginTop: '10px',
                    fontSize: '14px'
                  }}
                >
                  یک فقره چک صیادی، اعتبار سنجی بانکی، ضمانت شخص ثالث، صفته الکترونیکی
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <KButton
            fullWidth
            type="submit"
            sx={{
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-primary)',
              fontWeight: 'bold',
              fontSize: '18px',
              width: {
                md: '400px',
                xs: '100%'
              },
              margin: '20px auto 0 auto',
              display: 'block',
              '&:hover': {
                backgroundColor: 'var(--color-primary-0)'
              }
            }}
          >
            درخواست اعتبار
          </KButton>
        </form>
      </Box>
    </KSection>
  )
}
