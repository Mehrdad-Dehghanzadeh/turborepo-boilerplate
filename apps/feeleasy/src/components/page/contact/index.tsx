'use client'
import Footer from '@components/includes/Footer/Footer'
import Header from '@components/includes/Header/Header'
import Box from '@mui/material/Box'
import './index.scss'
import { useForm } from 'react-hook-form'
import { KButton, KTextField } from '@components/kits'
import useValidations from '@hooks/useValidations'

export default function ContactPage() {
  const { handleSubmit, control } = useForm()
  const { required } = useValidations()

  const onSubmitForm = (data: any) => {}

  return (
    <>
      <Header btnColor="var(--color-primary)" showBtn={false} />
      <Box className="contact-section">
        <p className="section-title contact-section-title">آدرس ما</p>
        <p className="contact-section-text">
          تهران، شرق به غرب جلال آل احمد، نرسیده به بلوار آریافر، پلاک 315، طبقه سوم، واحد
          چهارم
        </p>

        <Box sx={{ marginTop: '70px' }}>
          <p className="section-title contact-section-title">تماس با ما</p>
          <form onSubmit={handleSubmit(onSubmitForm)} className="contact-section-form">
            <KTextField
              control={control}
              name="email"
              variant="filled"
              label="ایمیل"
              sx={{
                width: {
                  xs: '100%',
                  md: '50%'
                }
              }}
              rules={{ required: required() }}
            />
            <KTextField
              control={control}
              name="subject"
              variant="filled"
              label="موضوع"
              sx={{
                width: {
                  xs: '100%',
                  md: '50%'
                }
              }}
              rules={{ required: required() }}
            />
            <KTextField
              control={control}
              name="message"
              variant="filled"
              multiline
              minRows={5}
              label="پیام"
              rules={{ required: required() }}
            />

            <KButton
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                color: 'var(--color-white)',
                width: '170px',
                marginLeft: 'auto'
              }}
            >
              ارسال
            </KButton>
          </form>
        </Box>

        <Box className="contact-section-background">
          <img src="/images/back-arrow.svg" alt="about-bg" />
        </Box>
      </Box>

      <Footer />
    </>
  )
}
