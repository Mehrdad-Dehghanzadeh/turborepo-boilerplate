'use client'
import useValidations from '@hooks/useValidations'
import { KFileUpload } from '@components/kits/KFileUpload/KFileUpload'
import { useForm } from 'react-hook-form'
import { Box, Grid, Typography } from '@mui/material'
import { KButton, KIconButton, KLoading, KSelect } from '@components/kits'
import { useEffect, useRef, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { useSearchParams } from 'next/navigation'
import { VehicleDocumensList } from '@enums/VehicleDocumnetType'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import ListSubheader from '@mui/material/ListSubheader'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Link from 'next/link'
import { enumsProvider } from '@utils/enums'
import ViewDialog from './viewDialog'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { Order } from '@models/Orders'
import { BooleanPlus } from '@/ts/enums'

type Documents = {
  name: string
  type: string
  path: string
}

export default function UploadDocuments() {
  const { control, handleSubmit, reset } = useForm({})
  const { required } = useValidations()
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [documents, setDocuments] = useState<Documents[] | null>(null)
  const [order, setOrder] = useState<Order | null>()
  const { snackbar } = useSnackbar()
  const viewDailogRef = useRef<any>(null)
  const contributionUuid = useAppStore((state) => state.contributions)?.[0]?.partyId

  const router = useRouter()
  const redirect = () => router.back()

  const appUrl = process.env.NEXT_PUBLIC_API_URL

  const params = useSearchParams()
  const orderUuid = params.get('uuid')

  const onSubmitForm = (data: any) => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('type', data.type)
    setBtnLoading(true)

    apis.orders
      .postDocuments(orderUuid, data.type, formData)
      .then(() => {
        snackbar('success', 'فایل با موفقیت ثبت شد')
        readDocuments()
        reset()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setBtnLoading(false))
  }

  const readDocuments = () => {
    setLoading(true)

    apis.orders
      .readDocuments(orderUuid)
      .then(({ data }: any) => setDocuments(data))
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setLoading(false))
  }

  const readOrder = () => {
    setLoading(true)

    apis.orders
      .getItem(orderUuid)
      .then(({ data }: { data: Order }) => setOrder(data))
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    readDocuments()
    readOrder()
  }, [orderUuid])

  const pdfDocuments =
    documents?.filter((item) => item?.name.split('.')[1]?.toLowerCase() === 'pdf') || []

  const imageDocuments =
    documents?.filter((item) => item?.name.split('.')[1]?.toLowerCase() !== 'pdf') || []

  if (loading) return <KLoading />

  return (
    <>
      <KButton
        startIcon={<ArrowForwardIcon />}
        color="info"
        size="large"
        sx={{ marginBottom: '16px' }}
        onClick={redirect}
      >
        بازگشت
      </KButton>

      {contributionUuid === order?.provider?.uuid &&
        order?.approved !== BooleanPlus.GRANTED && (
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} sx={{ margin: '10px 0' }}>
                <KSelect
                  items={VehicleDocumensList}
                  name="type"
                  control={control}
                  label="انتخاب مدرک"
                  rules={{ required: required() }}
                />
              </Grid>
              <Grid item xs={12} md={8} sx={{ margin: '10px 0' }}>
                <KFileUpload control={control} name="file" isRequired />
              </Grid>

              <Grid xs={12} item>
                <KButton
                  color="success"
                  type="submit"
                  variant="contained"
                  loading={btnLoading}
                >
                  ثبت
                </KButton>
              </Grid>
            </Grid>
          </form>
        )}

      {documents?.length ? (
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
                    {enumsProvider('VehicleDocumensList', item.type)?.title}
                  </Typography>

                  <Box sx={{ marginLeft: 'auto' }}>
                    <Link href={`${appUrl}/${item?.path}`} target="_blank">
                      <KIconButton color="info" toolTipTitle="مشاهده">
                        <VisibilityIcon />
                      </KIconButton>
                    </Link>
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
                    onClick={() => viewDailogRef?.current?.showDialog(item)}
                  />
                  <ImageListItemBar
                    title={enumsProvider('RequiredDocumentsList', item.type)?.title}
                    actionIcon={
                      <div>
                        <KIconButton
                          color="info"
                          toolTipTitle="مشاهده"
                          onClick={() => viewDailogRef?.current?.showDialog(item)}
                        >
                          <VisibilityIcon />
                        </KIconButton>
                      </div>
                    }
                  />
                </ImageListItem>
              </Box>
            ))}
          </ImageList>
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', color: 'var(--color-gray-500)', fontWeight: 'bold' }}
        >
          هنوز مدرکی آپلود نشده است
        </Typography>
      )}

      <ViewDialog ref={viewDailogRef} />
    </>
  )
}
