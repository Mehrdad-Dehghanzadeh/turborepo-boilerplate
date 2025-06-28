import Header from '@components/includes/Header/Header'
import Footer from '@components/includes/Footer/Footer'
import './index.scss'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'
import Section4 from './section4'
import Section5 from './section5'
import Section6 from './section6'

export default function SellersPage() {
  const logoSrc = '/images/Feeleasylogo-Seller.svg'

  return (
    <>
      <Header logoSrc={logoSrc} btnColor="var(--color-orange-main)" />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Footer />
    </>
  )
}
