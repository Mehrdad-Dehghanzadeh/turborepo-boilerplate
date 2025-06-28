'use client'
import { KButton, KCheckbox } from '@components-kits'
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useRef
} from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import useSnackbar from '@hooks/useSnackbar'
import { useForm, useWatch } from 'react-hook-form'
import { Grid } from '@mui/material'
import useFilters from '@hooks/useFilters'
import { useAppStore } from '@store'
import { PartyType } from '@enums/PartyType'
import { PartyCategory } from '@enums/PartyCategory'
import { Invoice, InvoiceDto } from '@models/Invoice'
import apis from '@apis'
import { Offerings } from '@models/offering'
import { TokenType } from '@models/PaymentToken'
import Payment from '@components/shared/payment/payment'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [payableItems, setPayableItems] = useState<Offerings[] | []>([])
  const [paymentToken, setPaymentToken] = useState<string>('')
  const [paymentPageLink, setPaymentPageLink] = useState<string>('')
  const { price } = useFilters()
  const user = useAppStore((state) => state.user)
  const { snackbar } = useSnackbar()
  const paymentFormRef = useRef<HTMLFormElement>(null)

  const { control, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: {
      INQUIRY_CREDIT_SCORING: false,
      INQUIRY_KYC: false,
      all: false
    }
  })

  const watchFields = useWatch({
    control
  })

  const onClose = () => {
    setOpen(false)
    reset()
  }

  const showDialog = (info?: any) => {
    setPayableItems(info)
    showCallBack?.()
    setOpen(true)
  }

  const createPayload = (data: any) => {
    const selectedItems = payableItems?.filter((item: Offerings) => data[item.code])
    const items = selectedItems?.map((item: Offerings) => ({
      type: item.code,
      amount: item.price,
      quantity: 1
    }))

    if (!items?.length) return null

    const payload: InvoiceDto = {
      recipient: {
        uuid: user?.uuid,
        category: PartyType.INDIVIDUAL
      },
      issuer: {
        uuid: '582877191559577700',
        category: PartyCategory.Admin
      },
      type: 'LEASING_AGENT_OFFERING',
      items
    }

    return payload
  }

  const onSubmitPayment = (data: any) => {
    const payload: InvoiceDto | null = createPayload(data)

    if (!payload) {
      snackbar('error', 'لطفا یک مورد انتخاب کنید')
      return
    }

    setLoading(true)

    apis.invoice
      .post(payload)
      .then(({ data }: { data: Invoice }) => {
        getPaymentToken(data.uuid)
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setLoading(false))
  }

  const getPaymentToken = (uuid: string) => {
    apis.invoice
      .getToken(uuid)
      .then(({ data }: { data: TokenType }) => {
        setPaymentToken(data.token)
        setPaymentPageLink(data.link)
      })
      .catch((err: Error) => snackbar('error', err))
  }

  const totalPaymentAmount = useMemo(
    () =>
      payableItems?.reduce((sum: number, item: Offerings) => {
        return watchFields[item.code] ? sum + item.price : sum
      }, 0),
    [watchFields]
  )

  const handleToggleAll = (checked: boolean) => {
    payableItems?.forEach((item: Offerings) => {
      setValue(item.code, checked)
    })
  }

  const allSelected = useMemo(
    () => payableItems?.every((item: Offerings) => watchFields[item.code]),
    [watchFields, payableItems]
  )

  useEffect(() => {
    setValue('all', allSelected)
  }, [allSelected])

  useEffect(() => {
    if (paymentPageLink && paymentToken) paymentFormRef?.current?.submit()
  }, [paymentPageLink, paymentToken])

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogTitle>هزینه های استعلام</DialogTitle>
      <Divider />

      <form onSubmit={handleSubmit(onSubmitPayment)}>
        <DialogContent>
          <Grid container spacing={3}>
            {payableItems?.map((item: Offerings, index: number) => (
              <Grid xs={12} item key={`${item.code}-${index}`}>
                <KCheckbox
                  control={control}
                  name={item.code}
                  checked={watchFields[item.code]}
                  formControlProps={{
                    sx: {
                      '&.MuiFormControl-root': {
                        '.MuiFormHelperText-root': {
                          margin: '0px'
                        }
                      }
                    }
                  }}
                />
                <span>
                  {item.description} : {price(item.price, 'ریال')}
                </span>
              </Grid>
            ))}
          </Grid>

          {payableItems?.length > 1 && (
            <>
              <Divider sx={{ margin: '20px 0' }} />
              <Grid container>
                <Grid xs={12} item>
                  <KCheckbox
                    control={control}
                    name="all"
                    label="انتخاب همه"
                    checked={watchFields.all}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleToggleAll(e.target.checked)
                    }
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Divider sx={{ margin: '20px 0' }} />

          <Grid container>
            <Grid xs={6} item>
              <span>مجموع پرداخت :{price(totalPaymentAmount, 'ریال')}</span>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />
        <DialogActions>
          <KButton type="submit" variant="contained" color="success" loading={loading}>
            پرداخت
          </KButton>
          <KButton type="button" variant="outlined" color="error" onClick={onClose}>
            بستن
          </KButton>
        </DialogActions>
      </form>

      <Payment
        token={paymentToken}
        action={paymentPageLink}
        paymentFormRef={paymentFormRef}
      />
    </Dialog>
  )
})
