import './KInfoCard.scss'
import Box from '@mui/material/Box'

type PropsType = {
  logoSrc: string
  title1: string
  title2?: string
  subtitle?: string
  contentTitle: string
  contentText: string
  footerContent: string
}

export default function KInfoCard({
  logoSrc,
  title1,
  title2,
  subtitle,
  contentTitle,
  contentText,
  footerContent
}: Readonly<PropsType>) {
  return (
    <Box className="KInfo-card">
      <Box className="KInfo-card_header">
        <Box className="KInfo-card_header-logo">
          <img src={logoSrc} alt="templogo" />
        </Box>

        <Box>
          <Box className="KInfo-card_header-titles">
            <p className="title1">{title1}</p>
            <p className="title2">{title2}</p>
          </Box>
          <Box className="KInfo-card_header-subtitles">
            <p className="subtitle1">{subtitle}</p>
          </Box>
        </Box>
      </Box>

      <Box className="KInfo-card_content">
        <Box className="KInfo-card_content-text">
          <strong>{contentTitle}</strong>
          <p>{contentText}</p>
        </Box>

        <Box className="KInfo-card_content-footer">
          <p>{footerContent}</p>
        </Box>
      </Box>
    </Box>
  )
}
