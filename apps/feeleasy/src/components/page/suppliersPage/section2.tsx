import KSection from '@components/kits/KSection/KSection'
import { Box, Grid } from '@mui/material'

export default function Section() {
  const titles = [
    'محیط کار دیجیتال بر پایه پلتفرم برای شرکت لیزینگ و موسسات تامین کننده مالی؛',
    'همه چیز را در یک جا دارید: فروشندگان، خریداران و سایر خدمات‌دهندگان؛',
    'افزایش توانمندی عملیاتی و مقیاس‌پذیری کسب و کار؛',
    'دسترسی سریع و آسان و بدون صرف هزینه‌های بازاریابی و فروش به تأمین کنندگان کالا و خریداران؛',
    'محیط قانونی و بدون ریسک، با خودکارسازی فرآیندهای دستی؛',
    'عملیات اعتباری شبانه روزی با کاهش خطای انسانی؛',
    'تجربه چرخه عملیاتی در محیط یکپارچه و مدرن با کمترین هزینه؛ ',
    'سودآوری و کارآمدی عملیاتی؛'
  ]

  return (
    <KSection className="suppliers-section-2">
      <img
        src="/images/back-arrow.svg"
        alt="roles"
        className="suppliers-section-2-background"
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
          <p className="suppliers-section-2-title section-title">
            مزیت‌های رقابتی فیلیزی برای تأمین کنندگان مالی
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
            {titles.map((title: string, index: number) => (
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
                <img src="/images/arrow-right-cyan.svg" className="arrow-right" />
                <p className="suppliers-section-2-text">{title}</p>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4} order={{ md: '2', xs: '1' }}>
          <img
            src="/images/group-suppliers.svg"
            alt="group-suppliers"
            className="suppliers-section-2-image"
          />
        </Grid>
      </Grid>
    </KSection>
  )
}
