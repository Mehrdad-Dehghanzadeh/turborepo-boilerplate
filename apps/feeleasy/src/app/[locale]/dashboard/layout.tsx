import DashboardFooter from '@components-includes/Dashboard/DashboardFooter/DashboardFooter'
import DashboardHeader from '@components-includes/Dashboard/DashboardHeader/DashboardHeader'
import DashboardProfileValidationDialog from '@components-includes/Dashboard/DashboardProfileValidationDialog/DashboardProfileValidationDialog'
import Container from '@mui/material/Container'
import './DashboardLayout.scss'
import DashboardNav from '@/components/includes/Dashboard/DashboardNav/DashboardNav'

type PropsType = {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: Readonly<PropsType>) {
  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <DashboardNav />
      <main className="dashboard-main">
        <Container>{children}</Container>
      </main>
      {/* <DashboardProfileValidationDialog /> */}
      <DashboardFooter />
    </div>
  )
}
