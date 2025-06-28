import KSection from '@components/kits/KSection/KSection'
import { Box, Grid, Typography } from '@mui/material'
import Slider from '@components/shared/slider/slider'

export default function Section() {
  const sliderData = [
    { id: '1', src: '/images/slider-1.svg', alt: 'slide-1' },
    { id: '2', src: '/images/slider-2.svg', alt: 'slide-2' },
    { id: '3', src: '/images/slider-3.svg', alt: 'slide-3' },
    { id: '4', src: '/images/slider-4.svg', alt: 'slide-4' },
    { id: '5', src: '/images/slider-5.svg', alt: 'slide-5' },
    { id: '6', src: '/images/slider-6.svg', alt: 'slide-6' },
    { id: '7', src: '/images/slider-7.svg', alt: 'slide-7' }
  ]

  return (
    <KSection className="section-1">
      <Grid
        container
        sx={{
          padding: {
            md: '70px',
            xs: '0 30px'
          }
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            textAlign: {
              md: 'center',
              xs: 'left'
            }
          }}
        >
          <Box
            sx={{
              width: {
                md: '100%',
                xs: '60%'
              }
            }}
          >
            <Typography
              sx={{
                color: 'var(--color-gray-text)',
                fontSize: {
                  md: '36px',
                  xs: '32px'
                },
                marginTop: {
                  md: '100px',
                  xs: '0'
                }
              }}
            >
              راحت و سریع اعتبار بگیرید و خرید کنید
            </Typography>
          </Box>

          <Box
            sx={{
              width: {
                md: '100%',
                xs: '80%'
              }
            }}
          >
            <Typography
              sx={{
                color: 'var(--color-primary)',
                fontWeight: 'bolder',
                marginTop: '10px',
                fontSize: {
                  md: '43px',
                  xs: '32px'
                }
              }}
            >
              قدرت خرید در دستان شماست!
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: 'url(/images/back-arrow.svg) no-repeat center center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          className="section-1-container_item"
        >
          <Box className="section-1-slider">
            <Slider data={sliderData} />
          </Box>
        </Grid>
      </Grid>
    </KSection>
  )
}
