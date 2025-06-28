'use client'
import { Grid, Typography } from '@mui/material'
import './footer.scss'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import { KIconButton } from '@components/kits'

type PropTypes = {
  color?: string
}

export default function Footer({
  color = 'var(--color-secondary-300)'
}: Readonly<PropTypes>) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0 })
  }

  return (
    <Box className="footer">
      <Grid container>
        <Grid item xs={12}>
          <img src="/images/footerLogo.svg" alt="footer-logo" className="footer-logo" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" className="footer-title">
            فیلیزی یک اکوسیستم دیجیتال جامع در حوزه فروش اعتباری است که تمام نقش‌ها را در
            یک پلتفرم یکپارچه گرد هم می‌آورد. در این دنیای جدید، فروشندگان، خریداران و
            تأمین‌کنندگان مالی در کنار هم قرار می‌گیرند تا فرآیند خرید اعتباری را ساده‌تر
            و سریع‌تر کنند.
          </Typography>

          <Divider
            sx={{
              backgroundColor: 'var(--color-gray-300)',
              margin: '20px 0 10px 0',
              display: {
                xs: 'block',
                md: 'none'
              }
            }}
          />
        </Grid>

        <Grid item xs={6} md={2} className="footer-links" sx={{ color }}>
          <Box>
            <Link href="/about" className="footer-links_item">
              درباره ما
            </Link>
            <Link href="/contact" className="footer-links_item">
              تماس با ما
            </Link>
            <Link href="#" className="footer-links_item">
              مجوز ها
            </Link>
            <Link href="#" className="footer-links_item">
              فرصت های شغلی
            </Link>
          </Box>
        </Grid>

        {/* enamad */}
        <Grid item xs={6} md={3} className="footer-enamad">
          <Link
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=604700&Code=SE51MvdT92tr8doJfPCpROCDz2oQLagn"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=604700&Code=SE51MvdT92tr8doJfPCpROCDz2oQLagn"
              alt=""
              data-code="SE51MvdT92tr8doJfPCpROCDz2oQLagn"
            />
          </Link>
        </Grid>

        <Grid
          xs={12}
          md={1}
          className="footer-arrow"
          sx={{
            order: {
              xs: 1,
              md: 2
            }
          }}
        >
          <KIconButton className="footer-arrow-btn" onClick={handleScrollToTop}>
            <img src="/images/arrow.svg" alt="arrow" />
          </KIconButton>
        </Grid>
      </Grid>

      <Divider
        sx={{
          backgroundColor: 'var(--color-gray-300)',
          margin: '20px 0',
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      />
      <Grid
        container
        sx={{
          marginTop: {
            xs: '50px',
            md: '0'
          }
        }}
      >
        <Grid item xs={12} md={6} className="footer-info">
          <Typography className="footer-info_address" sx={{ color }}>
            آدرس : تهران، شرق به غرب جلال آل احمد، نرسیده به بلوار آریافر، پلاک 315، طبقه
            سوم، واحد چهارم
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row'
              }
            }}
            className="footer-info_contacts"
          >
            <Typography className="footer-info_phone" sx={{ color }}>
              شماره: ۰۲۱۴۴۲۹۳۹۵۰
            </Typography>

            <Typography className="footer-info_email" sx={{ color }}>
              ایمیل: Info@feeleasy.ir
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} className="footer-copyright">
          <Typography>All rights reserved - Copy right 2024</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
