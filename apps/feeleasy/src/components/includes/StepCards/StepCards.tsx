import KCard from '@components/kits/KCard/KCard'
import KSection from '@components/kits/KSection/KSection'
import Box from '@mui/material/Box'
import './StepCards.scss'

interface StepData {
  cardTitle: string
  cardContent: string
  cardNumber: string
}

type PropsType = {
  title: string
  stepsData: StepData[]
}

export default function StepCards({ title, stepsData }: Readonly<PropsType>) {
  return (
    <KSection
      className="step-cards"
      sx={{
        backgroundColor: 'var(--color-gray-bg-2)',
        padding: '50px',
        position: 'relative'
      }}
    >
      <p className="section-title">{title}</p>

      <Box
        sx={{
          display: 'flex',
          gap: {
            md: '0 10px',
            xs: '40px 0'
          },
          justifyContent: 'center',
          margin: '50px 0px',

          alignItems: {
            xs: 'center'
          },

          flexDirection: {
            xs: 'column',
            md: 'row'
          }
        }}
      >
        {stepsData.map((step: StepData) => (
          <KCard
            key={step.cardNumber}
            cardTitle={step.cardTitle}
            cardContent={step.cardContent}
            cardNumber={step.cardNumber}
          />
        ))}
      </Box>
      <img src="/images/arrow.svg" alt="arrow" className="arrow step-cards_arrow" />
    </KSection>
  )
}
