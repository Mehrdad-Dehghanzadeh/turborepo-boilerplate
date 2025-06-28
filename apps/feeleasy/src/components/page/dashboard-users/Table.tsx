import { KIconButton, KDataGridServer } from '@components-kits'
import { useRef, useState } from 'react'
import { utcToJalali } from '@utils/date'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import SyncIcon from '@mui/icons-material/Sync'
import Chip from '@mui/material/Chip'
import Dialog from './Dialog'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { enumsProvider } from '@utils/enums'
import { BooleanPlus } from '@enums/BooleanPlus'
import GppGoodIcon from '@mui/icons-material/GppGood'
import VerifiedIcon from '@mui/icons-material/Verified'
import { useRouter } from 'next/navigation'

export default function () {
  const tableRef = useRef<any>()
  const dailogRef = useRef<any>()
  const [loadingConfirmation, setLoadingConfirmation] = useState<boolean>(false)
  const [selectedUUID, setSelectedUUID] = useState<string>('')
  const { snackbar } = useSnackbar()
  const router = useRouter()

  const regulatoryApprove = (row: any) => {
    setLoadingConfirmation(true)
    setSelectedUUID(row.uuid)

    apis.users
      .regulatoryApprove(row.uuid)
      .then(() => {
        snackbar('success', 'احراز هویت کاربر با موفقیت انجام شد')
        tableRef.current.getData()
      })
      .catch((error: any) => {
        snackbar('error', error)
      })
      .finally(() => {
        setLoadingConfirmation(false)
        setSelectedUUID('')
      })
  }

  const columns = [
    { field: 'firstName', headerName: 'نام', width: 120 },
    { field: 'lastName', headerName: 'نام خانوادگی', width: 150 },

    {
      field: 'nationalCard.nationalCode',
      valueGetter: (value: unknown, row: any) => row.nationalCard?.nationalCode ?? '',
      headerName: 'کد ملی',
      resizable: false,
      width: 120
    },

    {
      field: 'nationalCard.dateOfBirth',
      valueGetter: (value: unknown, row: any) =>
        row.nationalCard?.dateOfBirth && utcToJalali(row.nationalCard?.dateOfBirth),
      headerName: 'تاریخ تولد',
      resizable: false,
      width: 100
    },

    {
      field: 'contactInfo.mobilePhoneNumber',
      headerName: 'شماره موبایل',
      valueGetter: (value: unknown, row: any) => row.contactInfo.mobilePhoneNumber,
      resizable: false,
      width: 150
    },

    {
      field: 'verified',
      headerName: 'احراز هویت',
      renderCell: ({ row }: any) => (
        <>
          <Chip
            label={enumsProvider('Verified', row?.verified)?.title}
            color={enumsProvider('Verified', row?.verified)?.color}
            size="small"
            variant="outlined"
          />
        </>
      ),
      resizable: false,
      width: 150
    },

    {
      field: 'action',
      headerName: 'عملیات',
      sortable: false,
      resizable: false,
      renderCell({ row }: Required<{ row: any }>) {
        return (
          <>
            <KIconButton
              color="primary"
              toolTipTitle="جزئیات"
              onClick={(e: Event) => {
                dailogRef?.current?.showDialog?.(row)
                return e
              }}
            >
              <VisibilityIcon />
            </KIconButton>

            <KIconButton
              color="info"
              toolTipTitle="مشاهده احراز هویت"
              onClick={() => router.push(`view-kyc-inquiry?uuid=${row.uuid}`)}
            >
              <GppGoodIcon />
            </KIconButton>

            <KIconButton
              color="warning"
              toolTipTitle="مشاهده اعتبارسنجی"
              onClick={() => router.push(`view-scoring-result?uuid=${row.uuid}`)}
            >
              <VerifiedIcon />
            </KIconButton>

            {row.Verified === BooleanPlus.REQUESTED && (
              <KIconButton
                color="success"
                toolTipTitle="احراز هویت"
                loading={loadingConfirmation && selectedUUID === row.uuid}
                onClick={(e: Event) => {
                  regulatoryApprove(row)
                  return e
                }}
              >
                <SyncIcon />
              </KIconButton>
            )}
          </>
        )
      },
      width: 200
    }
  ]
  return (
    <>
      <KDataGridServer
        resource="users"
        columns={columns}
        getRowId={(row) => row?.uuid}
        ref={tableRef}
      />

      <Dialog ref={dailogRef} />
    </>
  )
}
