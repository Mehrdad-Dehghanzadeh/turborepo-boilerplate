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
import Link from 'next/link'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import AlertTitle from '@mui/material/AlertTitle'
import { LeaseDto } from '@models/Lease'
import { OrderItemList } from '@models/Orders'
import useFilters from '@hooks/useFilters'

export default function MyLeasePayments() {
  const settlementDialogRef = useRef<any>()
  const router = useRouter()
  const redirect = () => router.back()
  const params = useSearchParams()
  const leaseUuid = params.get('leaseUuid')
  const [loading, setLoading] = useState<boolean>(false)
  const [payments, setPayments] = useState<PaymentsType[] | null>(null)
  const { snackbar } = useSnackbar()
  const [showAlert, setShowAlert] = useState<boolean>(true)
  const isPending = payments?.some((payment) => payment.status === 'PENDING')
  const [lease, setLease] = useState<LeaseDto | null>(null)
  const { price } = useFilters()

  const getLeasePayments = () => {
    setLoading(true)

    apis.leases
      .payments(leaseUuid)
      .then(({ data }: { data: PaymentsType[] }) => {
        setPayments(data)
        setLease(data?.[0]?.lease)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => setLoading(false))
  }

  const closeCallBack = () => getLeasePayments()

  const viewOrderDocuments = () =>
    router.push(`/dashboard/upload-order-documents?uuid=${payments?.[0]?.order?.uuid}`)

  useEffect(() => {
    getLeasePayments()
  }, [leaseUuid])

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

      {isPending && (
        <>
          <Grid item xs={12}>
            <Collapse in={showAlert}>
              <Alert
                severity="info"
                action={
                  <KIconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setShowAlert(false)
                    }}
                  >
                    <Link
                      href={{
                        pathname: `signing-contract`,
                        query: { leaseUuid, contractUuid: lease?.contractUuid }
                      }}
                      target="_blank"
                    >
                      <KButton
                        variant="contained"
                        color="info"
                        endIcon={<HistoryEduIcon sx={{ fontSize: '27px' }} />}
                      >
                        امضای قرارداد
                      </KButton>
                    </Link>
                  </KIconButton>
                }
                sx={{ mb: 2 }}
              >
                <AlertTitle>راهنما</AlertTitle>
                تکمیل پرداخت نیازمند امضای قرارداد تسهیلات است
              </Alert>
            </Collapse>
          </Grid>
        </>
      )}

      {payments?.length ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'medium', marginBottom: '5px' }}>
              پرداخت‌ها
            </Typography>
            <Typography variant="subtitle1">پرداخت‌های مربوط به تسهیلات</Typography>
          </Box>
          <Paper
            sx={{
              padding: '10px'
            }}
          >
            <KFieldset title="اطلاعات تسهیلات">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <KInfo title="متقاضی" value={lease?.lessee?.name} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="نهاد مالی" value={lease?.lessor?.name} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="طرح" value={lease?.leasingProtocol?.name} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="اعتبار تخصیص داده شده"
                    value={price(lease?.allocatedCredit ?? '')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="اعتبار باقی مانده"
                    value={price(lease?.availableCredit ?? '')}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="دوره بازپرداخت" value={lease?.repaymentSchedule?.term} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="تناوب بازپرداخت"
                    value={
                      enumsProvider(
                        'FrequencyList',
                        lease?.repaymentSchedule?.paymentFrequency
                      )?.title
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo title="تاریخ ایجاد" value={utcToJalali(lease?.createDate)} />
                </Grid>
              </Grid>
            </KFieldset>
          </Paper>

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
              <KFieldset title="اطلاعات کالا">
                <Grid container>
                  {payment?.order?.orderItemList.map(
                    (item: OrderItemList, index: number) => (
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
                    )
                  )}

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="مبلغ پرداخت شده"
                      value={price(payment.order.leasePayment)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo title="متقاضی" value={payment.order.customer.name} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo title="تامین کننده" value={payment.order.provider.name} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="وضیعت پرداخت"
                      value={
                        <Chip
                          label={enumsProvider('CreditPay', payment.order.paid)?.title}
                          color={enumsProvider('CreditPay', payment.order.paid)?.color}
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
                          label={
                            enumsProvider('Delivered', payment.order.delivered)?.title
                          }
                          color={
                            enumsProvider('Delivered', payment.order.delivered)?.color
                          }
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
                      sx={{ marginTop: '10px' }}
                      onClick={viewOrderDocuments}
                    >
                      مشاهده مدارک
                    </KButton>
                  </Grid>
                </Grid>
              </KFieldset>

              <KFieldset title="اطلاعات پرداخت">
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <KInfo title="مبلغ" value={price(payment.amount)} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="مبلغ کل تسویه شده"
                      value={price(payment.totalSettlementAmount)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="نوع پرداخت"
                      value={
                        <Chip
                          label={enumsProvider('PaymentTypeList', payment.type)?.title}
                          color={enumsProvider('PaymentTypeList', payment.type)?.color}
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
                            enumsProvider('SettlementStateList', payment.status)?.title
                          }
                          color={
                            enumsProvider('SettlementStateList', payment.status)?.color
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
            </Paper>
          ))}

          <SettlementDialog ref={settlementDialogRef} closeCallBack={closeCallBack} />
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: 'center', color: 'var(--color-gray-500)', fontWeight: 'bold' }}
        >
          پرداختی وجود ندارد
        </Typography>
      )}
    </>
  )
}
