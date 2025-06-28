'use client'
import { KButton, KDataGridServer, KIconButton } from '@components/kits'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRef, useState } from 'react'
import { useAppStore } from '@store'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import ViewDialog from './viewDialog'
import Chip from '@mui/material/Chip'
import { enumsProvider } from '@utils/enums'
import { BooleanPlus } from '@enums/BooleanPlus'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import { useRouter } from 'next/navigation'
import CreditPaymentDialog from './creditPaymentDialog'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import { Box } from '@mui/material'
import useFilters from '@hooks/useFilters'
import DescriptionIcon from '@mui/icons-material/Description'

type DeliveryType = {
  delivered: BooleanPlus.GRANTED
}

export default function MyOrders() {
  const tableRef = useRef<any>()
  const viewDailogRef = useRef<any>()
  const productDialogRef = useRef<any>()
  const creditPaymentDialogRef = useRef<any>()
  const { snackbar } = useSnackbar()
  const user = useAppStore((state) => state.user)
  const contributions = useAppStore((state) => state.contributions)
  const uuid = contributions?.length ? contributions?.[0]?.partyId : user?.uuid
  const [selectedUuid, setSelectedUuid] = useState<number>(0)
  const [deliveryLoading, setDeliveryLoading] = useState<boolean>(false)
  const router = useRouter()
  const { price } = useFilters()

  const refreshTable = () => {
    tableRef.current.getData()
  }

  const goToPaymentPage = (uuid: string) =>
    router.push(`my-order-payments?orderUuid=${uuid}`)

  const openEditDialog = (row: any) => {
    productDialogRef?.current.showDialog?.(row)
  }

  const handleSubmitDelivery = (orderUuid: number) => {
    setDeliveryLoading(true)
    setSelectedUuid(orderUuid)

    const payload: DeliveryType = {
      delivered: BooleanPlus.GRANTED
    }

    apis.orders
      .delivery(orderUuid, payload)
      .then(() => {
        snackbar('success', 'عملیات با موفقیت انجام شد')
        refreshTable()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setDeliveryLoading(false))
  }

  const goToAddProduct = () => {
    router.push('add-order')
  }

  const viewOrderDocuments = (uuid: string) =>
    router.push(`/dashboard/upload-order-documents?uuid=${uuid}`)

  const columns = [
    {
      field: 'provider.name',
      headerName: 'تامین کننده کالا',
      width: 150,
      valueGetter: (value: string, row: any) => row?.provider.name
    },

    {
      field: 'customer.name',
      headerName: 'خریدار',
      width: 150,
      valueGetter: (value: string, row: any) => row?.customer.name
    },

    {
      field: 'price',
      headerName: 'قیمت کل',
      width: 150,
      valueGetter: (value: string, row: any) => {
        let totalPrice = row.orderItemList.reduce((sum: any, item: any) => {
          return sum + item.unitPrice
        }, 0)
        return price(totalPrice)
      }
    },

    {
      field: 'providerApprove',
      headerName: 'وضیعت کالا',
      width: 230,
      renderCell({ row }: any) {
        return (
          <Chip
            label={enumsProvider('ProviderApprove', row?.approved)?.title}
            color={enumsProvider('ProviderApprove', row?.approved)?.color}
            size="small"
            variant="outlined"
          />
        )
      }
    },

    {
      field: 'creditPay',
      headerName: 'وضیعت پرداخت',
      width: 230,
      renderCell({ row }: any) {
        return (
          <Chip
            label={enumsProvider('CreditPay', row.paid)?.title}
            color={enumsProvider('CreditPay', row.paid)?.color}
            size="small"
            variant="outlined"
          />
        )
      }
    },

    {
      field: 'delivery',
      headerName: 'وضیعت تحویل کالا',
      width: 230,
      renderCell({ row }: any) {
        return (
          <Chip
            label={enumsProvider('Delivered', row?.delivered)?.title}
            color={enumsProvider('Delivered', row?.delivered)?.color}
            size="small"
            variant="outlined"
          />
        )
      }
    },

    {
      field: 'action',
      headerName: 'عملیات',
      width: 200,
      resizable: false,
      sortable: false,
      renderCell: ({ row, id }: Required<{ row: any; id: any }>) => {
        return (
          <>
            <KIconButton
              color="info"
              toolTipTitle="جزئیات"
              onClick={() => viewDailogRef?.current?.showDialog?.(row)}
            >
              <VisibilityIcon />
            </KIconButton>

            <KIconButton
              color="warning"
              toolTipTitle="مشاهده مدارک"
              onClick={() => viewOrderDocuments(row?.uuid)}
            >
              <DescriptionIcon />
            </KIconButton>

            {row?.approved === BooleanPlus.GRANTED && (
              <KIconButton
                toolTipTitle="مشاهده پرداخت ها"
                color="secondary"
                onClick={() => goToPaymentPage(row.uuid)}
              >
                <CurrencyExchangeIcon />
              </KIconButton>
            )}

            {row.approved === BooleanPlus.REQUESTED && (
              <KIconButton
                color="info"
                toolTipTitle="ویرایش"
                onClick={() => router.push(`add-order?orderUuid=${row?.uuid}`)}
              >
                <AutoFixNormalIcon />
              </KIconButton>
            )}

            {row.paid === BooleanPlus.REQUESTED && (
              <KIconButton
                toolTipTitle="پرداخت اعتباری"
                onClick={() => creditPaymentDialogRef.current?.showDialog(row)}
                color="success"
              >
                <CreditScoreIcon />
              </KIconButton>
            )}

            {row.delivered === BooleanPlus.REQUESTED && (
              <KIconButton
                toolTipTitle="تایید تحویل سفارش"
                onClick={() => handleSubmitDelivery(row.uuid)}
                color="warning"
                loading={deliveryLoading && selectedUuid === row?.uuid}
              >
                <LocalShippingOutlinedIcon />
              </KIconButton>
            )}
          </>
        )
      }
    }
  ]

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'end', padding: '0 10px' }}>
        <KButton
          variant="contained"
          color="info"
          sx={{ margin: '10px 0' }}
          startIcon={<LocalMallIcon />}
          onClick={() => goToAddProduct()}
        >
          ثبت سفارش
        </KButton>
      </Box>

      <KDataGridServer
        resource="orders"
        columns={columns}
        ref={tableRef}
        getRowId={(row) => row?.uuid}
        method="readUserOrders"
        params={{ uuid }}
      />

      <ViewDialog ref={viewDailogRef} />
      <CreditPaymentDialog ref={creditPaymentDialogRef} />
    </>
  )
}
