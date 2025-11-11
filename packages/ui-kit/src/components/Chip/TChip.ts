import { PropsWithChildren, ComponentProps } from 'react'

export type TColorChip = 'success' | 'waring' | 'info' | 'error' | 'primary' | 'secondary'
export type TChipVariant = 'solid' | 'outlined'

export type TProps = ComponentProps<'span'> & {
  color?: TColorChip
  variant?: TChipVariant
}

export type TChip = PropsWithChildren<TProps>
