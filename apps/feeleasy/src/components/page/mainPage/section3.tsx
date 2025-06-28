import { KButton } from '@components/kits'
import KSection from '@components/kits/KSection/KSection'
import Box from '@mui/material/Box'
import Link from 'next/link'

export default function Section() {
  return (
    <KSection className="section-3">
      <img src="/images/back-arrow.svg" alt="roles" className="section-3-background" />

      <p className="section-title section-3-title">نقش خود را انتخاب کنید</p>

      <Box
        sx={{
          display: 'flex',
          gap: {
            md: '50px',
            xs: '20px'
          },
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '50px',
          flexDirection: {
            md: 'row',
            xs: 'column'
          }
        }}
      >
        <KButton
          className="section-3-btn"
          sx={{
            color: 'var(--color-orange-main)'
          }}
        >
          <Link href="/sellers"> فروشنده</Link>
        </KButton>

        <KButton
          className="section-3-btn"
          sx={{
            color: 'var(--color-pink-main)'
          }}
        >
          <Link href="/login">متقاضی خرید اعتباری</Link>
        </KButton>

        <KButton
          className="section-3-btn"
          sx={{
            color: 'var(--color-cyan-main)'
          }}
        >
          <Link href="/suppliers">تامین کننده مالی</Link>
        </KButton>
      </Box>
    </KSection>
  )
}
