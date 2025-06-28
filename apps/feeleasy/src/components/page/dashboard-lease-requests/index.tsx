'use client'
import { KButton, KDataGridServer, KIconButton } from '@components-kits'
import Dialog from './Dialog'
import { useRef, useMemo, useState, useEffect } from 'react'
import { LeaseRequestContext } from '@context/LeaseRequestContext'
import { useAppStore } from '@store'
import useFilters from '@hooks/useFilters'
import apis from '@apis'
import { deepClone } from '@mui/x-data-grid/internals'
import { utcToJalali } from '@utils/date'
import { enumsProvider } from '@utils/enums'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/navigation'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import useSnackbar from '@hooks/useSnackbar'
import { BooleanPlus } from '@enums/BooleanPlus'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import Collapse from '@mui/material/Collapse'

export default function () {
  const { price } = useFilters()
  const tableRef = useRef<any>()
  const [filters, setFilters] = useState<any>(null)
  const [protocols, setProtocols] = useState<any[]>([])
  const isAdmin = useAppStore((state) => state.isAdmin)
  const user = useAppStore((state) => state.user)
  const dialogRef = useRef<any>()
  const router = useRouter()
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const [selectedUuid, setSelectedUuid] = useState<string>('')
  const [open, setOpen] = useState<boolean>(true)

  const config = {
    headers: {
      'Content-Type': 'application/json',
      admin: isAdmin
    }
  }

  const context = useMemo(
    () => ({
      setFilters,
      filters,
      resetTable() {
        tableRef.current.getData()
      },
      protocols
    }),
    [protocols, filters]
  )

  useEffect(() => {
    setOpen(true)
    apis.leasingProtocols.read({}, {}).then((res: any) => {
      const tempData = Array.isArray(res?.data) ? deepClone(res.data) : []
      const approvedProtocols = tempData.filter(
        (protocol: any) =>
          protocol.approved === BooleanPlus.GRANTED && protocol.enabled === true
      )
      setProtocols(approvedProtocols)
    })
  }, [])

  const redirectToUploadPage = (uuid: string) =>
    router.push(`./upload-request-documents?uuid=${uuid}`)

  const sendForApprove = (leaseRequestUuid: string) => {
    setApproveLoading(true)
    setSelectedUuid(leaseRequestUuid)

    const payload = {
      approved: BooleanPlus.REQUESTED
    }

    apis.leaseRequests
      .approve(leaseRequestUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        tableRef.current.getData()
      })
      .catch((err: any) => {
        snackbar('error', err)
      })
      .finally(() => {
        setApproveLoading(false)
        setSelectedUuid('')
      })
  }

  const columns = [
    {
      field: 'amount',
      headerName: 'مبلغ درخواستی',
      width: 120,
      valueGetter: (value: number) => price(value)
    },
    {
      field: 'protocolTitle',
      headerName: 'طرح',
      width: 150
    },

    {
      field: 'companyName',
      headerName: 'نهاد مالی',
      width: 120
    },
    {
      field: 'term',
      headerName: 'دوره بازپرداخت',
      width: 120,
      valueGetter: (value: number) => price(value, 'ماه')
    },
    {
      field: 'paymentFrequency',
      headerName: 'تناوب بازپرداخت',
      valueGetter: (value: string) => enumsProvider('FrequencyList', value)?.title,
      width: 120
    },
    {
      field: 'submissionDate',
      headerName: 'تاریخ درخواست',
      valueGetter: (value: string) => utcToJalali(value),
      width: 120
    },
    {
      field: 'approved',
      headerName: 'وضیعت درخواست',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            color={enumsProvider('States', row.approved)?.color}
            label={enumsProvider('States', row.approved)?.title}
            variant="outlined"
            size="small"
          />
        )
      },
      resizable: false,
      width: 200
    },

    {
      field: 'documents',
      headerName: 'وضیعت مدارک',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            color={enumsProvider('DocumentProvided', row.documentsProvided)?.color}
            label={enumsProvider('DocumentProvided', row.documentsProvided)?.title}
            variant="outlined"
            size="small"
          />
        )
      },
      resizable: false,
      width: 200
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 230,
      renderCell({ row }: Required<{ row: any }>) {
        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <KIconButton
              color={row?.approved === BooleanPlus.GRANTED ? 'secondary' : 'primary'}
              toolTipTitle={row?.approved === BooleanPlus.GRANTED ? 'مشاهده' : 'ویرایش'}
              onClick={() => {
                dialogRef?.current?.openToEdit(row)
              }}
            >
              {row?.approved === BooleanPlus.GRANTED ? (
                <VisibilityIcon />
              ) : (
                <AutoFixNormalIcon />
              )}
            </KIconButton>
            <KIconButton
              color="info"
              toolTipTitle={
                row.documentsProvided === BooleanPlus.NA
                  ? 'بارگذاری مدارک'
                  : 'مدارک بارگذاری شده'
              }
              onClick={() => redirectToUploadPage(row?.uuid)}
            >
              <UploadFileIcon />
            </KIconButton>

            {row.documentsProvided !== BooleanPlus.NA &&
              (row.approved === BooleanPlus.NA ||
                row.approved === BooleanPlus.RETURNED) && (
                <>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ marginX: '10px' }}
                  />
                  <KButton
                    color="success"
                    size="small"
                    onClick={() => sendForApprove(row?.uuid)}
                    loading={approveLoading && selectedUuid === row.uuid}
                  >
                    ارسال برای تایید
                  </KButton>
                </>
              )}
          </Box>
        )
      }
    }
  ]

  return (
    <LeaseRequestContext.Provider value={context}>
      {user?.verified !== BooleanPlus.GRANTED && (
        <Collapse in={open}>
          <Alert
            severity="warning"
            sx={{ marginBottom: '15px' }}
            action={
              <KIconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <CloseIcon fontSize="inherit" />
              </KIconButton>
            }
          >
            احراز هویت انجام نشده است
          </Alert>
        </Collapse>
      )}

      {<Dialog ref={dialogRef} />}

      <KDataGridServer
        columns={columns}
        configAxios={config}
        params={{ userUuid: user?.uuid }}
        resource="leaseRequests"
        getRowId={(row) => row?.uuid}
        ref={tableRef}
      />
    </LeaseRequestContext.Provider>
  )
}
