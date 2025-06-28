import './KCard.scss'
import Box from '@mui/material/Box'

type PropsType = {
  cardTitle: string
  cardContent: string
  cardNumber: NumberString | number | string
}

export default function KCard({
  cardTitle,
  cardContent,
  cardNumber
}: Readonly<PropsType>) {
  return (
    <Box className="card">
      <Box component="span" className={`card-number card-number--${cardNumber}`}>
        {cardNumber}
      </Box>
      <p className="card-title">{cardTitle}</p>

      <Box className="card-content">
        <p className="card-content_text">{cardContent}</p>
      </Box>
    </Box>
  )
}
