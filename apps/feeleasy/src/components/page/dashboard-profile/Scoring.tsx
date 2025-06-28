import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { useAppStore } from '@store'
import { ScoringDto, OtpResponse } from '@models/Inquiry'
import { KButton, KLoading, KTextField, KInfo, KFieldset } from '@components/kits'
import { Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { BooleanPlus } from '@enums/BooleanPlus'
import { enumsProvider } from '@utils/enums'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { utcToJalaliAll } from '@utils/date'
import { useInquiry } from '@context/InquiryContext'
import { VoucherContext } from '@context/VoucherContext'
import { VoucherTypes } from '@enums/VoucherTypes'
import PaymentDialog from './PaymentDialog'

const RESENT_OTP = 90

export default function () {
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false)
  const { handleSubmit, control, reset } = useForm()
  const [time, setTime] = useState<number>(RESENT_OTP)
  const { snackbar } = useSnackbar()
  const [sendOtpLoading, setSendOtpLoading] = useState<boolean>(false)
  const [inquiryLoading, setInquiryLoading] = useState<boolean>(false)
  const user = useAppStore((state) => state.user)
  const [trackingCode, setTrackingCode] = useState<string>('')
  const { required } = useValidations()
  const updateUser = useAppStore((state) => state.updateUser)
  const { scoringResult: inquiryResult, getInquiryResult, loading } = useInquiry()
  const paymentRef = useRef<any>(null)

  const {
    loading: btnLoading,
    availableVouchers,
    payableItems,
    getVouchers,
    currentCaller
  } = useContext(VoucherContext)

  const handleSendOtp = () => {
    setSendOtpLoading(true)

    const userUuid = user?.uuid
    const payload = {
      intent: 'CREDIT_SCORING_INQUIRIES'
    }

    apis.inquiry
      .sendOtp(userUuid, payload)
      .then(({ data }: { data: OtpResponse }) => {
        snackbar('success', 'کدتایید به شماره همراه شما ارسال شد')
        setShowOtpInput(true)
        setTime(RESENT_OTP)
        setTrackingCode(data.trackingCode)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => setSendOtpLoading(false))
  }

  const createPayload = (payload: any) => {
    const data: ScoringDto = {
      mobilePhoneNumber: user?.contactInfo?.mobilePhoneNumber,
      nationalCode: user?.nationalCard?.nationalCode,
      type: 'SCORING',
      subjectUuid: user.uuid,
      otp: {
        value: payload.otpValue,
        intent: 'CREDIT_SCORING_INQUIRIES',
        reference: trackingCode
      }
    }

    return data
  }

  const handleCheckScoring = (data: any) => {
    setInquiryLoading(true)
    const payload = createPayload(data)

    apis.inquiry
      .postInquiryBatch(payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        setShowOtpInput(false)
        updateUser()
        getInquiryResult(user?.uuid)
        reset()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => setInquiryLoading(false))
  }

  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [time])

  useEffect(() => {
    if (
      availableVouchers?.includes(VoucherTypes.INQUIRY_CREDIT_SCORING) &&
      currentCaller === 'scoring'
    ) {
      handleSendOtp()
    } else if (currentCaller === 'scoring') {
      paymentRef?.current?.showDialog(payableItems)
    }
  }, [availableVouchers, payableItems])

  if (loading) return <KLoading />

  return (
    <>
      {(!inquiryResult ||
        inquiryResult.done === BooleanPlus.REJECTED ||
        inquiryResult.resultApproved === BooleanPlus.REJECTED) && (
        <>
          <Paper
            component="section"
            sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
          >
            <form onSubmit={handleSubmit(handleCheckScoring)}>
              {showOtpInput ? (
                <Grid container>
                  <Grid item xs={12}>
                    {time > 0 && (
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '14px',
                          color: 'var(--color-gray-600)',
                          margin: '15px 0'
                        }}
                      >
                        {time} ثانیه تا ارسال مجدد کد تایید
                      </Typography>
                    )}
                  </Grid>
                  <Grid
                    item
                    md={8}
                    sx={{
                      display: 'flex',
                      gap: '0 10px',
                      alignItems: 'center',
                      alignContent: 'baseline'
                    }}
                  >
                    <KTextField
                      control={control}
                      name="otpValue"
                      placeholder="کد یکبار مصرف"
                      rules={{
                        required: required()
                      }}
                    />

                    {time > 0 ? (
                      <KButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        loading={inquiryLoading}
                      >
                        ثبت
                      </KButton>
                    ) : (
                      <KButton
                        color="primary"
                        variant="contained"
                        onClick={handleSendOtp}
                        loading={sendOtpLoading}
                      >
                        ارسال مجدد کد تایید
                      </KButton>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <KButton
                  variant="contained"
                  color="info"
                  onClick={() => getVouchers?.('scoring')}
                  loading={btnLoading}
                  startIcon={<WorkspacePremiumIcon />}
                >
                  ثبت درخواست اعتبار سنجی
                </KButton>
              )}
            </form>
          </Paper>
        </>
      )}

      {inquiryResult && (
        <Paper
          component="section"
          sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px 0' }}>
            {inquiryResult?.done === BooleanPlus.REQUESTED ? (
              <Alert severity="warning">
                <AlertTitle>وضعیت اعتبار سنجی</AlertTitle>
                در انتظار نتیجه استعلام
              </Alert>
            ) : (
              <>
                <KFieldset title="استعلام چک برگشتی">
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <KInfo
                        title="چک برگشتی"
                        value={
                          inquiryResult?.bouncedChequeInquiry?.result
                            ?.bouncedChequeInquirys?.length
                            ? 'دارد'
                            : 'ندارد'
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo
                        title="وضعیت استعلام"
                        value={
                          <Chip
                            variant="outlined"
                            label={
                              enumsProvider(
                                'AuthenticationList',
                                inquiryResult?.bouncedChequeInquiry?.done?.status
                              )?.title
                            }
                            color={
                              enumsProvider(
                                'AuthenticationList',
                                inquiryResult?.bouncedChequeInquiry?.done?.status
                              )?.color
                            }
                            size="small"
                          />
                        }
                      />
                    </Grid>

                    {inquiryResult?.bouncedChequeInquiry?.done?.issueTime && (
                      <Grid item xs={12} md={6}>
                        <KInfo
                          title="زمان انجام"
                          value={utcToJalaliAll(
                            inquiryResult?.bouncedChequeInquiry?.done?.issueTime
                          )}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                      <KInfo
                        title="کد پیگیری"
                        value={inquiryResult?.bouncedChequeInquiry?.trackingCode}
                      />
                    </Grid>
                  </Grid>
                </KFieldset>

                <KFieldset title="استعلام تسهیلات جاری">
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <KInfo
                        title="تسهیلات جاری"
                        value={
                          inquiryResult?.facilityHistoryInquiry?.result?.facilityPortfolio
                            ?.facilityRecords?.length
                            ? 'دارد'
                            : 'ندارد'
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <KInfo
                        title="وضعیت استعلام"
                        value={
                          <Chip
                            variant="outlined"
                            label={
                              enumsProvider(
                                'AuthenticationList',
                                inquiryResult?.facilityHistoryInquiry?.done?.status
                              )?.title
                            }
                            color={
                              enumsProvider(
                                'AuthenticationList',
                                inquiryResult?.facilityHistoryInquiry?.done?.status
                              )?.color
                            }
                            size="small"
                          />
                        }
                      />
                    </Grid>

                    {inquiryResult?.facilityHistoryInquiry?.done?.issueTime && (
                      <Grid item xs={12} md={6}>
                        <KInfo
                          title="زمان انجام"
                          value={utcToJalaliAll(
                            inquiryResult?.facilityHistoryInquiry?.done?.issueTime
                          )}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                      <KInfo
                        title="کد پیگیری"
                        value={inquiryResult?.facilityHistoryInquiry?.trackingCode}
                      />
                    </Grid>
                  </Grid>

                  {inquiryResult?.facilityHistoryInquiry?.result?.facilityPortfolio
                    ?.facilityRecords && (
                    <Grid container>
                      <Grid item xs={12}>
                        <Divider sx={{ margin: '20px 0' }}>
                          <Chip label="اطلاعات تسهیلات جاری" size="small" color="info" />
                        </Divider>
                      </Grid>
                      {inquiryResult?.facilityHistoryInquiry?.result?.facilityPortfolio?.facilityRecords.map(
                        (item: any, index: number) => (
                          <Grid container key={index}>
                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="بانک"
                                value={
                                  enumsProvider('BankNamesList', item?.bankInfo?.bank)
                                    ?.title
                                }
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="شعبه" value={item?.bankInfo?.branchName} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="کد شعبه" value={item?.bankInfo?.branchCode} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="شماره درخواست" value={item?.requestNumber} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="نوع درخواست" value={item?.requestType} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="ارز" value={item?.currencyCode} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="مانده سررسید گذشته"
                                value={item?.overdueAmount}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="مانده معوقه" value={item?.deferredAmount} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="مانده مشکوک الوصول"
                                value={item?.doubtfulDebtAmount}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="مانده کل بدهی" value={item?.debtorAmount} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="نوع عقد قرارداد تسهيلات"
                                value={
                                  enumsProvider('FacilityTypesList', item?.facilityType)
                                    ?.title
                                }
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="وضیعت" value={item?.facilityStatus} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="اصل مبلغ تسهیلات"
                                value={item?.principalAmount}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="سود مبلغ تسهیلات"
                                value={item?.interestAmount}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="تاریخ تنظیم قرارداد"
                                value={item?.creationDate}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="تاریخ سررسید نهایی"
                                value={item?.maturityDate}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="مبلغ وجه التزام"
                                value={item?.obligationAmount}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo title="گروه تسهیلات" value={item?.category} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <KInfo
                                title="تاریخ تعلیق تسهیلات"
                                value={item?.moratoriumDate}
                              />
                            </Grid>
                            <Grid item xs={12} sx={{ margin: '20px 0' }}>
                              <Divider />
                            </Grid>
                          </Grid>
                        )
                      )}
                    </Grid>
                  )}
                </KFieldset>
              </>
            )}
          </Box>
        </Paper>
      )}

      <PaymentDialog ref={paymentRef} />
    </>
  )
}
