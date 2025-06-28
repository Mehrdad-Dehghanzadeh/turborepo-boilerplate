import Footer from '@components/includes/Footer/Footer'
import Header from '@components/includes/Header/Header'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'
import Section4 from './section4'
import Section5 from './section5'
import Section6 from './section6'
import Calculator from '@/components/includes/Calculator/calculator'
import './index.scss'

export default function MainPage() {
  const logoSrc = '/images/Feeleasylogo-main.svg'

  return (
    <>
      <Header logoSrc={logoSrc} btnColor="var(--color-primary)" />

      <Section1 />
      <Section2 />
      <Section3 />
      <Calculator />
      <Section4 />
      <Section5 />
      <Section6 />

      <Footer />
    </>
  )
}
