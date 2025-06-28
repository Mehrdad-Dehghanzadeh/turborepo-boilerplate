import SearchInput from '@components/shared/search/search'
import KInfoCard from '@components/kits/KInfoCard/KInfoCard'
import KSection from '@components/kits/KSection/KSection'
import { Box, Grid } from '@mui/material'

interface SellersData {
  logoSrc: string
  title1: string
  title2?: string
  subtitle: string
  contentTitle: string
  contentText: string
  footerContent: string
}

export default function Section() {
  const sellersData: SellersData[] = [
    {
      logoSrc: '/images/fakeLogo-seller.svg',
      title1: 'نام دقیق فروشگاه',
      subtitle: 'حضوری یا آنلاین یا هردو',
      contentTitle: 'گروه فعالیت:',
      contentText: 'عرصه فعالیت و فروش محصولات',
      footerContent:
        'آدرس و تلفن یا سایت بسته به نوع فروشگاه.درصورت هم حضوری و هم آنلاین بودن هم آدرس و تلفن و هم وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-seller.svg',
      title1: 'نام دقیق فروشگاه',
      subtitle: 'حضوری یا آنلاین یا هردو',
      contentTitle: 'گروه فعالیت:',
      contentText: 'عرصه فعالیت و فروش محصولات',
      footerContent:
        'آدرس و تلفن یا سایت بسته به نوع فروشگاه.درصورت هم حضوری و هم آنلاین بودن هم آدرس و تلفن و هم وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-seller.svg',
      title1: 'نام دقیق فروشگاه',
      subtitle: 'حضوری یا آنلاین یا هردو',
      contentTitle: 'گروه فعالیت:',
      contentText: 'عرصه فعالیت و فروش محصولات',
      footerContent:
        'آدرس و تلفن یا سایت بسته به نوع فروشگاه.درصورت هم حضوری و هم آنلاین بودن هم آدرس و تلفن و هم وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-seller.svg',
      title1: 'نام دقیق فروشگاه',
      subtitle: 'حضوری یا آنلاین یا هردو',
      contentTitle: 'گروه فعالیت:',
      contentText: 'عرصه فعالیت و فروش محصولات',
      footerContent:
        'آدرس و تلفن یا سایت بسته به نوع فروشگاه.درصورت هم حضوری و هم آنلاین بودن هم آدرس و تلفن و هم وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-seller.svg',
      title1: 'نام دقیق فروشگاه',
      subtitle: 'حضوری یا آنلاین یا هردو',
      contentTitle: 'گروه فعالیت:',
      contentText: 'عرصه فعالیت و فروش محصولات',
      footerContent:
        'آدرس و تلفن یا سایت بسته به نوع فروشگاه.درصورت هم حضوری و هم آنلاین بودن هم آدرس و تلفن و هم وبسایت'
    },

    {
      logoSrc: '/images/fakeLogo-seller.svg',
      title1: 'نام دقیق فروشگاه',
      subtitle: 'حضوری یا آنلاین یا هردو',
      contentTitle: 'گروه فعالیت:',
      contentText: 'عرصه فعالیت و فروش محصولات',
      footerContent:
        'آدرس و تلفن یا سایت بسته به نوع فروشگاه.درصورت هم حضوری و هم آنلاین بودن هم آدرس و تلفن و هم وبسایت'
    }
  ]

  return (
    <KSection
      className="sellers-section-3"
      sx={{
        padding: {
          xs: '40px 30px',
          md: '20px 135px 100px 135px'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '0 10px',
          margin: '10px 0 35px 0',
          flexDirection: {
            xs: 'column',
            md: 'row'
          }
        }}
      >
        <p className="section-title sellers-section-3-title">فروشندگان فیلیزی</p>
        <Box sx={{ flex: 1, width: '100%' }}>
          <SearchInput
            name="sellers-search"
            placeholder="نام،شهر و یا نوع فروشگاه"
            buttonColor="var(--color-orange-main)"
            borderColor="var(--color-orange-main)"
          />
        </Box>
      </Box>

      <Grid container spacing={5}>
        {sellersData.map((item: SellersData, index: number) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={index}
            sx={{
              justifyItems: 'center'
            }}
          >
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
