import { type FC } from 'react'
import { TChip } from './TChip'
import clsx from 'clsx'
import './Chip.scss'

export const Chip: FC<TChip> = ({
  color = 'info',
  variant = 'solid',
  className = '',
  children,
  ...props
}) => {
  return (
    <span className={clsx(['chip', `chip-${color}`, className])} {...props}>
      <span className="chip__container">{children}</span>
    </span>
  )
}
