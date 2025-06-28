'use client'
import { KDataGridServer, KIconButton } from '@components/kits'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRef, useState } from 'react'
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone'
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
import { PartyCategory } from '@enums/PartyCategory'
import { Box } from '@mui/material'
import useFilters from '@hooks/useFilters'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DescriptionIcon from '@mui/icons-material/Description'

export default function Orders() {
  const tableRef = useRef<any>()
  const viewDailogRef = useRef<any>()
  const { snackbar } = useSnackbar()
  const contributions = useAppStore((state) => state.contributions)
  const isAdmin = useAppStore((state) => state.isAdmin)
  const uuid = contributions?.[0]?.partyId
  const role = contributions?.[0]?.partyCategory
  const method =
    role === PartyCategory.Admin
      ? 'read'
      : role === PartyCategory.Shop
        ? 'readShopOrders'
        : ''

  const [selectedUuid, setSelectedUuid] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const { price } = useFilters()

  const router = useRouter()

  const refreshTable = () => {
    tableRef.current.getData()
  }

  const goToPaymentPage = (uuid: string) =>
    router.push(`/dashboard/order-payments?orderUuid=${uuid}`)

  const goToUploadDocumentPage = (uuid: NumberString) => {
    router.push(`/dashboard/upload-order-documents?uuid=${uuid}`)
  }

  const approveOrder = (orderUuid: number) => {
    setLoading(true)
    setSelectedUuid(orderUuid)

    const payload = {
      approved: BooleanPlus.GRANTED
    }

    apis.orders
      .approve(orderUuid, payload)
      .then(() => {
        snackbar('success', 'سفارش تایید شد')
        return tableRef.current.getData()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setLoading(false)
        setSelectedUuid(0)
      })
  }

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
      width: 300,
      resizable: false,
      sortable: false,
      renderCell: ({ row, id }: Required<{ row: any; id: any }>) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <KIconButton
              color="info"
              toolTipTitle="جزئیات"
              onClick={() => viewDailogRef?.current?.showDialog?.(row)}
            >
              <VisibilityIcon />
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

            {row?.provider?.uuid === uuid && row?.approved !== BooleanPlus.GRANTED ? (
              <KIconButton
                toolTipTitle="بارگذاری مدارک"
                color="info"
                onClick={() => goToUploadDocumentPage(row?.uuid)}
              >
                <UploadFileIcon />
              </KIconButton>
            ) : (
              <KIconButton
                toolTipTitle="مشاهده مدارک"
                color="warning"
                onClick={() => goToUploadDocumentPage(row?.uuid)}
              >
                <DescriptionIcon />
              </KIconButton>
            )}

            {role === PartyCategory.Shop && row.approved === BooleanPlus.REQUESTED && (
              <>
                <KIconButton
                  color="info"
                  toolTipTitle="ویرایش"
                  onClick={() => router.push(`add-order?orderUuid=${row?.uuid}`)}
                >
                  <AutoFixNormalIcon />
                </KIconButton>

                <KIconButton
                  toolTipTitle="تایید"
                  color="success"
                  loading={loading && row?.uuid === selectedUuid}
                  onClick={() => approveOrder(row.uuid)}
                >
                  <FileDownloadDoneIcon />
                </KIconButton>
              </>
            )}
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <KDataGridServer
        resource="orders"
        columns={columns}
        ref={tableRef}
        getRowId={(row) => row?.uuid}
        method={method}
        params={isAdmin ? {} : { uuid }}
      />

      <ViewDialog ref={viewDailogRef} />
    </>
  )
}
