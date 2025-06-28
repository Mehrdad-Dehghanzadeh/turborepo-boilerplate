import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LoginIcon from '@mui/icons-material/Login'
import ForgetPass from '@components/page/forget-password/ForgetPassword'
export default function ForgetPassword() {
  return (
    <main className="auth-pages">
      <article className="auth-pages__container">
        <Card className="auth-pages__card">
          <div className="auth-pages__logo">
            <img src="/images/Feeleasylogo-main.svg" alt="logo" />
            <h1 className="text-center">ورود به سایت</h1>
          </div>

          <ForgetPass />
          <Divider sx={{ marginTop: '16px' }} />
          <div className="auth-pages__footer-card">
            <Link href="/login" className="login-link">
              <LoginIcon sx={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <span>ورود</span>
            </Link>
            <Link href="/sign-up" className="signUp-link">
              <PersonAddIcon sx={{ verticalAlign: 'middle', marginRight: '8px' }} />
              <span>ثبت نام</span>
            </Link>
          </div>
        </Card>
      </article>
    </main>
  )
}
