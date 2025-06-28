import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import './KAccardion.scss'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { KIconButton } from '../KIconButton/KIconButton'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useState } from 'react'

type PropsType = {
  accardionTitle: string
  accardionContent: string
}

export default function KAccardion({
  accardionTitle,
  accardionContent
}: Readonly<PropsType>) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Box className="accardion">
      <Box className="accardion-header">
        <Typography className="accardion-header_title">{accardionTitle} </Typography>

        <KIconButton
          className="accardion-header_button"
          onClick={() => setIsOpen((s) => !s)}
        >
          {isOpen ? (
            <CloseOutlinedIcon className="accardion-header_icon" />
          ) : (
            <ChevronLeftIcon className="accardion-header_icon" />
          )}
        </KIconButton>
      </Box>

      <Box className={`accardion-content ${isOpen ? 'show-content' : ''}`}>
        {Array.isArray(accardionContent) ? (
          accardionContent.map((content: any, index: number) => (
            <p key={index}>{content}</p>
          ))
        ) : (
          <p>{accardionContent}</p>
        )}
      </Box>
    </Box>
  )
}
