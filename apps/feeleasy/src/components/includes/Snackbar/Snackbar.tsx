import type { SnackbarType } from '@enums/Snackbar'
import Snackbar from '@mui/material/Snackbar'
import { useMemo, useState } from 'react'
import { SnackbarContext } from '@context/SnackbarContext'
import './Snackbar.scss'

export function Snack(
  props: Readonly<{
    children: React.ReactNode
  }>
) {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [type, setType] = useState<SnackbarType | null>(null)

  const clear = () => {
    setOpen(false)
    setType(null)
    setMessage('')
  }

  const showMessage = (error: any) => {
    let message = ''

    if (typeof error !== 'string') {
      message =
        Array.isArray(error?.response?.data?.details) &&
        error?.response?.data?.details.length > 0
          ? error?.response?.data?.details?.join(' - ')
          : error?.response?.data?.message
    } else {
      message = error
    }

    setMessage(message)
  }

  const show = (type: SnackbarType, error: any) => {
    setOpen(true)
    showMessage(error)
    setType(type)
    setTimeout(() => {
      clear()
    }, 5000)
  }

  const contextValue: any = useMemo(() => {
    return {
      show
    }
  }, [])

  const classNameSnackbar: string = useMemo(
    () => (type ? ` snackbar--${type}` : ''),
    [type]
  )

  return (
    <SnackbarContext.Provider value={contextValue}>
      {props.children}

      <Snackbar
        className={`snackbar ${classNameSnackbar}`}
        open={open}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </SnackbarContext.Provider>
  )
}
