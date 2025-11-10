import type { ComponentProps, PropsWithChildren } from 'react'

export type TMaxWidthModal = 'sx' | 'md' | 'lg' | 'full'

export type TModal = PropsWithChildren<ComponentProps<'div'>> & {
  open: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  disablePortal?: boolean
  maxWidth?: TMaxWidthModal
}
