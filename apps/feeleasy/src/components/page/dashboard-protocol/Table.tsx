import { useRef, useState } from 'react'
import { KIconButton, KDataGridServer, KButton } from '@components-kits'
import useFilters from '@hooks/useFilters'
import Dialog from './Dialog'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { useAppStore } from '@store'
import apis from '@apis'
import Chip from '@mui/material/Chip'
import useSnackbar from '@hooks/useSnackbar'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WalletIcon from '@mui/icons-material/Wallet'
import { useRouter } from 'next/navigation'
import { enumsProvider } from '@utils/enums'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function () {
  const { price } = useFilters()
  const tableRef = useRef<any>()
  const dailogRef = useRef<any>()
  const isAdmin = useAppStore((state) => state.isAdmin)
  const contributions = useAppStore((state) => state.contributions)
  const { snackbar } = useSnackbar()
  const [approveLoading, setApproveLoading] = useState<boolean>()
  const [sendForApproveLoading, setSendForApproveLoading] = useState<boolean>(false)
  const [returnLoading, setReturnLoading] = useState<boolean>(false)
  const router = useRouter()
  const [selectedUuid, setSelectedUuid] = useState<string>('')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      admin: isAdmin,
      resourceOwner: !isAdmin
    }
  }

  const approve = (row: any) => {
    setApproveLoading(true)
    const uuid = row.uuid
    setSelectedUuid(row.uuid)

    const payload = {
      approved: BooleanPlus.GRANTED
    }

    apis.leasingProtocols
      .approve(uuid, payload)
      .then(() => {
        snackbar('success', 'پروتکل تایید شد')
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

  const sendForApprove = (protocolUuid: string) => {
    setSendForApproveLoading(true)
    setSelectedUuid(protocolUuid)

    const payload = {
      approved: BooleanPlus.REQUESTED
    }

    apis.leasingProtocols
      .approve(protocolUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت ارسال شد')
        return tableRef.current.getData()
      })
      .catch((err: any) => {
        snackbar('error', err)
      })
      .finally(() => {
        setSendForApproveLoading(false)
        setSelectedUuid('')
      })
  }

  const returnForUpdate = (uuid: string) => {
    setReturnLoading(true)
    const protocolUuid = uuid
    setSelectedUuid(uuid)

    const payload = {
      approved: BooleanPlus.RETURNED
    }

    apis.leasingProtocols
      .approve(protocolUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        return tableRef.current.getData()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setReturnLoading(false)
        setSelectedUuid('')
      })
  }

  const handleShowWallet = (protocolUuid: string) => {
    router.push(`protocol-wallet?protocolUuid=${protocolUuid}`)
  }

  const handleEditProtocol = (protocolUuid: string) => {
    router.push(`protocol-add?protocolUuid=${protocolUuid}`)
  }

  const columns = [
    { field: 'title', headerName: 'عنوان', width: 200 },
    { field: 'ownerName', headerName: 'نهاد مالی', width: 200 },
    {
      field: 'acceptableLeaseAmount.minimum',
      headerName: 'کمترین مبلغ مورد تایید',
      valueGetter: (value: unknown, row: any) =>
        price(row?.acceptableLeaseAmount?.minimum),
      width: 200
    },

    {
      field: 'acceptableLeaseAmount.maximum',
      headerName: 'بیشترین مبلغ مورد تایید',
      valueGetter: (value: unknown, row: any) =>
        price(row?.acceptableLeaseAmount?.maximum),
      resizable: false,
      width: 200
    },

    {
      field: 'approved',
      headerName: 'وضعیت',
      renderCell: ({ row }: any) => (
        <Chip
          label={enumsProvider('States', row?.approved)?.title}
          color={enumsProvider('States', row?.approved)?.color}
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
      width: 250,
      renderCell({ row }: Required<{ row: any }>) {
        return (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
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

            {isAdmin && row?.approved === BooleanPlus.REQUESTED && (
              <>
                <KIconButton
                  color="success"
                  toolTipTitle="تایید"
                  loading={approveLoading && selectedUuid === row?.uuid}
                  onClick={() => {
                    approve(row)
                  }}
                >
                  <AddTaskIcon />
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
                  onClick={() => returnForUpdate(row.uuid)}
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
                onClick={() => handleShowWallet(row?.uuid)}
              >
                <WalletIcon />
              </KIconButton>
            )}

            {!isAdmin &&
              (row.approved === BooleanPlus.NA ||
                row.approved === BooleanPlus.RETURNED) && (
                <>
                  <KIconButton
                    color="info"
                    toolTipTitle="ویرایش پروتکل"
                    onClick={() => handleEditProtocol(row?.uuid)}
                  >
                    <ModeEditOutlineIcon />
                  </KIconButton>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ marginX: '10px' }}
                  />
                  <KButton
                    color="success"
                    size="small"
                    loading={sendForApproveLoading && selectedUuid === row?.uuid}
                    onClick={() => sendForApprove(row?.uuid)}
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
    <>
      <KDataGridServer
        configAxios={config}
        params={isAdmin ? {} : { ownerId: contributions?.[0]?.partyId }}
        columns={columns}
        resource="leasingProtocols"
        getRowId={(row) => row?.uuid}
        ref={tableRef}
      />

      <Dialog ref={dailogRef} />
    </>
  )
}
