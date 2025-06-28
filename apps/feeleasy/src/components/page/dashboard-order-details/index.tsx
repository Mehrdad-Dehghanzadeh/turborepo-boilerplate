'use client'
import apis from '@apis'
import { VehiclesDetails, VehiclesDocuments } from '@models/Assets'
import useSnackbar from '@hooks/useSnackbar'
import { utcToJalali } from '@utils/date'
import Divider from '@mui/material/Divider'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import {
  Box,
  Chip,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Paper,
  Typography
} from '@mui/material'
import { KFieldset, KIconButton, KInfo } from '@components/kits'
import { enumsProvider } from '@utils/enums'
import Link from 'next/link'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import View from './view'

export default function OrderDetails() {
  const [loading, setLoading] = useState<boolean>(false)
  const [orderDetails, setOrderDetails] = useState<VehiclesDetails | null>(null)
  const [orderDocuments, setOrderDocumets] = useState<VehiclesDocuments[]>([])
  const { snackbar } = useSnackbar()
  const param = useSearchParams()
  const assetUuid = param.get('uuid')
  const appUrl = process.env.NEXT_PUBLIC_API_URL
  const dialogRef = useRef<any>(null)

  const pdfDocuments =
    orderDocuments?.filter((item) => item?.name.split('.')[1]?.toLowerCase() === 'pdf') ||
    []

  const imageDocuments =
    orderDocuments?.filter((item) => item?.name.split('.')[1]?.toLowerCase() !== 'pdf') ||
    []

  const getOrderDetails = () => {
    setLoading(true)
    apis.assets
      .getVehicles(assetUuid)
      .then(({ data }: { data: VehiclesDetails }) => {
        setOrderDetails(data)
        if (data) {
          getOrderDocuments(data?.uuid)
        }
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setLoading(false))
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

  useEffect(() => {
    getOrderDetails()
  }, [])

  return (
    <>
      <View ref={dialogRef} />
      <Paper component="section" sx={{ padding: '16px' }}>
        <KFieldset title="جزئیات سفارش">
          <Grid spacing={2} container>
            <Grid item xs={12} md={6}>
              <KInfo title="نام" value={orderDetails?.name} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="شماره شاسی" value={orderDetails?.chassisNumber} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="شماره موتور" value={orderDetails?.engineNumber} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="کدشناسایی خودرو (vin)" value={orderDetails?.vin} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="مدل" value={orderDetails?.model} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="سازنده" value={orderDetails?.manufacturer} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="سال ساخت" value={orderDetails?.yearOfManufacture} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="رنگ" value={orderDetails?.color} />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo title="پلاک" value={orderDetails?.licensePlate} />
            </Grid>
          </Grid>

          <Divider sx={{ margin: '20px 0' }}>
            <Chip label="بیمه شخص ثالث" size="small" color="info" />
          </Divider>

          <Grid container>
            <Grid item xs={12} md={6}>
              <KInfo
                title="کد یکتا"
                value={orderDetails?.thirdPartyInsurance?.uniqueInsuranceCode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo
                title="شماره بیمه"
                value={orderDetails?.thirdPartyInsurance?.insuranceNumber}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <KInfo
                title="انقضای بیمه"
                value={utcToJalali(
                  orderDetails?.thirdPartyInsurance?.endDate?.toString() ?? ''
                )}
              />
            </Grid>
          </Grid>
        </KFieldset>
      </Paper>

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
    </>
  )
}
