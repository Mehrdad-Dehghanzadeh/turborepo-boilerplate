import { forwardRef, useImperativeHandle, useState } from 'react'
import type { Order, OrderPaymentDto } from '@models/Orders'
import { deepClone } from '@utils/object'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import { KButton, KLoading, KTextField } from '@components/kits'
import { LeaseDto } from '@models/Lease'
import apis from '@apis'
import { useAppStore } from '@store'
import useSnackbar from '@hooks/useSnackbar'
import { KRadioButton } from '@components/kits/KRadioButton/KRadioButton'
import { Box, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import { useRouter } from 'next/navigation'
import useFilters from '@hooks/useFilters'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const { control, handleSubmit, reset } = useForm<any>({
    defaultValues: {}
  })

  const [open, setOpen] = useState<boolean>(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [leases, setLeases] = useState<LeaseDto[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const user = useAppStore((state) => state.user)
  const { snackbar } = useSnackbar()
  const { required } = useValidations()
  const router = useRouter()
  const { price } = useFilters()

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  const showDialog = async (data?: any) => {
    setOrder(deepClone(data))
    setOpen(true)
    getUserLeases()
    showCallBack?.()
  }

  const onClose = () => {
    setOpen(false)
    closeCallBack?.()
    reset()
  }

  const createPayload = (data: OrderPaymentDto) => {
    data.paymentType = 'CREDIT'
    return data
  }

  const creditPayment = (data: OrderPaymentDto) => {
    const payload = createPayload(data)
    const orderUuid = order?.uuid
    const customerUuid = order?.customer.uuid

    apis.orders
      .creditPayment(payload, orderUuid)
      .then(() => {
        snackbar('success', 'پرداخت اعتباری با موفقیت انجام شد')
        onClose()
        router.push(`/dashboard/my-order-payments?orderUuid=${orderUuid}`)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
  }

  const getUserLeases = () => {
    setLoading(true)
    const uuid = user.uuid
    apis.leases
      .getItems({ lesseeUuid: uuid })
      .then(({ data }: { data: LeaseDto[] }) => {
        setLeases(data)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle sx={{ borderBottom: `1px solid var(--color-gray-400)}` }}>
        پرداخت اعتباری
      </DialogTitle>
      <form onSubmit={handleSubmit(creditPayment)}>
        <DialogContent sx={{ width: '680px' }}>
          <Grid spacing={2} container sx={{ marginTop: '12px' }}>
            <Grid xs={12} item>
              {loading ? (
                <KLoading />
              ) : (
                leases?.map((lease: LeaseDto) => (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px 0' }}
                    key={lease.uuid}
                  >
                    <KRadioButton
                      name="leaseUuid"
                      value={lease.uuid}
                      control={control}
                      label={`${lease.leasingProtocol.name} - ${lease.lessor.name}`}
                      rules={{ required: required() }}
                    />
                    &ndash; &nbsp;
                    <Typography
                      variant="body1"
                      sx={{ color: 'var(--color-success-main)' }}
                    >
                      اعتبار باقی مانده : {price(lease.availableCredit)}
                    </Typography>
                  </Box>
                ))
              )}
            </Grid>

            <Grid item xs={12}>
              <KTextField
                name="amount"
                control={control}
                label="مبلغ"
                rules={{ required: required() }}
                filterPrice
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />
        <DialogActions>
          <KButton type="submit" variant="outlined" color="success">
            پرداخت اعتباری
          </KButton>
          <KButton type="button" variant="outlined" color="error" onClick={onClose}>
            بستن
          </KButton>
        </DialogActions>
      </form>
    </Dialog>
  )
})
