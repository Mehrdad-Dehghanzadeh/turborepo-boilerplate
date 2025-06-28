'use client'
import { KButton, KFieldset } from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { deepClone } from '@utils/object'
import Checkbox from '@mui/material/Checkbox'
import { Box, Typography } from '@mui/material'
import { ApproveDto } from '@models/Lease'
import { BooleanPlus } from '@enums/BooleanPlus'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'

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
  const [leaseUuid, setLeaseUuid] = useState<string>('')
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const { snackbar } = useSnackbar()

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    closeCallBack?.()
    setIsChecked(false)
  }

  const showDialog = (data: string, leaseUuid: NumberString) => {
    setInfo(deepClone(data))
    setLeaseUuid(leaseUuid)
    setOpen(true)
  }

  const approveCreditAllocation = () => {
    setApproveLoading(true)

    const payload: ApproveDto = {
      creditAllocated: BooleanPlus.GRANTED
    }

    apis.leases
      .approve(leaseUuid, payload)
      .then(() => {
        snackbar('success', 'تخصیص اعتبار با موفقیت انجام شد')
        showCallBack?.()
        onClose()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setApproveLoading(false)
      })
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog open={open} maxWidth="md">
      <DialogContent sx={{ width: '680px' }}>
        <KFieldset title="متن مصوب">
          <Typography variant="body1">{info?.creditAllocationTerm}</Typography>
          <Box
            sx={{
              margin: '10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start'
            }}
          >
            <Checkbox color="primary" onChange={() => setIsChecked((prev) => !prev)} />
            <Typography variant="body1">تایید تخصیص اعتبار </Typography>
          </Box>
        </KFieldset>
      </DialogContent>

      <Divider />

      <DialogActions>
        <KButton
          variant="contained"
          color="success"
          onClick={approveCreditAllocation}
          loading={approveLoading}
          disabled={!isChecked}
        >
          تخصیص اعتبار
        </KButton>

        <KButton type="button" color="error" onClick={onClose}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
})
