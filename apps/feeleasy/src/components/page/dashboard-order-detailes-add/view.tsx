import { deepClone } from '@utils/object'
import { forwardRef, useImperativeHandle, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { KButton } from '@components/kits'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const [open, setOpen] = useState<boolean>(false)
  const [info, setInfo] = useState<any>(null)
  const appUrl = process.env.NEXT_PUBLIC_API_URL

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    closeCallBack?.()
  }

  const showDialog = (data: any) => {
    setOpen(true)
    setInfo(deepClone(data))
    showCallBack?.()
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog
      open={open}
      fullScreen
      PaperProps={{
        sx: { m: 0, maxWidth: '100vw', maxHeight: '100vh' }
      }}
    >
      <DialogContent
        sx={{
          p: '10px',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '15px'
        }}
      >
        <img
          src={`${appUrl}/${info?.path}`}
          alt={info?.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </DialogContent>
      <DialogActions>
        <KButton color="error" onClick={onClose}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
})
