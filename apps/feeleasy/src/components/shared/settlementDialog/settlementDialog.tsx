'use client'
import {
  KButton,
  KDatePicker,
  KFieldset,
  KInfo,
  KSelect,
  KTextField
} from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { deepClone } from '@utils/object'
import apis from '@apis'
import useFilters from '@hooks/useFilters'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import { SettlementDto } from '@models/Settlement'
import { Order, OrderItemList } from '@models/Orders'
import useSnackbar from '@hooks/useSnackbar'
import { SettlementMethodList } from '@enums/SettlementMethod'
import Payments from '@models/Payments'

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
  const [order, setOrder] = useState<Order | null>()
  const [disabled, setDisabled] = useState<boolean>(false)
  const { required, minLength } = useValidations()
  const { snackbar } = useSnackbar()
  const { price } = useFilters()

  const { handleSubmit, control, reset } = useForm<SettlementDto>()

  const showDialog = async (data: Payments) => {
    await getOrderInfo(data)
    setInfo(deepClone(data))
    showCallBack?.()
    setOpen(true)
  }

  const getOrderInfo = (data: Payments) =>
    new Promise((resolve, reject) => {
      if (data?.order?.uuid) {
        apis.orders
          .getItem(data?.order?.uuid)
          .then(({ data }: { data: Order }) => {
            setOrder(data)
            resolve(data)
          })
          .catch((err: Error) => {
            snackbar('error', err)
            reject(err)
          })
      } else {
        resolve('')
      }
    })

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    setOrder(null)
    setDisabled(false)
    reset()
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  const createPayload = (data: SettlementDto) => {
    const payload = deepClone(data)
    return payload
  }

  const submitHandler = (data: SettlementDto) => {
    const payload = createPayload(data)
    const orderUuid = info?.order?.uuid
    const paymentUuid = info?.uuid
    apis.orders
      .settlement(payload, orderUuid, paymentUuid)
      .then(() => {
        snackbar('success', 'تسویه با موفقیت انجام شد')
        onClose()
        closeCallBack?.()
      })
      .catch((err: any) => {
        snackbar('error', err)
      })
  }

  return (
    <Dialog open={open} maxWidth="md">
      <DialogTitle>تسویه با تامین کننده کالا</DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent sx={{ width: '680px' }}>
          {order && (
            <Box sx={{ marginTop: '20px' }}>
              <KFieldset title="اطلاعات سفارش">
                <Grid spacing={2} container>
                  {order.orderItemList.map((item: OrderItemList) => (
                    <>
                      <Grid xs={6} item>
                        <KInfo title="کالا" value={item?.productName} />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo title="قیمت" value={price(item?.unitPrice)} />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo title="تعداد" value={item?.quantity} />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo title="شماره سریال" value={item?.serialNumber} />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo title="گروه کالایی" value={item.category.name} />
                      </Grid>
                    </>
                  ))}

                  <Grid xs={6} item>
                    <KInfo
                      title="مبلغ پرداختی تسهیلات "
                      value={price(order?.leasePayment)}
                    />
                  </Grid>

                  <Grid xs={6} item>
                    <KInfo title="متقاضی" value={order?.customer.name} />
                  </Grid>

                  <Grid xs={6} item>
                    <KInfo title="تامین کننده کالا" value={order?.provider.name} />
                  </Grid>
                </Grid>
              </KFieldset>
            </Box>
          )}

          <Grid spacing={2} container sx={{ marginTop: '12px' }}>
            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KTextField
                name="amount"
                control={control}
                rules={{ required: required() }}
                label="مبلغ"
                inputMode="numeric"
                filterPrice
                disabled={disabled}
                type="number"
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KDatePicker
                control={control}
                label="تاریخ"
                name="dateTime"
                rules={{ required: required(), valueAsDate: true }}
                disabled={disabled}
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KTextField
                name="source"
                control={control}
                rules={{ required: required() }}
                label="مبدا"
                disabled={disabled}
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KTextField
                name="destination"
                control={control}
                rules={{ required: required() }}
                label="مقصد"
                disabled={disabled}
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KTextField
                name="sourceIdentity"
                control={control}
                rules={{ required: required() }}
                label="شناسه مبدا"
                disabled={disabled}
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KTextField
                name="destinationIdentity"
                control={control}
                rules={{ required: required() }}
                label="شناسه مقصد"
                disabled={disabled}
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KTextField
                name="trackingNumber"
                control={control}
                rules={{ required: required(), minLength: minLength(5) }}
                label="شماره پیگیری"
                type="number"
                inputMode="numeric"
                disabled={disabled}
              />
            </Grid>

            <Grid xs={6} sx={{ marginBottom: '16px' }} item>
              <KSelect
                control={control}
                name="settlementMethod"
                items={SettlementMethodList}
                titleKey="title"
                valueKey="value"
                label="نوع تسویه"
                rules={{ required: required() }}
                disabled={disabled}
              />
            </Grid>

            <Grid xs={12} sx={{ marginBottom: '16px' }} item>
              <KTextField
                control={control}
                label="توضیحات"
                name="description"
                multiline
                minRows={5}
                rules={{ required: required() }}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions>
          <KButton type="button" color="error" onClick={onClose}>
            بستن
          </KButton>
          <KButton type="submit" color="success">
            تسویه
          </KButton>
        </DialogActions>
      </form>
    </Dialog>
  )
})
