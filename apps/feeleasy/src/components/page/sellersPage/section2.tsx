import KSection from '@components/kits/KSection/KSection'
import { Box, Grid } from '@mui/material'

export default function Section() {
  const benefits = [
    'با فیلیزی، فروشگاه خود را از رقبا متمایز کنید',
    'بدون نیاز به قفل کردن نقدینگی، فروش اعتباری را تجربه کنید',
    'فروش خود را افزایش دهید، بدون افزایش هزینه‌های عملیاتی',
    'فروشگاهی با قابلیت رشد و مقیاس‌پذیری ایجاد کنید',
    'مشتریان جدید را به کسب‌وکار خود جذب کنید',
    'به یک اکوسیستم یکپارچه برای فروشندگان، خریداران و نهادهای مالی وارد شوید'
  ]

  return (
    <KSection className="sellers-section-2">
      <img
        src="/images/back-arrow.svg"
        alt="roles"
        className="sellers-section-2-background"
      />
      <Grid container>
        <Grid
          item
          xs={12}
          md={8}
          flexDirection="column"
          order={{ md: '1', xs: '2' }}
          sx={{ textAlign: 'justify' }}
        >
          <p className="sellers-section-2-title section-title">
            فیلیزی برای فروشندگان چه نفعی دارد؟
          </p>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: {
                xs: '20px 0',
                md: '15px 0'
              }
            }}
          >
            {benefits.map((title: string, index: number) => (
              <Box
                sx={{
                  display: 'flex',
                  gap: '0 10px',
                  alignItems: {
                    xs: 'flex-start',
                    md: 'center'
                  }
                }}
                key={index}
              >
                <img src="/images/arrow-right-warning.svg" className="arrow-right" />
                <p className="sellers-section-2-text">{title}</p>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4} order={{ md: '2', xs: '1' }}>
          <img
            src="/images/group-sellers.svg"
            alt="group-sellers"
            className="sellers-section-2-image"
          />
        </Grid>
      </Grid>
    </KSection>
  )
}
