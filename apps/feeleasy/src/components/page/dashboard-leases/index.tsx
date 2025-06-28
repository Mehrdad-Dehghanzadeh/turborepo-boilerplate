'use client'
import { KButton, KDataGridServer, KIconButton } from '@components/kits'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRef, useState } from 'react'
import ViewDialog from './viewDialog'
import useFilters from '@hooks/useFilters'
import { useAppStore } from '@store'
import { Box, Chip } from '@mui/material'
import { useRouter } from 'next/navigation'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import { BooleanPlus } from '@enums/BooleanPlus'
import { enumsProvider } from '@utils/enums'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import PaidIcon from '@mui/icons-material/Paid'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import CreditAllocationTextDialog from './creditAllocationTextDialog'

export default function ApprovedLeaseRequests() {
  const tableRef = useRef<any>()
  const viewDialogRef = useRef<any>()
  const { price } = useFilters()
  const contributions = useAppStore((state) => state.contributions)
  const lessorUuid = contributions?.[0]?.partyId
  const isAdmin = useAppStore((state) => state.isAdmin)
  const isLeasing = useAppStore((state) => state.isLeasing)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedUuid, setSelectedUuid] = useState<string>('')
  const { snackbar } = useSnackbar()
  const creditAllocationTextRef = useRef<any>(null)

  const goToContractPage = (contractUuid: string) => {
    router.push(`view-contract?contractUuid=${contractUuid}`)
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      admin: isAdmin
    }
  }

  const refreshTable = () => {
    tableRef.current.getData()
  }

  const goToPaymentPage = (uuid: string) =>
    router.push(`/dashboard/lease-payments?leaseUuid=${uuid}`)

  const getCreditAllocationText = (uuid: string) => {
    setLoading(true)
    setSelectedUuid(uuid)
    const leaseUuid = uuid

    apis.leases
      .getCreditAllocationText(leaseUuid)
      .then(({ data }: { data: string }) => {
        if (data) creditAllocationTextRef?.current?.showDialog?.(data, leaseUuid)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const columns = [
    {
      field: 'lesseeName',
      headerName: 'نام متقاضی',
      width: 150,
      valueGetter: (value: unknown, row: any) => row?.lessee?.name
    },

    {
      field: 'allocatedCredit',
      headerName: 'مبلغ',
      width: 150,
      valueGetter: (value: string, row: any) => {
        return price(value)
      }
    },
    {
      field: 'leasingProtocol.name',
      headerName: 'طرح',
      width: 200,
      valueGetter: (value: unknown, row: any) => row.leasingProtocol.name
    },

    ...(isAdmin
      ? [
          {
            field: 'lessor.name',
            headerName: 'نهاد مالی',
            width: 150,
            valueGetter: (value: unknown, row: any) => row.lessor.name
          }
        ]
      : []),

    {
      field: 'creditAllocated',
      headerName: 'وضیعت تخصیص اعتبار',
      width: 170,
      renderCell: ({ row }: any) => (
        <Chip
          label={enumsProvider('CreditAllocatedList', row?.creditAllocated)?.title}
          color={enumsProvider('CreditAllocatedList', row?.creditAllocated)?.color}
          size="small"
          variant="outlined"
        />
      )
    },

    {
      field: 'action',
      headerName: 'عملیات',
      sortable: false,
      resizable: false,
      width: 450,
      renderCell: ({ row }: any) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          <KIconButton
            color="primary"
            toolTipTitle="جزئیات"
            onClick={() => {
              viewDialogRef?.current?.showDialog?.(row)
            }}
          >
            <VisibilityIcon />
          </KIconButton>

          {row?.contractUuid && (
            <KIconButton
              color="success"
              toolTipTitle="مشاهده قرارداد"
              onClick={() => goToContractPage(row?.contractUuid)}
            >
              <HistoryEduIcon />
            </KIconButton>
          )}

          <KIconButton
            toolTipTitle="پرداخت های اعتباری"
            color="secondary"
            onClick={() => goToPaymentPage(row.uuid)}
          >
            <PaidIcon />
          </KIconButton>

          <KIconButton
            color="info"
            toolTipTitle="بازپرداخت"
            onClick={() => router.push(`lease-repayments?leaseUuid=${row.uuid}`)}
          >
            <CurrencyExchangeIcon />
          </KIconButton>

          <KIconButton
            color="warning"
            toolTipTitle="چک ضمانت"
            onClick={() => router.push(`guarantee-cheque?leaseUuid=${row.uuid}`)}
          >
            <FactCheckIcon />
          </KIconButton>

          {isLeasing && row?.creditAllocated === BooleanPlus.REQUESTED && (
            <KButton
              color="success"
              size="small"
              endIcon={<CreditScoreIcon />}
              onClick={() => getCreditAllocationText(row?.uuid)}
              loading={row?.uuid === selectedUuid && loading}
            >
              تخصیص اعتبار
            </KButton>
          )}
        </Box>
      )
    }
  ]

  return (
    <>
      <KDataGridServer
        resource="leases"
        columns={columns}
        getRowId={(row) => row?.uuid}
        ref={tableRef}
        params={isAdmin ? {} : { lessorUuid: lessorUuid }}
        method="getItems"
        configAxios={config}
      />
      <ViewDialog ref={viewDialogRef} />
      <CreditAllocationTextDialog
        ref={creditAllocationTextRef}
        showCallBack={refreshTable}
      />
    </>
  )
}
