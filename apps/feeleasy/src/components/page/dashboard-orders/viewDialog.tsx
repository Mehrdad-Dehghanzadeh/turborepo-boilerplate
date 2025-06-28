'use client'
import { KButton, KFieldset, KInfo } from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { deepClone } from '@utils/object'
import { Order, OrderItemList } from '@models/Orders'
import useFilters from '@hooks/useFilters'
import Chip from '@mui/material/Chip'
import { enumsProvider } from '@utils/enums'
import { BooleanPlus } from '@enums/BooleanPlus'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const [assetUuid, setAssetUuid] = useState<string>('')
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const { price } = useFilters()
  const router = useRouter()

  const goToAddDetailsPage = (uuid: string) =>
    router.push(`order-details-add/?orderUuid=${uuid}`)

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    setAssetUuid('')
    closeCallBack?.()
  }

  const showDialog = (data: Order) => {
    setInfo(deepClone(data))
    const assetUuid =
      data?.orderItemList?.find((item: any) => item.assetUuid)?.assetUuid ?? ''
    setAssetUuid(assetUuid)

    const sum = data?.orderItemList?.reduce((sum: number, item: any) => {
      return (sum += item.unitPrice)
    }, 0)
    setTotalPrice(sum)

    showCallBack?.()
    setOpen(true)
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog open={open} maxWidth="md">
      {info && (
        <DialogContent
          sx={{ width: '680px', display: 'flex', flexDirection: 'column', gap: '20px 0' }}
        >
          <KFieldset title="اطلاعات سفارش">
            <Grid container>
              <Grid xs={6} item>
                <KInfo title="خریدار" value={info?.customer.name} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="تامین کننده کالا" value={info?.provider.name} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="قیمت کل" value={price(totalPrice)} />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="وضعیت سفارش"
                  value={
                    <Chip
                      label={enumsProvider('ProviderApprove', info.approved)?.title}
                      color={enumsProvider('ProviderApprove', info.approved)?.color}
                      size="small"
                      variant="outlined"
                    />
                  }
                />
              </Grid>

              {info?.paid !== BooleanPlus.NA && (
                <Grid xs={6} item>
                  <KInfo
                    title="وضعیت پرداخت"
                    value={
                      <Chip
                        label={enumsProvider('CreditPay', info.paid)?.title}
                        color={enumsProvider('CreditPay', info.paid)?.color}
                        size="small"
                        variant="outlined"
                      />
                    }
                  />
                </Grid>
              )}

              {info?.delivered !== BooleanPlus.NA && (
                <Grid xs={6} item>
                  <KInfo
                    title="وضعیت تحویل"
                    value={
                      <Chip
                        label={enumsProvider('Delivered', info.delivered)?.title}
                        color={enumsProvider('Delivered', info.delivered)?.color}
                        size="small"
                        variant="outlined"
                      />
                    }
                  />
                </Grid>
              )}
            </Grid>
          </KFieldset>

          {info?.orderItemList?.map((item: OrderItemList, index: number) => (
            <KFieldset title={`اطلاعات کالا ${index + 1}`} key={index}>
              <Grid container key={index}>
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
                  <KInfo title="گروه کالایی" value={item?.category?.name} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="توضیحات" value={item?.description ?? '-'} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="شماره سریال" value={item?.serialNumber} />
                </Grid>

                <Grid xs={12} item>
                  {item?.category?.code === 'VHCL.SDN' &&
                    info?.approved === BooleanPlus.REQUESTED && (
                      <KButton
                        variant="contained"
                        color="info"
                        onClick={() => goToAddDetailsPage(info?.uuid)}
                        sx={{
                          display: 'block',
                          marginLeft: 'auto'
                        }}
                      >
                        ثبت جزئیات
                      </KButton>
                    )}
                </Grid>

                <Divider />
              </Grid>
            </KFieldset>
          ))}

          {assetUuid && (
            <Grid xs={12} item>
              <KButton variant="contained" color="info">
                <Link href={`order-details?uuid=${assetUuid}`} target="_blank">
                  مشاهده جزئیات سفارش
                </Link>
              </KButton>
            </Grid>
          )}
        </DialogContent>
      )}
      <Divider />

      <DialogActions>
        <KButton type="button" color="error" onClick={onClose}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
})
