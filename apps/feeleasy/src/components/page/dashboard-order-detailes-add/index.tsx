'use client'
import {
  KButton,
  KDatePicker,
  KFieldset,
  KIconButton,
  KLoading,
  KTextField
} from '@components/kits'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import { Box, Chip, Divider, ListSubheader, Paper, Typography } from '@mui/material'
import type { Order } from '@models/Orders'
import { useEffect, useRef, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import {
  InsuranceType,
  VehiclesDetails,
  VehiclesDocuments,
  VehiclesDocumentsDto,
  VehiclesDto
} from '@models/Assets'
import UploadDocuments from './upload-douments'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import { enumsProvider } from '@utils/enums'
import './index.scss'
import { format } from '@utils/date'
import { InsuranceTypes } from '@enums/Insurance'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Link from 'next/link'
import VisibilityIcon from '@mui/icons-material/Visibility'
import View from './view'

export default function OrderDetailsAdd() {
  const router = useRouter()
  const redirect = () => router.back()
  const params = useSearchParams()
  const orderUuid = params.get('orderUuid')
  const [loading, setLoading] = useState<boolean>(false)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [uploadDocumentLoading, setUploadDocumentLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const [order, setOrder] = useState<Order | null>()
  const [orderDetails, setOrderDetails] = useState<VehiclesDetails | null>(null)
  const [orderDocuments, setOrderDocumets] = useState<VehiclesDocuments[]>([])
  const appUrl = process.env.NEXT_PUBLIC_API_URL
  const [assetUuid, setAssetUuid] = useState<string>('')
  const dialogRef = useRef<any>(null)

  const { handleSubmit, control, reset } = useForm<VehiclesDetails>()

  function checkInsurance(insurance: InsuranceType | null): null | InsuranceType {
    const values = insurance && Object.values(insurance)

    if (values?.every((value) => value === null || value === '')) {
      return null
    }
    return insurance
  }

  const getOrderItem = () => {
    setLoading(true)

    apis.orders
      .getItem(orderUuid)
      .then(({ data }: { data: Order }) => {
        setOrder(data)
        let assetUuid = data.orderItemList.find((item) => item.assetUuid)?.assetUuid ?? ''
        setAssetUuid(assetUuid)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const createPayload = (data: VehiclesDetails) => {
    let validThirdPartyInsurance = checkInsurance(data.thirdPartyInsurance)

    if (validThirdPartyInsurance) {
      validThirdPartyInsurance.type = InsuranceTypes.THIRD_PARTY
    }

    if (validThirdPartyInsurance?.endDate) {
      format(validThirdPartyInsurance?.endDate)
    }

    const payload = {
      ...data,
      thirdPartyInsurance: validThirdPartyInsurance,
      orderUuid: orderUuid,
      orderItemIndex: 1
    }

    return payload
  }

  const handleSubmitOrderDetails = (data: VehiclesDetails) => {
    setBtnLoading(true)

    const payload = createPayload(data)

    if (assetUuid) {
      updateVehicles(payload)
    } else {
      postVehicles(payload)
    }
  }

  const getOrderDetails = (assetUuid: string) => {
    setLoading(true)

    apis.assets
      .getVehicles(assetUuid)
      .then(({ data }: { data: VehiclesDetails }) => {
        setOrderDetails(data)
        if (data) {
          getOrderDocuments(data?.uuid)
          setDefaultValus(data)
        }
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setLoading(false))
  }

  const postVehicles = (payload: VehiclesDto) => {
    apis.assets
      .postVehicles(payload)
      .then(({ data }: { data: Order }) => {
        snackbar('success', 'با موفقیت ثبت شد')
        getOrderItem()
        getOrderDetails(data?.uuid)
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setBtnLoading(false))
  }

  const updateVehicles = (payload: VehiclesDto) => {
    apis.assets
      .updateVehicles(assetUuid, payload)
      .then(({ data }: { data: Order }) => {
        snackbar('success', 'با موفقیت به روز رسانی شد')
        getOrderDetails(data?.uuid)
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setBtnLoading(false))
  }

  const postOrderDocuments = (data: VehiclesDocumentsDto) => {
    setUploadDocumentLoading(true)
    const vehicleUuid = orderDetails?.uuid
    const vehicleTitle = data.type
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('type', data.type)

    apis.assets
      .postVehiclesDocuments(vehicleUuid, vehicleTitle, formData)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        getOrderDocuments()
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setUploadDocumentLoading(false))
  }

  const getOrderDocuments = (vehicleUuid?: string) => {
    setLoading(true)
    const uuid = orderDetails?.uuid ?? vehicleUuid

    apis.assets
      .getVehiclesDocuments(uuid)
      .then(({ data }: any) => {
        setOrderDocumets(data)
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setLoading(false))
  }

  const setDefaultValus = (data: VehiclesDetails) => {
    reset({
      ...data,
      thirdPartyInsurance: {
        ...data?.thirdPartyInsurance,
        endDate: data?.thirdPartyInsurance?.endDate
          ? new Date(data?.thirdPartyInsurance?.endDate)
          : ''
      }
    })
  }

  const pdfDocuments =
    orderDocuments?.filter((item) => item?.name.split('.')[1]?.toLowerCase() === 'pdf') ||
    []

  const imageDocuments =
    orderDocuments?.filter((item) => item?.name.split('.')[1]?.toLowerCase() !== 'pdf') ||
    []

  useEffect(() => {
    getOrderItem()
  }, [orderUuid])

  useEffect(() => {
    if (assetUuid) getOrderDetails(assetUuid)
  }, [order])

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

      <View ref={dialogRef} />

      <form onSubmit={handleSubmit(handleSubmitOrderDetails)}>
        <Paper component="section" sx={{ padding: '16px' }}>
          <KFieldset title="ثبت جزئیات">
            <Grid container spacing={5} sx={{ padding: '20px 5px' }}>
              <Grid xs={12} md={6} item>
                <KTextField control={control} name="name" label="نام" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="chassisNumber" label="شماره شاسی" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="engineNumber" label="شماره موتور" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="vin" label="کد شناسایی خودرو (vin)" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="model" label="مدل" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="manufacturer" label="سازنده" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="yearOfManufacture" label="سال ساخت" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="color" label="رنگ" />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField control={control} name="licensePlate" label="پلاک" />
              </Grid>
            </Grid>

            <Divider sx={{ margin: '20px 0' }}>
              <Chip label="بیمه شخص ثالث" size="small" color="info" />
            </Divider>

            <Grid container spacing={3}>
              <Grid xs={12} md={6} item>
                <KTextField
                  control={control}
                  name="thirdPartyInsurance.uniqueInsuranceCode"
                  label="کد یکتای بیمه مرکزی"
                />
              </Grid>

              <Grid xs={12} md={6} item>
                <KTextField
                  control={control}
                  name="thirdPartyInsurance.insuranceNumber"
                  label="شماره بیمه نامه"
                />
              </Grid>

              <Grid xs={12} md={6} item>
                <KDatePicker
                  control={control}
                  name="thirdPartyInsurance.endDate"
                  label="انقضای بیمه"
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <KButton
              color="primary"
              variant="contained"
              type="submit"
              sx={{ display: 'block', marginLeft: 'auto', marginBottom: '15px' }}
              loading={btnLoading}
            >
              ثبت اطلاعات
            </KButton>
          </KFieldset>
        </Paper>
      </form>

      {assetUuid && (
        <UploadDocuments
          postOrderDocuments={postOrderDocuments}
          uploadDocumentLoading={uploadDocumentLoading}
        />
      )}

      {orderDocuments?.length > 0 && (
        <>
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
            {imageDocuments?.map((item: any) => (
              <ImageListItem key={item.name}>
                <img
                  alt={item.name}
                  src={`${appUrl}/${item.path}`}
                  loading="lazy"
                  style={{ borderRadius: '8px' }}
                />
                <ImageListItemBar
                  title={enumsProvider('VehicleDocumensList', item.type)?.title}
                  actionIcon={
                    <KIconButton
                      color="info"
                      toolTipTitle="مشاهده"
                      onClick={() => dialogRef?.current?.showDialog(item)}
                    >
                      <VisibilityIcon />
                    </KIconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </Box>
  )
}
