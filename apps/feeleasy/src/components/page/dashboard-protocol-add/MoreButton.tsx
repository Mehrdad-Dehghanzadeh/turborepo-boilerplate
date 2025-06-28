import { KButton } from '@components-kits'
import './MoreButton.scss'
import AddIcon from '@mui/icons-material/Add'

type Props = {
  onClick: () => void
  btnColor?: 'success' | 'primary' | 'secondary' | 'error' | 'info' | 'warning'
  buttonText?: string
  size?: 'small' | 'medium' | 'large'
}

export default function ({
  onClick,
  btnColor = 'success',
  buttonText = 'اضافه کردن',
  size = 'small'
}: Readonly<Props>) {
  return (
    <KButton
      color={btnColor}
      onClick={onClick}
      className="more-button"
      size={size}
      endIcon={<AddIcon />}
    >
      {buttonText}
    </KButton>
  )
}
