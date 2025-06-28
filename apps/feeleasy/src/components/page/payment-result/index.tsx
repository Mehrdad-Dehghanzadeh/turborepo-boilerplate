'use client'
import { KButton, KLoading } from '@components/kits'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Alert, Paper } from '@mui/material'
import { enumsProvider } from '@utils/enums'
import { PaymentResultMsg } from '@enums/PaymentResultMsg'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { Invoice, ItemsType as InvoiceItemType } from '@models/Invoice'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { utcToJalaliAll } from '@utils/date'
import useFilters from '@hooks/useFilters'
import { useRouter } from 'next/navigation'
import './index.scss'

export default function PaymentResult() {
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const router = useRouter()
  const { price } = useFilters()

  const params = useSearchParams()
  const status = params.get('status')
  const invoiceUuid = params.get('invoice-uuid')
  const type = params.get('type')
  const message = params.get('message') ?? 'نامشخص'

  const alertTitle = enumsProvider('PaymentResultMsgList', message)?.title
  const alertColor = message.includes(PaymentResultMsg.OK) ? 'success' : 'error'

  const getInvoice = () => {
    setLoading(true)

    apis.invoice
      .get(invoiceUuid)
      .then(({ data }: { data: Invoice }) => setInvoice(data))
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const continueProccess = () => {
    if (type === 'LEASING_AGENT_OFFERING') {
      router.push('/dashboard/profile')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    if (invoiceUuid) getInvoice()
  }, [invoiceUuid])

  if (loading) return <KLoading />

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px 100px'
      }}
    >
      <Alert severity={alertColor} sx={{ width: '100%' }}>
        {alertTitle}
      </Alert>

      {invoice && (
        <TableContainer component={Paper}>
          <Table size="medium">
            <TableBody>
              <TableRow>
                <TableCell>پرداخت کننده</TableCell>
                <TableCell>{invoice?.recipient?.name}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>دریافت کننده</TableCell>
                <TableCell>{invoice?.issuer?.name}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>مبلغ کل پرداختی</TableCell>
                <TableCell>{price(invoice?.totalAmount ?? 0)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>وضیعت پرداخت</TableCell>
                <TableCell>
                  {enumsProvider('PaymentResultStatusList', invoice?.paid)?.title}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>مبلغ پرداختی</TableCell>
                <TableCell>{price(invoice?.paymentInfo?.amount ?? 0)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>زمان پرداخت</TableCell>
                <TableCell>
                  {utcToJalaliAll(invoice?.paymentInfo?.paymentDateTime ?? '')}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>شماره مرجع بانکی</TableCell>
                <TableCell>{invoice?.paymentInfo?.referenceNumber}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>کدپیگیری</TableCell>
                <TableCell>{invoice?.paymentInfo?.traceNumber}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box
        className="no-print"
        sx={{ display: 'flex', justifyContent: 'center', gap: '0 10px' }}
      >
        <KButton
          variant="contained"
          color="success"
          onClick={continueProccess}
          size="small"
        >
          ادامه فرآیند
        </KButton>
        <KButton variant="contained" color="error" size="small" onClick={handlePrint}>
          چاپ فاکتور
        </KButton>
      </Box>
    </Box>
  )
}
