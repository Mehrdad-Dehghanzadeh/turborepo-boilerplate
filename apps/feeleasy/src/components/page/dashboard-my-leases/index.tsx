'use client'
import { KButton, KDataGridServer, KIconButton } from '@components/kits'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRef } from 'react'
import useFilters from '@hooks/useFilters'
import { useAppStore } from '@store'
import { enumsProvider } from '@utils/enums'
import LeaseViewDialog from './leaseViewDialog'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import { useRouter } from 'next/navigation'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'
import Chip from '@mui/material/Chip'
import { BooleanPlus } from '@enums/BooleanPlus'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import VerifiedIcon from '@mui/icons-material/Verified'

export default function ApprovedLeaseRequests() {
  const tableRef = useRef<any>()
  const leaseViewDialogRef = useRef<any>()
  const { price } = useFilters()
  let user = useAppStore((state) => state.user)
  const router = useRouter()

  const goToPaymentPage = (uuid: string) =>
    router.push(`/dashboard/my-lease-payments?leaseUuid=${uuid}`)

  const goToContractPage = (contractUuid: string) => {
    router.push(`view-contract?contractUuid=${contractUuid}`)
  }

  const columns = [
    {
      field: 'allocatedCredit',
      headerName: 'مبلغ',
      width: 150,
      valueGetter: (value: number) => price(value)
    },
    {
      field: 'leasingProtocolName',
      headerName: 'طرح',
      width: 200,
      valueGetter: (value: unknown, row: any) => row.leasingProtocol.name
    },
    {
      field: 'lessorName',
      headerName: 'نهاد مالی',
      width: 150,
      valueGetter: (value: unknown, row: any) => row.lessor.name
    },

    {
      field: 'repaymentInfoTerm',
      headerName: 'دوره بازپرداخت',
      width: 150,
      valueGetter: (value: unknown, row: any) => `${row?.repaymentSchedule?.term} ماه`
    },

    {
      field: 'repaymentSchedule.paymentFrequency',
      headerName: 'تناوب بازپرداخت',
      width: 150,
      valueGetter: (value: unknown, row: any) => {
        return enumsProvider('FrequencyList', row.repaymentSchedule.paymentFrequency)
          ?.title
      }
    },

    {
      field: 'creditAllocated',
      headerName: 'وضیعت تخصیص اعتبار',
      width: 200,
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
      width: 550,
      renderCell: ({ row, id }: any) => (
        <>
          <KIconButton
            color="primary"
            toolTipTitle="جزئیات تسهیلات"
            onClick={() => openLeaseViewDialog(id, row)}
          >
            <VisibilityIcon />
          </KIconButton>

          <KIconButton
            toolTipTitle="مشاهده پرداخت های اعتباری"
            color="secondary"
            onClick={() => goToPaymentPage(row.uuid)}
          >
            <MonetizationOnRoundedIcon />
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

          {row?.creditAllocated === BooleanPlus.NA ? (
            <>
              <KButton
                color="info"
                size="small"
                variant="outlined"
                endIcon={<CurrencyExchangeIcon />}
                onClick={() => router.push(`repayment-cheques?leaseUuid=${id}`)}
              >
                ثبت چک های بازپرداخت
              </KButton>
            </>
          ) : (
            <KButton
              color="info"
              size="small"
              variant="outlined"
              endIcon={<CurrencyExchangeIcon />}
              onClick={() => router.push(`lease-repayments?leaseUuid=${id}`)}
            >
              بازپرداخت
            </KButton>
          )}

          <KButton
            color="warning"
            size="small"
            variant="outlined"
            endIcon={<VerifiedIcon />}
            onClick={() => router.push(`add-guarantee-cheque?leaseUuid=${id}`)}
            sx={{ margin: '0 5px' }}
          >
            {row?.creditAllocated === BooleanPlus.NA ? 'ثبت چک ضمانت' : 'چک ضمانت'}
          </KButton>
        </>
      )
    }
  ]

  const openLeaseViewDialog = (id: number, row: any) => {
    leaseViewDialogRef?.current?.showDialog?.(row)
  }

  return (
    <>
      <KDataGridServer
        resource="leases"
        columns={columns}
        getRowId={(row) => row?.uuid}
        ref={tableRef}
        method="getItems"
        params={{ lesseeUuid: user?.uuid }}
      />
      <LeaseViewDialog ref={leaseViewDialogRef} />
    </>
  )
}
