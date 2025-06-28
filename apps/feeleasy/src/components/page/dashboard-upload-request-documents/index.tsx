'use client'
import { KButton, KIconButton, KLoading, KSelect } from '@components/kits'
import { KFileUpload } from '@components/kits/KFileUpload/KFileUpload'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import { useEffect, useRef, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { Box, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import InfoIcon from '@mui/icons-material/Info'
import { RequiredDocumentsList } from '@enums/RequiredDocuments'
import { enumsProvider } from '@utils/enums'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import ListSubheader from '@mui/material/ListSubheader'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Swal from 'sweetalert2'
import useValidations from '@hooks/useValidations'
import { BooleanPlus } from '@enums/BooleanPlus'
import { useAppStore } from '@store'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ViewDocument from './viewDocument'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Link from 'next/link'

type RequiredDocuments = {
  description: string
  amountThreshold: NumberString
  requiredDocuments: string[]
}

type DocumentInfoList = {
  name: string
  path: string
  type: string
  uuid: string
}

type Documents = {
  documentInfoList: DocumentInfoList[]
  requiredDocuments: RequiredDocuments
}

type FormData = {
  type: string
  file: File
}

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export default function UploadDocuments() {
  const searchParams = useSearchParams()
  const leaseRequestUuid = searchParams.get('uuid')
  const { handleSubmit, control, reset } = useForm<FormData>()
  const [requiredDoumentsInfo, setRequiredDocumentsInfo] =
    useState<RequiredDocuments | null>(null)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [sendForapproveLoading, setSendForApproveLoading] = useState<boolean>(false)
  const [documents, setDocuments] = useState<Documents | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [returnLoading, setReturnLoading] = useState<boolean>(false)
  const [leaseRequest, setLeaseRequest] = useState<any>(null)
  const appUrl = process.env.NEXT_PUBLIC_API_URL
  const { required } = useValidations()
  const contributions = useAppStore((state) => state.contributions)
  const isAdmin = useAppStore((state) => state.isAdmin)
  const user = useAppStore((state) => state.user)
  const router = useRouter()
  const redirect = () => router.back()
  const dialogRef = useRef<any>(null)

  const onSubmit = (data: FormData) => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('type', data.type)
    setLoading(true)
    apis.leaseRequests
      .postDocuments(leaseRequestUuid, formData)
      .then(() => {
        snackbar('success', 'فایل با موفقیت ثبت شد')
        readDocuments()
        reset()
      })
      .catch((err: Error) => {
        err && snackbar('error', 'حجم فایل مورد نظر زیاد است')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getLeasRequest = async () => {
    try {
      setLoading(true)
      const { data } = await apis.leaseRequests.getItem(leaseRequestUuid)
      setRequiredDocumentsInfo(data?.requiredDocuments)
      setLeaseRequest(data?.leaseRequest)
    } catch (err: any) {
      snackbar('error', err)
    } finally {
      setLoading(false)
    }
  }

  const readDocuments = () => {
    setLoading(true)
    apis.leaseRequests
      .readDocuments(leaseRequestUuid)
      .then(({ data }: { data: Documents }) => {
        setDocuments(data)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const handleDeleteDocument = (document: DocumentInfoList) => {
    setDeleteLoading(true)

    const documentId = document.name
    const payload = {
      fileName: document.name
    }

    Swal.fire({
      title: 'آیا از حذف اطمینان دارید؟',
      text: ' ',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر'
    }).then((result) => {
      if (result.isConfirmed) {
        apis.leaseRequests
          .deleteDocument(leaseRequestUuid, documentId, payload, config)
          .then(() => {
            Swal.fire({
              text: 'با موفقیت حذف شد!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
            readDocuments()
          })
          .catch((err: Error) => snackbar('error', err))
          .finally(() => setDeleteLoading(false))
      } else {
        setDeleteLoading(false)
      }
    })
  }

  const sendForApprove = (payload: any = null) => {
    setSendForApproveLoading(true)
    const mainPayload = payload ?? { documentsApproved: BooleanPlus.REQUESTED }

    apis.leaseRequests
      .approve(leaseRequestUuid, mainPayload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        getLeasRequest()
        router.back()
      })
      .catch((err: any) => {
        if (err?.data?.code === 'NO_DOCUMENTS_UPLOADED') {
          handleStatusError(err?.data?.message)
        } else {
          snackbar('error', err)
        }
      })
      .finally(() => setSendForApproveLoading(false))
  }

  const handleStatusError = (err: any) => {
    Swal.fire({
      text: `${err}.آیا مطمئن هستید؟`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          documentsApproved: BooleanPlus.REQUESTED,
          suppressWarnings: true
        }
        sendForApprove(payload)
      }
    })
  }

  const handleApproveDocuments = () => {
    setApproveLoading(true)

    const payload = {
      documentsApproved: BooleanPlus.GRANTED,
      suppressWarnings: true
    }

    apis.leaseRequests
      .approve(leaseRequestUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت تایید شد')
        getLeasRequest()
        router.back()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setApproveLoading(false))
  }

  const handleReturnForUpdateDocumets = () => {
    setReturnLoading(true)

    const payload = {
      documentsApproved: BooleanPlus.RETURNED
    }

    apis.leaseRequests
      .approve(leaseRequestUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد ')
        getLeasRequest()
        router.back()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setReturnLoading(false))
  }

  const pdfDocuments =
    documents?.documentInfoList?.filter(
      (item) => item?.name.split('.')[1]?.toLowerCase() === 'pdf'
    ) || []

  const imageDocuments =
    documents?.documentInfoList?.filter(
      (item) => item?.name.split('.')[1]?.toLowerCase() !== 'pdf'
    ) || []

  useEffect(() => {
    getLeasRequest()
    readDocuments()
  }, [])

  if (loading) return <KLoading />

  return (
    <Box>
      <KButton
        startIcon={<ArrowForwardIcon />}
        color="info"
        size="large"
        sx={{ marginBottom: '16px' }}
        onClick={redirect}
      >
        بازگشت
      </KButton>

      <ViewDocument ref={dialogRef} />

      <Alert severity="success" sx={{ margin: '15px 0' }} icon={<InfoIcon />}>
        <AlertTitle color="success">توضیحات</AlertTitle>
        {requiredDoumentsInfo?.description}
      </Alert>

      <Alert severity="info" sx={{ margin: '15px 0' }} icon={<AttachFileIcon />}>
        <AlertTitle color="info">مدارک مورد نیاز</AlertTitle>
        {requiredDoumentsInfo?.requiredDocuments.map((item: any, index: number) => (
          <p key={`requiredDocuments-${index}-${item}`}>
            &ndash; &nbsp;
            {enumsProvider('RequiredDocumentsList', item)?.title}
          </p>
        ))}
      </Alert>

      {user?.uuid === leaseRequest?.userUuid && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sx={{ margin: '10px 0' }}>
              <KSelect
                items={RequiredDocumentsList}
                name="type"
                control={control}
                label="انتخاب مدرک"
                rules={{ required: required() }}
              />
            </Grid>
            <Grid item xs={12} md={8} sx={{ margin: '10px 0' }}>
              <KFileUpload control={control} name="file" isRequired />
            </Grid>
          </Grid>

          <KButton
            type="submit"
            variant="contained"
            color="success"
            sx={{ margin: '10px 0' }}
            disabled={
              leaseRequest?.documentsProvided === BooleanPlus.REQUESTED ||
              leaseRequest?.documentsProvided === BooleanPlus.GRANTED
            }
          >
            ثبت
          </KButton>

          <KButton
            type="button"
            variant="contained"
            color="primary"
            sx={{ margin: '15px' }}
            onClick={() => sendForApprove()}
            disabled={
              leaseRequest?.documentsProvided === BooleanPlus.REQUESTED ||
              leaseRequest?.documentsProvided === BooleanPlus.GRANTED
            }
            loading={sendForapproveLoading}
          >
            ثبت نهایی مدارک
          </KButton>
        </form>
      )}

      {(leaseRequest?.documentsProvided === BooleanPlus.REQUESTED ||
        leaseRequest?.documentsProvided === BooleanPlus.RETURNED) &&
        (isAdmin || contributions?.[0]?.partyId === leaseRequest.leasingCompanyUuid) && (
          <>
            <KButton
              type="button"
              variant="contained"
              color="success"
              sx={{ margin: '10px 5px' }}
              onClick={handleApproveDocuments}
              loading={approveLoading}
              disabled={leaseRequest.documentsProvided !== BooleanPlus.REQUESTED}
            >
              تایید مدارک
            </KButton>

            <KButton
              type="button"
              variant="contained"
              color="error"
              sx={{ margin: '10px 0' }}
              onClick={handleReturnForUpdateDocumets}
              loading={returnLoading}
              disabled={leaseRequest.documentsProvided !== BooleanPlus.REQUESTED}
            >
              برگشت جهت ویرایش
            </KButton>
          </>
        )}

      {documents?.documentInfoList && documents.documentInfoList.length > 0 && (
        <Box>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            {pdfDocuments.map((item) => (
              <Grid item xs={12} md={6} key={item.name}>
                <Box
                  sx={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    gap: '0 10px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <PictureAsPdfIcon color="error" />
                  <Typography>
                    {enumsProvider('RequiredDocumentsList', item.type)?.title}
                  </Typography>

                  <Box sx={{ marginLeft: 'auto' }}>
                    <Link href={`${appUrl}/${item?.path}`} target="_blank">
                      <KIconButton color="info" toolTipTitle="مشاهده">
                        <VisibilityIcon />
                      </KIconButton>
                    </Link>

                    {user?.uuid === leaseRequest?.userUuid && (
                      <KIconButton
                        color="error"
                        toolTipTitle="حذف"
                        onClick={() => handleDeleteDocument(item)}
                        loading={deleteLoading}
                        disabled={
                          leaseRequest?.documentsProvided === BooleanPlus.GRANTED ||
                          leaseRequest?.documentsProvided === BooleanPlus.REQUESTED
                        }
                      >
                        <DeleteForeverIcon />
                      </KIconButton>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <ImageList sx={{ marginTop: '20px' }} cols={2} gap={10}>
            <ImageListItem key="Subheader" cols={2}>
              <ListSubheader component="div">مدارک تصویری</ListSubheader>
            </ImageListItem>
            {imageDocuments.map((item: any) => (
              <Box key={item.name}>
                <ImageListItem>
                  <img
                    alt={item.name}
                    src={`${appUrl}/${item.path}`}
                    loading="lazy"
                    style={{ borderRadius: '8px', cursor: 'pointer', maxHeight: '300px' }}
                    onClick={() => dialogRef?.current?.showDialog(item)}
                  />
                  <ImageListItemBar
                    title={enumsProvider('RequiredDocumentsList', item.type)?.title}
                    actionIcon={
                      <div>
                        <KIconButton
                          color="info"
                          toolTipTitle="مشاهده"
                          onClick={() => dialogRef?.current?.showDialog(item)}
                        >
                          <VisibilityIcon />
                        </KIconButton>

                        {user?.uuid === leaseRequest?.userUuid && (
                          <KIconButton
                            color="error"
                            toolTipTitle="حذف"
                            onClick={() => handleDeleteDocument(item)}
                            loading={deleteLoading}
                            disabled={
                              leaseRequest?.documentsProvided === BooleanPlus.GRANTED ||
                              leaseRequest?.documentsProvided === BooleanPlus.REQUESTED
                            }
                          >
                            <DeleteForeverIcon />
                          </KIconButton>
                        )}
                      </div>
                    }
                  />
                </ImageListItem>
              </Box>
            ))}
          </ImageList>
        </Box>
      )}
    </Box>
  )
}
