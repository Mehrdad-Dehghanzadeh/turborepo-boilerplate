import KSection from '@components/kits/KSection/KSection'
import { Box, Grid, Typography } from '@mui/material'
import { KButton } from '@components/kits'

export default function Section() {
  const downloadIcon = (
    <img src="/images/downloadIcon.svg" className="sellers-section-1-downloadIcon" />
  )

  return (
    <KSection className="sellers-section-1">
      <Grid
        container
        sx={{
          padding: {
            md: '100px 35px',
            xs: '10px 30px'
          }
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: {
              md: 'center',
              xs: 'left'
            },
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography
              sx={{
                color: 'var(--color-gray-text)',
                fontSize: '34px',
                width: {
                  xs: '60%',
                  md: '100%'
                }
              }}
            >
              فروش راحــت، سریــع و امــن اعتباری
            </Typography>

            <Typography
              sx={{
                width: {
                  xs: '60%',
                  md: '100%'
                },
                fontSize: '34px',
                color: 'var(--color-primary)',
                fontWeight: 'bolder',
                marginTop: '10px'
              }}
            >
              بدون کاهش نقدینگی و ریسک اعتباری
            </Typography>

            <KButton
              startIcon={downloadIcon}
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex'
                }
              }}
              className="sellers-section-1-download"
            >
              دانلود راهنمای جامع فروشندگان
            </KButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} className="sellers-section-1_img">
          <img src="/images/sale.svg" alt="sale picture" />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: {
              xs: 'flex',
              md: 'none'
            },
            justifyContent: 'center'
          }}
        >
          <KButton
            startIcon={downloadIcon}
            className="sellers-section-1-download"
            sx={{ margin: '70px 0 60px 0' }}
          >
            دانلود راهنمای جامع فروشندگان
          </KButton>
        </Grid>
      </Grid>
    </KSection>
  )
}
