import KSection from '@components/kits/KSection/KSection'
import { Box, Grid, Typography } from '@mui/material'
import { KButton } from '@components/kits'

export default function Section() {
  const downloadIcon = (
    <img src="/images/downloadIcon.svg" className="suppliers-section-1-downloadIcon" />
  )

  return (
    <KSection className="suppliers-section-1">
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
                fontSize: '42px'
              }}
            >
              اکوسیستم فناوری تامین مالی؛
            </Typography>

            <Typography
              sx={{
                fontSize: '46px',
                color: 'var(--color-primary)',
                fontWeight: 'bolder',
                marginTop: '10px',
                width: {
                  xs: '60%',
                  md: '100%'
                }
              }}
            >
              بازارگاه تامین مالی دیجیتال
            </Typography>

            <KButton
              startIcon={downloadIcon}
              className="suppliers-section-1-download"
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex'
                }
              }}
            >
              دانلود راهنمای جامع تامین کنندگان مالی
            </KButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} className="suppliers-section-1_img">
          <img src="/images/leasing.svg" alt="leasing" />
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
            className="suppliers-section-1-download"
            sx={{ margin: '70px 0 60px 0' }}
          >
            دانلود راهنمای جامع تامین کنندگان مالی
          </KButton>
        </Grid>
      </Grid>
    </KSection>
  )
}
