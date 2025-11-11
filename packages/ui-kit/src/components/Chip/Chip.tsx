import { type FC } from 'react'
import { TChip } from './TChip'
import { classList } from '@repo/utils/dom'
import './Chip.scss'

export const Chip: FC<TChip> = ({
  color = 'info',
  variant = 'solid',
  className = '',
  children,
  ...props
}) => {
  return (
    <span className={classList(['chip', `chip-${color}`, className])} {...props}>
      <span className="chip__container">{children}</span>
    </span>
  )
}
