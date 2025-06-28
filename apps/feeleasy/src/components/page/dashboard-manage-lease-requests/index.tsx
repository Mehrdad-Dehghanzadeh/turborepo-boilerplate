'use client'
import { KButton, KDataGridServer, KIconButton } from '@components-kits'
import { useRef, useMemo, useState, useEffect } from 'react'
import { LeaseRequestContext } from '@context/LeaseRequestContext'
import { useAppStore } from '@store'
import useFilters from '@hooks/useFilters'
import apis from '@apis'
import { deepClone } from '@mui/x-data-grid/internals'
import { utcToJalali } from '@utils/date'
import useSnackbar from '@hooks/useSnackbar'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import EditDialog from './editDialog'
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone'
import { enumsProvider } from '@utils/enums'
import Chip from '@mui/material/Chip'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useRouter } from 'next/navigation'
import { BooleanPlus } from '@enums/BooleanPlus'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import GppGoodIcon from '@mui/icons-material/GppGood'
import VerifiedIcon from '@mui/icons-material/Verified'
import VisibilityIcon from '@mui/icons-material/Visibility'

export default function () {
  const { price } = useFilters()
  const tableRef = useRef<any>()
  const [filters, setFilters] = useState<any>(null)
  const [protocols, setProtocols] = useState<any[]>([])
  const isAdmin = useAppStore((state) => state.isAdmin)
  const updateUser = useAppStore((state) => state.updateUser)
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [editLoadingBtn, setEditLoadingBtn] = useState<boolean>(false)
  const [selectedUuid, setSelectedUuid] = useState<string>('')
  const [returnLoading, setReturnLoading] = useState<boolean>(false)
  const editDialogRef = useRef<any>()
  const router = useRouter()
  const { snackbar } = useSnackbar()

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
    apis.leasingProtocols.read({}, {}).then((res: any) => {
      const tempData = Array.isArray(res?.data) ? deepClone(res.data) : []
      const approvedProtocols = tempData.filter(
        (protocol: any) =>
          protocol.approved === BooleanPlus.GRANTED && protocol.enabled === true
      )
      setProtocols(approvedProtocols)
    })
  }, [])

  const openEditDialog = (id: string, row: any) => {
    setEditLoadingBtn(true)
    setSelectedUuid(id)
    editDialogRef?.current?.showDialog?.(row)
  }

  const showCallBack = () => {
    setEditLoadingBtn(false)
    setSelectedUuid('')
  }

  const refreshTable = () => {
    tableRef.current.getData()
  }

  const approve = (row: any) => {
    const uuid = row.uuid
    setApproveLoading(true)
    setSelectedUuid(uuid)

    const payload = {
      approved: BooleanPlus.GRANTED
    }

    apis.leaseRequests
      .approve(uuid, payload)
      .then(() => {
        snackbar('success', 'درخواست مورد نظر تایید شد')
        updateUser()
        refreshTable()
      })
      .catch((err: any) => {
        snackbar('error', err)
      })
      .finally(() => {
        setApproveLoading(false)
        setSelectedUuid('')
      })
  }

  const returnForUpdate = (uuid: string) => {
    setReturnLoading(true)
    setSelectedUuid(uuid)

    const leaseRequestUuid = uuid

    const payload = {
      approved: BooleanPlus.RETURNED
    }

    apis.leaseRequests
      .approve(leaseRequestUuid, payload)
      .then(() => {
        snackbar('success', 'باموفقیت انجام شد')
        updateUser()
        refreshTable()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setReturnLoading(false)
        setSelectedUuid('')
      })
  }

  const redirectToUploadPage = (uuid: string) =>
    router.push(`./upload-request-documents?uuid=${uuid}`)

  const columns = [
    {
      field: 'userName',
      headerName: 'درخواست دهنده',
      width: 170
    },

    {
      field: 'protocolTitle',
      headerName: 'طرح',
      width: 200
    },

    ...(isAdmin
      ? [
          {
            field: 'companyName',
            headerName: 'نهاد مالی',
            width: 150
          }
        ]
      : []),

    {
      field: 'amount',
      headerName: 'مبلغ درخواستی',
      width: 125,
      valueGetter: (value: number) => price(value)
    },

    {
      field: 'submissionDate',
      headerName: 'تاریخ درخواست',
      valueGetter: (value: string) => utcToJalali(value),
      width: 125
    },

    {
      field: 'approved',
      headerName: 'وضیعت درخواست',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={enumsProvider('States', row.approved)?.title}
            color={enumsProvider('States', row.approved)?.color}
            variant="outlined"
            size="small"
          />
        )
      },
      resizable: false,
      width: 150
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
      width: 150
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 280,

      renderCell({ row, id }: Required<{ row: any; id: any }>) {
        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <KIconButton
              color="primary"
              toolTipTitle={row?.approved === BooleanPlus.GRANTED ? 'مشاهده' : 'ویرایش'}
              loading={editLoadingBtn && selectedUuid === id}
              onClick={() => openEditDialog(id, row)}
            >
              {row?.approved === BooleanPlus.GRANTED ? (
                <VisibilityIcon />
              ) : (
                <AutoFixNormalIcon />
              )}
            </KIconButton>

            <KIconButton
              color="secondary"
              toolTipTitle="مشاهده مدارک بارگذاری شده"
              onClick={() => redirectToUploadPage(row?.uuid)}
            >
              <UploadFileIcon />
            </KIconButton>

            <KIconButton
              color="info"
              toolTipTitle="مشاهده احرازهویت"
              onClick={() => router.push(`view-kyc-inquiry?uuid=${row.userUuid}`)}
            >
              <GppGoodIcon />
            </KIconButton>

            <KIconButton
              color="warning"
              toolTipTitle="مشاهده اعتبارسنجی"
              onClick={() => router.push(`view-scoring-result?uuid=${row.userUuid}`)}
            >
              <VerifiedIcon />
            </KIconButton>

            {row.approved === BooleanPlus.REQUESTED && (
              <>
                <KIconButton
                  color="success"
                  toolTipTitle="تایید"
                  loading={approveLoading && selectedUuid === id}
                  onClick={() => {
                    approve(row)
                  }}
                >
                  <FileDownloadDoneIcon />
                </KIconButton>

                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ marginX: '5px' }}
                />
                <KButton
                  color="error"
                  size="small"
                  onClick={() => returnForUpdate(row?.uuid)}
                  loading={returnLoading && selectedUuid === id}
                >
                  برگشت جهت ویرایش
                </KButton>
              </>
            )}
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <LeaseRequestContext.Provider value={context}>
        <KDataGridServer
          columns={columns}
          configAxios={config}
          resource="leaseRequests"
          getRowId={(row) => row?.uuid}
          ref={tableRef}
        />
      </LeaseRequestContext.Provider>

      <EditDialog
        ref={editDialogRef}
        showCallBack={showCallBack}
        closeCallBack={refreshTable}
      />
    </>
  )
}
