'use client'
import { KButton, KFieldset, KInfo, KLoading, KIconButton } from '@components/kits'
import { Box, Chip, Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useEffect, useRef, useState } from 'react'
import SettlementDialog from '@components-shared/settlementDialog/settlementDialog'
import { useRouter, useSearchParams } from 'next/navigation'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import PaymentsType, { SettlementInfos } from '@models/Payments'
import { enumsProvider } from '@utils/enums'
import Divider from '@mui/material/Divider'
import { utcToJalali } from '@utils/date'
import { SettlementStates } from '@enums/SettlementState'
import Link from 'next/link'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import Collapse from '@mui/material/Collapse'
import { Order, OrderItemList } from '@models/Orders'
import useFilters from '@hooks/useFilters'

export default function MyOrderPayments() {
  const settlementDialogRef = useRef<any>()
  const router = useRouter()
  const redirect = () => router.back()
  const params = useSearchParams()
  const orderUuid = params.get('orderUuid')
  const [loading, setLoading] = useState<boolean>(false)
  const [payments, setPayments] = useState<PaymentsType[] | null>(null)
  const { snackbar } = useSnackbar()
  const [showAlert, setShowAlert] = useState<boolean>(true)
  const [order, setOrder] = useState<Order | null>(null)
  const { price } = useFilters()

  const getOrderPayments = () => {
    setLoading(true)

    apis.orders
      .payments(orderUuid)
      .then(({ data }: { data: PaymentsType[] }) => {
        setPayments(data)
        setOrder(data?.[0]?.order)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const closeCallBack = () => getOrderPayments()

  const viewOrderDocuments = () =>
    router.push(`/dashboard/upload-order-documents?uuid=${order?.uuid}`)

  useEffect(() => {
    getOrderPayments()
  }, [orderUuid])

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

      {payments?.length ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'medium', marginBottom: '5px' }}>
              پرداخت‌ها
            </Typography>
            <Typography variant="subtitle1">پرداخت‌های مربوط به سفارش‌ها</Typography>
          </Box>

          {payments?.map((payment: PaymentsType) => (
            <Paper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '10px'
              }}
              key={payment.uuid}
            >
              <KFieldset title="اطلاعات پرداخت">
                <Grid container>
                  {payment?.status === SettlementStates.pending && (
                    <>
                      <Grid item xs={12}>
                        <Collapse in={showAlert}>
                          <Alert
                            severity="error"
                            action={
                              <KIconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                  setShowAlert(false)
                                }}
                              >
                                <CloseIcon fontSize="inherit" />
                              </KIconButton>
                            }
                            sx={{ mb: 2 }}
                          >
                            تکمیل پرداخت نیازمند امضای قرارداد تسهیلات است
                          </Alert>
                        </Collapse>
                      </Grid>

                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Link
                          href={{
                            pathname: `/dashboard/my-lease-payments`,
                            query: {
                              leaseUuid: payment?.lease?.uuid
                            }
                          }}
                        >
                          <KButton
                            variant="outlined"
                            color="success"
                            endIcon={<HistoryEduIcon sx={{ fontSize: '27px' }} />}
                          >
                            امضای قرارداد
                          </KButton>
                        </Link>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} md={6}>
                    <KInfo title="مبلغ" value={price(payment?.amount)} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="مبلغ کل تسویه شده"
                      value={price(payment?.totalSettlementAmount)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="نوع پرداخت"
                      value={
                        <Chip
                          label={enumsProvider('PaymentTypeList', payment?.type)?.title}
                          color={enumsProvider('PaymentTypeList', payment?.type)?.color}
                          size="small"
                          variant="outlined"
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="وضعیت"
                      value={
                        <Chip
                          label={
                            enumsProvider('SettlementStateList', payment?.status)?.title
                          }
                          color={
                            enumsProvider('SettlementStateList', payment?.status)?.color
                          }
                          size="small"
                          variant="outlined"
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {payment?.settlementInfos?.map((info: SettlementInfos) => (
                      <Box key={info.trackingNumber}>
                        <Divider sx={{ marginBottom: '15px' }}>
                          <Chip label="اطلاعات تسویه" size="small" color="info" />
                        </Divider>
                        <Grid container>
                          <Grid item xs={12} md={6}>
                            <KInfo title="مبلغ" value={price(info.amount)} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="بانک مبدا " value={info.source} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="بانک مقصد " value={info.destination} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="شناسه مبدا" value={info.sourceIdentity} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="شناسه مقصد" value={info.destinationIdentity} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="تاریخ " value={utcToJalali(info.dateTime)} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo
                              title="نوع تسویه "
                              value={
                                <Chip
                                  label={
                                    enumsProvider(
                                      'SettlementMethodList',
                                      info.settlementMethod
                                    )?.title
                                  }
                                  color={
                                    enumsProvider(
                                      'SettlementMethodList',
                                      info.settlementMethod
                                    )?.color
                                  }
                                  size="small"
                                  variant="outlined"
                                />
                              }
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="شماره پیگیری" value={info.trackingNumber} />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <KInfo title="توضیحات" value={info.description} />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </KFieldset>

              <KFieldset title="اطلاعات تسهیلات">
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <KInfo title="متقاضی" value={payment?.lease?.lessee?.name} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo title="نهاد مالی" value={payment?.lease?.lessor?.name} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo title="طرح" value={payment?.lease?.leasingProtocol?.name} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="اعتبار تخصیص داده شده"
                      value={price(payment?.lease?.allocatedCredit)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="اعتبار باقی مانده"
                      value={price(payment?.lease?.availableCredit)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="دوره بازپرداخت"
                      value={payment?.lease?.repaymentSchedule?.term}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="تناوب بازپرداخت"
                      value={
                        enumsProvider(
                          'FrequencyList',
                          payment?.lease?.repaymentSchedule?.paymentFrequency
                        )?.title
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="تاریخ ایجاد"
                      value={utcToJalali(payment?.lease?.createDate)}
                    />
                  </Grid>
                </Grid>
              </KFieldset>
            </Paper>
          ))}

          <Paper
            sx={{
              padding: '10px'
            }}
          >
            <KFieldset title="اطلاعات سفارش">
              <Grid container>
                {order?.orderItemList.map((item: OrderItemList, index: number) => (
                  <Grid container key={index}>
                    <Grid item xs={12} md={6}>
                      <KInfo title="نام" value={item?.productName} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo title="قیمت" value={price(item?.unitPrice)} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo title="تعداد" value={item?.quantity} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo title="شماره سریال" value={item?.serialNumber} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo title="دسته بندی" value={item.category.name} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo title="توضیحات" value={item?.description} />
                    </Grid>
                  </Grid>
                ))}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="مبلغ پرداخت شده"
                    value={price(order?.leasePayment ?? '')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="متقاضی" value={order?.customer?.name} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="تامین کننده" value={order?.provider?.name} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="وضیعت پرداخت"
                    value={
                      <Chip
                        label={enumsProvider('CreditPay', order?.paid)?.title}
                        color={enumsProvider('CreditPay', order?.paid)?.color}
                        variant="outlined"
                        size="small"
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="وضیعت تحویل"
                    value={
                      <Chip
                        label={enumsProvider('Delivered', order?.delivered)?.title}
                        color={enumsProvider('Delivered', order?.delivered)?.color}
                        variant="outlined"
                        size="small"
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KButton
                    color="info"
                    variant="contained"
                    onClick={viewOrderDocuments}
                    sx={{ marginTop: '10px' }}
                  >
                    مشاهده مدارک
                  </KButton>
                </Grid>
              </Grid>
            </KFieldset>
          </Paper>

          <SettlementDialog ref={settlementDialogRef} closeCallBack={closeCallBack} />
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'var(--color-gray-500)',
            fontWeight: 'bold'
          }}
        >
          پرداختی وجود ندارد
        </Typography>
      )}
    </>
  )
}
