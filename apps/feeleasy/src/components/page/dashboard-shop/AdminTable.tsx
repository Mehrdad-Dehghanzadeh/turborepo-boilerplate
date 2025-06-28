import { KIconButton, KDataGridServer, KButton } from '@components-kits'
import { useRef, useState } from 'react'
import Chip from '@mui/material/Chip'
import Dialog from './Dialog'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useAppStore } from '@store'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { enumsProvider } from '@/utils/enums'
import WalletIcon from '@mui/icons-material/Wallet'
import { useRouter } from 'next/navigation'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function () {
  const tableRef = useRef<any>()
  const dailogRef = useRef<any>()
  const isAdmin = useAppStore((state) => state.isAdmin)
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [selectedUuid, setSelectedUuid] = useState<string>('')
  const [returnLoading, setReturnLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const router = useRouter()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      admin: isAdmin
    }
  }

  const handleClick = (shopUuid: string) => {
    router.push(`shop-wallet?shopUuid=${shopUuid}`)
  }

  const columns = [
    { field: 'name', headerName: 'نام فروشگاه', width: 200 },
    {
      field: 'websiteAddress',
      headerName: 'آدرس وبسایت',
      width: 200,
      renderCell: ({ row }: any) => row?.websiteAddress ?? 'تعیین نشده'
    },

    {
      field: 'Verified',
      headerName: 'وضعیت',
      renderCell: ({ row }: any) => (
        <Chip
          label={enumsProvider('States', row?.approved)?.title}
          color={enumsProvider('States', row?.approved)?.color}
          size="small"
          variant="outlined"
        />
      ),
      resizable: false,
      width: 200
    },

    {
      field: 'action',
      headerName: 'عملیات',
      sortable: false,
      resizable: false,
      width: 260,

      renderCell({ row }: Required<{ row: any }>) {
        return (
          <>
            <KIconButton
              color="info"
              toolTipTitle="جزئیات"
              onClick={(e: Event) => {
                dailogRef?.current?.showDialog?.(row)
                return e
              }}
            >
              <VisibilityIcon />
            </KIconButton>

            {row.approved === BooleanPlus.REQUESTED && (
              <>
                <KIconButton
                  color="success"
                  toolTipTitle="تایید"
                  onClick={() => {
                    approve(row)
                  }}
                  loading={approveLoading && row.uuid === selectedUuid}
                >
                  <AddTaskIcon />
                </KIconButton>

                <KButton
                  color="error"
                  size="small"
                  onClick={() => returnForUpdate(row?.uuid)}
                  loading={returnLoading && selectedUuid === row?.uuid}
                >
                  برگشت جهت ویرایش
                </KButton>
              </>
            )}

            {row?.approved === BooleanPlus.GRANTED && (
              <KIconButton
                color="success"
                toolTipTitle="مشاهده کیف"
                onClick={() => handleClick(row?.uuid)}
              >
                <WalletIcon />
              </KIconButton>
            )}
          </>
        )
      }
    }
  ]

  const approve = (row: any) => {
    const shopUuid = row.uuid
    setApproveLoading(true)
    setSelectedUuid(shopUuid)

    const payload = {
      approved: BooleanPlus.GRANTED
    }

    apis.shop
      .approve(shopUuid, payload)
      .then(() => {
        snackbar('success', 'درخواست مورد نظر تایید شد')
        return tableRef.current.getData()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setApproveLoading(false)
        setSelectedUuid('')
      })
  }

  const returnForUpdate = (uuid: string) => {
    const shopUuid = uuid
    setReturnLoading(true)
    setSelectedUuid(uuid)

    const payload = {
      approved: BooleanPlus.RETURNED
    }

    apis.shop
      .approve(shopUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        return tableRef.current.getData()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setReturnLoading(false)
        setSelectedUuid('')
      })
  }

  return (
    <>
      <KDataGridServer
        configAxios={config}
        resource="shop"
        columns={columns}
        getRowId={(row) => row?.uuid}
        ref={tableRef}
      />
      <Dialog ref={dailogRef} />
    </>
  )
}
