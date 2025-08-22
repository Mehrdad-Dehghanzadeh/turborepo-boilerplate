import type { TButtonProps } from './TButton'
import { type FC } from 'react'
import './Button.scss'

const Button: FC<TButtonProps> = ({ ...props }) => {
  return <button className="k-button" {...props}></button>
}

export default Button
