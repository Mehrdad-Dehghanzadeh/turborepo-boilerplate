import SearchInput from '@components/shared/search/search'
import KInfoCard from '@components/kits/KInfoCard/KInfoCard'
import KSection from '@components/kits/KSection/KSection'
import { Box, Grid } from '@mui/material'

interface SuppliersData {
  logoSrc: string
  title1: string
  title2?: string
  subtitle: string
  contentTitle: string
  contentText: string
  footerContent: string
}

export default function Section() {
  const suppliersData: SuppliersData[] = [
    {
      logoSrc: '/images/fakeLogo-leasing.svg',
      title1: 'شرکت لیزینگ رازی',
      title2: '(سهامی عام)',
      subtitle: 'واسپاری',
      contentTitle: 'گروه فعالیت:',
      contentText: 'انواع فعالیت در حوزه لیزینگ',
      footerContent: 'آدرس و شماره تلفن و اگر بصورت فقط غیر حضوری باشد آدرس وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-leasing.svg',
      title1: 'شرکت لیزینگ رازی',
      title2: '(سهامی عام)',
      subtitle: 'واسپاری',
      contentTitle: 'گروه فعالیت:',
      contentText: 'انواع فعالیت در حوزه لیزینگ',
      footerContent: 'آدرس و شماره تلفن و اگر بصورت فقط غیر حضوری باشد آدرس وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-leasing.svg',
      title1: 'شرکت لیزینگ رازی',
      title2: '(سهامی عام)',
      subtitle: 'واسپاری',
      contentTitle: 'گروه فعالیت:',
      contentText: 'انواع فعالیت در حوزه لیزینگ',
      footerContent: 'آدرس و شماره تلفن و اگر بصورت فقط غیر حضوری باشد آدرس وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-leasing.svg',
      title1: 'شرکت لیزینگ رازی',
      title2: '(سهامی عام)',
      subtitle: 'واسپاری',
      contentTitle: 'گروه فعالیت:',
      contentText: 'انواع فعالیت در حوزه لیزینگ',
      footerContent: 'آدرس و شماره تلفن و اگر بصورت فقط غیر حضوری باشد آدرس وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-leasing.svg',
      title1: 'شرکت لیزینگ رازی',
      title2: '(سهامی عام)',
      subtitle: 'واسپاری',
      contentTitle: 'گروه فعالیت:',
      contentText: 'انواع فعالیت در حوزه لیزینگ',
      footerContent: 'آدرس و شماره تلفن و اگر بصورت فقط غیر حضوری باشد آدرس وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-leasing.svg',
      title1: 'شرکت لیزینگ رازی',
      title2: '(سهامی عام)',
      subtitle: 'واسپاری',
      contentTitle: 'گروه فعالیت:',
      contentText: 'انواع فعالیت در حوزه لیزینگ',
      footerContent: 'آدرس و شماره تلفن و اگر بصورت فقط غیر حضوری باشد آدرس وبسایت'
    }
  ]

  return (
    <KSection
      className="suppliers-section-3"
      sx={{
        padding: { xs: '40px 30px', md: '20px 135px 100px 135px' }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '0 10px',
          margin: '20px 0',
          flexDirection: {
            xs: 'column',
            md: 'row'
          }
        }}
      >
        <p className="section-title suppliers-section-3-title">
          تامین کنندگان مالی فیلیزی
        </p>

        <Box sx={{ flex: 1, width: '100%' }}>
          <SearchInput
            name="suppliers-search"
            placeholder="گروه فعالیت یا نام تامین کننده مالی"
            buttonColor="var(--color-cyan-main)"
            borderColor="var(--color-cyan-main)"
          />
        </Box>
      </Box>

      <Grid container spacing={5}>
        {suppliersData.map((item: SuppliersData, index: number) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <KInfoCard
              logoSrc={item.logoSrc}
              title1={item.title1}
              title2={item.title2}
              subtitle={item.subtitle}
              contentTitle={item.contentTitle}
              contentText={item.contentText}
              footerContent={item.footerContent}
            />
          </Grid>
        ))}
      </Grid>
    </KSection>
  )
}
