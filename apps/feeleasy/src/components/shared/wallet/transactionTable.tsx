import { KDataGridServer } from '@components-kits'
import { useRef } from 'react'
import Chip from '@mui/material/Chip'
import { utcToJalaliAll } from '@utils/date'
import useFilters from '@hooks/useFilters'
import { TransactionDto } from '@/ts/models/Transaction'
import './wallet.scss'

type Props = Readonly<{
  walletUuid: string
}>

export default function ({ walletUuid }: Props) {
  const tableRef = useRef<any>()
  const { price } = useFilters()

  const columns = [
    {
      field: 'amount',
      headerName: 'مبلغ',
      width: 200,
      valueGetter: (value: string) => price(value)
    },

    { field: 'description', headerName: 'شرح', width: 700 },

    {
      field: 'timestamp',
      headerName: 'زمان',
      width: 200,
      valueGetter: (value: string) => utcToJalaliAll(value)
    }
  ]

  return (
    <KDataGridServer
      resource="transactions"
      columns={columns}
      params={{ walletUuid }}
      getRowId={(row) => row?.uuid}
      ref={tableRef}
    />
  )
}
