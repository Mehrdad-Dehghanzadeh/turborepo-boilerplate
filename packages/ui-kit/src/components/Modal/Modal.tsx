import { useEffect, type FC } from 'react'
import type { TModal } from './TModal'
import './Modal.scss'

export const Modal: FC<TModal> = ({
  open,
  setOpen,
  children,
  className = '',
  disablePortal = false
}) => {
  const bodyClassName = 'modal-is-open'

  const handleOpen = () => {
    document?.body?.classList?.add(bodyClassName)
  }

  const handleClose = () => {
    setOpen(false)
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
      <div className={`modal__container ${className}`}>{children}</div>
    </div>
  )
}

export * from './TModal'
