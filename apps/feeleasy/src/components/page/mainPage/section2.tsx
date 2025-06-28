import KSection from '@components/kits/KSection/KSection'
import { Grid } from '@mui/material'
import { KButton } from '@components/kits'
import Link from 'next/link'

export default function Section() {
  return (
    <KSection className="section-2" id="whyFeeleasy">
      <Grid container>
        <Grid item xs={12} md={6} order={{ md: 1, xs: 2 }}>
          <p className="section-title section-2-title">چرا فیلیزی؟</p>

          <p className="section-2-text">
            فیلیزی <strong>یک اکوسیستم جامع خرید اعتباری کالا</strong> است که به شما امکان
            می‌دهد بدون نیاز به طی مراحل زمان‌بر حضوری و صرف وقت زیاد، از موسسات مالی و
            اعتباری مجاز تسهیلات خرید کالا دریافت کنید.
          </p>

          <p className="section-2-text">
            در فیلیزی، شما در فضایی امن و کنترل‌شده و با رعایت کامل مقررات و قوانین، از
            خدمات تسهیلاتی بهره‌مند می‌شوید. این اکوسیستم با گرد هم آوردن تأمین‌کنندگان
            مالی معتبر، فروشندگان و فروشگاه‌های شناخته‌شده، تجربه‌ای مطمئن و آسان را برای
            شما فراهم می‌کند.
          </p>

          <p className="section-2-text">
            با فیلیزی همیشه پول نقد در اختیار دارید و می‌توانید با یک خرید اعتباری متناسب
            با شرایط خود، به رؤیاهای‌تان نزدیک‌تر شوید.
          </p>

          <KButton variant="contained" color="primary" className="section-2-btn">
            <Link href="/about">از فیلیزی بیشتر بدانید</Link>
          </KButton>
        </Grid>

        <Grid item xs={12} md={6} order={{ md: 2, xs: 1 }}>
          <img
            src="/images/group-main.svg"
            alt="group-main"
            className="section-2-image"
          />
        </Grid>
      </Grid>

      <img src="/images/arrow.svg" alt="arrow" className="arrow section-2-arrow" />
    </KSection>
  )
}
