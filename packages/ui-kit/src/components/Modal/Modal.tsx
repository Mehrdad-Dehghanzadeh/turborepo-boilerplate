import { useEffect, type FC } from 'react'
import type { TModal } from './TModal'
import { classList } from '@repo/utils/dom'
import './Modal.scss'

export const Modal: FC<TModal> = ({
  open,
  setOpen,
  children,
  className = '',
  maxWidth = 'sx',
  disablePortal = false
}) => {
  const bodyClassName = 'modal-is-open'

  const handleOpen = () => {
    document?.body?.classList?.add(bodyClassName)
  }

  const handleClose = () => {
    setOpen?.(false)
    document?.body?.classList?.remove(bodyClassName)
  }

  const modalHandler = () => {
    if (open) {
      handleOpen()
    } else {
      handleClose()
    }
  }

  useEffect(() => {
    modalHandler()
  }, [open])

  return (
    <div
      className={`modal ${open ? 'modal--open' : ''}`}
      onClick={disablePortal ? undefined : handleClose}
    >
      <div
        className={classList([
          `modal__container`,
          maxWidth != 'sx' ? `modal__container--${maxWidth}` : '',
          className
        ])}
      >
        {children}
      </div>
    </div>
  )
}

export * from './TModal'
