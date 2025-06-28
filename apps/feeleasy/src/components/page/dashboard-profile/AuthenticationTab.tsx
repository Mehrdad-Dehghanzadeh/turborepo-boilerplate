import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KFieldset, KInfo, KLoading } from '@components/kits'
import apis from '@apis'
import { useAppStore } from '@store'
import { useContext, useEffect, useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'
import { KButton } from '@components-kits'
import Box from '@mui/material/Box'
import { useRef } from 'react'
import BasicAuthDialog from './BasicAuthDialog'
import Chip from '@mui/material/Chip'
import { utcToJalali, utcToJalaliAll } from '@utils/date'
import { BooleanPlus } from '@enums/BooleanPlus'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { enumsProvider } from '@utils/enums'
import { useInquiry } from '@context/InquiryContext'
import { VoucherTypes } from '@enums/VoucherTypes'
import PaymentDialog from './PaymentDialog'
import { VoucherContext } from '@context/VoucherContext'

export default function () {
  const updateUser = useAppStore((state) => state.updateUser)
  const [inquiryWithdrewLoading, setInquiryWithdrewLoading] = useState<boolean>(false)
  const [inquiryConfirmLoading, setInquiryConfirmLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const basicAuthDialogRef = useRef<any>()
  const paymentRef = useRef<any>(null)
  const { kycResult: inquiryResult, getInquiryResult, loading } = useInquiry()
  const subjectUuid = inquiryResult?.subjectUuid
  const inquiryUuid = inquiryResult?.uuid
  const user = useAppStore((state) => state.user)
  const {
    loading: btnLoading,
    availableVouchers,
    payableItems,
    getVouchers,
    currentCaller
  } = useContext(VoucherContext)

  const confirmInquiryBatchResult = () => {
    setInquiryConfirmLoading(true)
    const payload = {
      done: BooleanPlus.CONFIRMED,
      type: 'KYC'
    }

    apis.inquiry
      .confirmInquiryBatchResult(inquiryUuid, payload)
      .then(() => {
        updateUser()
      })
      .then(() => {
        snackbar('success', 'اطلاعات با موفقیت تایید شد')
        getInquiryResult(subjectUuid)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => setInquiryConfirmLoading(false))
  }

  const witdrewInquiryResult = () => {
    setInquiryWithdrewLoading(true)

    const payload = {
      done: BooleanPlus.WITHDREW,
      type: 'KYC'
    }

    apis.inquiry
      .modifyInquiryBatchResult(inquiryUuid, payload)
      .then(() => updateUser())
      .then(() => {
        snackbar('success ', 'با موفقیت انجام شد')
        getInquiryResult(subjectUuid)
      })
      .catch((err: Error) => snackbar('error ', err))
      .finally(() => setInquiryWithdrewLoading(false))
  }

  useEffect(() => {
    if (
      availableVouchers?.includes(VoucherTypes.INQUIRY_KYC) &&
      currentCaller === 'kyc'
    ) {
      basicAuthDialogRef?.current?.showDialog()
    } else if (currentCaller === 'kyc') {
      paymentRef?.current?.showDialog(payableItems)
    }
  }, [availableVouchers, payableItems])

  if (loading) return <KLoading />

  return (
    <>
      <Paper
        component="section"
        sx={{
          paddingX: '16px',
          paddingBottom: '16px',
          paddingTop: '24px'
        }}
      >
        {inquiryResult && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px 0' }}>
            {inquiryResult.done === BooleanPlus.REJECTED && (
              <Alert severity="error">
                <AlertTitle>وضعیت استعلام</AlertTitle>
                انجام نشده
              </Alert>
            )}

            {inquiryResult.done === BooleanPlus.RETURNED && (
              <Alert severity="warning">
                <AlertTitle>وضعیت استعلام</AlertTitle>
                برگشت جهت ویرایش
              </Alert>
            )}

            {inquiryResult.done === BooleanPlus.WITHDREW && (
              <Alert severity="error">
                <AlertTitle>وضعیت استعلام</AlertTitle>
                رد شده توسط کاربر
              </Alert>
            )}

            {inquiryResult?.done === BooleanPlus.REQUESTED && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Alert severity="warning">
                    <AlertTitle>وضیعت استعلام</AlertTitle>
                    در انتظار نتیجه
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    برای مشاهده نتیجه، پس از چند دقیقه صفحه را بروزرسانی کنید.
                  </Alert>
                </Grid>
              </Grid>
            )}

            <KFieldset title="استعلام اطلاعات شناسایی">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <KInfo
                    title="نام"
                    value={inquiryResult?.identityCardInquiry?.result?.firstName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="نام خانوادگی"
                    value={inquiryResult?.identityCardInquiry?.result?.lastName}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کد ملی"
                    value={
                      inquiryResult?.identityCardInquiry?.result?.nationalCard
                        ?.nationalCode
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="تاریخ تولد"
                    value={utcToJalali(
                      inquiryResult?.identityCardInquiry?.result?.nationalCard
                        ?.dateOfBirth
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="محل تولد"
                    value={
                      inquiryResult?.identityCardInquiry?.result?.identityCard?.birthPlace
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="نام پدر"
                    value={
                      inquiryResult?.identityCardInquiry?.result?.identityCard?.fatherName
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
                            inquiryResult?.identityCardInquiry?.done?.status
                          )?.title
                        }
                        color={
                          enumsProvider(
                            'AuthenticationList',
                            inquiryResult?.identityCardInquiry?.done?.status
                          )?.color
                        }
                        size="small"
                      />
                    }
                  />
                </Grid>

                {inquiryResult?.identityCardInquiry?.done?.issueTime && (
                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="زمان انجام"
                      value={utcToJalaliAll(
                        inquiryResult?.identityCardInquiry?.done?.issueTime
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کد پیگیری"
                    value={inquiryResult?.identityCardInquiry?.trackingCode}
                  />
                </Grid>
              </Grid>
            </KFieldset>

            <KFieldset title="استعلام مالکیت سیم کارت">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <KInfo
                    title="شماره تلفن همراه"
                    value={
                      inquiryResult?.simCardOwnershipInquiry?.parameters
                        ?.mobilePhoneNumber
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کد ملی"
                    value={
                      inquiryResult?.simCardOwnershipInquiry?.parameters?.nationalCode
                    }
                  />
                </Grid>

                {inquiryResult?.simCardOwnershipInquiry?.result && (
                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="نتیجه استعلام"
                      value={
                        inquiryResult?.simCardOwnershipInquiry?.result
                          ?.simCardOwnershipConfirmed ? (
                          <Chip
                            label="مالکیت سیم کارت تایید شده"
                            variant="outlined"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="مالکیت سیم کارت تایید نشده"
                            variant="outlined"
                            color="error"
                            size="small"
                          />
                        )
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="وضعیت استعلام"
                    value={
                      <Chip
                        variant="outlined"
                        label={
                          enumsProvider(
                            'AuthenticationList',
                            inquiryResult?.simCardOwnershipInquiry?.done?.status
                          )?.title
                        }
                        color={
                          enumsProvider(
                            'AuthenticationList',
                            inquiryResult?.simCardOwnershipInquiry?.done?.status
                          )?.color
                        }
                        size="small"
                      />
                    }
                  />
                </Grid>

                {inquiryResult?.simCardOwnershipInquiry?.done?.issueTime && (
                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="زمان انجام"
                      value={utcToJalaliAll(
                        inquiryResult?.simCardOwnershipInquiry?.done?.issueTime
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کد پیگیری"
                    value={inquiryResult?.simCardOwnershipInquiry?.trackingCode}
                  />
                </Grid>
              </Grid>
            </KFieldset>

            <KFieldset title="استعلام شماره شبا">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <KInfo
                    title="شماره شبا"
                    value={inquiryResult?.ibanInquiry?.parameters?.iban}
                  />
                </Grid>

                {inquiryResult?.ibanInquiry?.result && (
                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="نتیجه استعلام"
                      value={
                        inquiryResult?.ibanInquiry?.result?.ibanOwnershipConfirmed ? (
                          <Chip
                            label="شماره شبا تایید شده"
                            variant="outlined"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="شماره شبا تایید نشده"
                            variant="outlined"
                            color="error"
                            size="small"
                          />
                        )
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="وضعیت استعلام"
                    value={
                      <Chip
                        variant="outlined"
                        label={
                          enumsProvider(
                            'AuthenticationList',
                            inquiryResult?.ibanInquiry?.done?.status
                          )?.title
                        }
                        color={
                          enumsProvider(
                            'AuthenticationList',
                            inquiryResult?.ibanInquiry?.done?.status
                          )?.color
                        }
                        size="small"
                      />
                    }
                  />
                </Grid>

                {inquiryResult?.ibanInquiry?.done?.issueTime && (
                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="زمان انجام"
                      value={utcToJalaliAll(inquiryResult?.ibanInquiry?.done?.issueTime)}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کد پیگیری"
                    value={inquiryResult?.ibanInquiry?.trackingCode}
                  />
                </Grid>
              </Grid>
            </KFieldset>

            <KFieldset title="استعلام کد پستی">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کدپستی"
                    value={inquiryResult?.postalCodeInquiry?.parameters?.postalCode}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="استان"
                    value={inquiryResult?.postalCodeInquiry?.result?.postalAddress?.state}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="شهر"
                    value={inquiryResult?.postalCodeInquiry?.result?.postalAddress?.city}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="آدرس پستی"
                    value={
                      inquiryResult?.postalCodeInquiry?.result?.postalAddress?.address
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
                            inquiryResult?.postalCodeInquiry?.done?.status
                          )?.title
                        }
                        color={
                          enumsProvider(
                            'AuthenticationList',
                            inquiryResult?.postalCodeInquiry?.done?.status
                          )?.color
                        }
                        size="small"
                      />
                    }
                  />
                </Grid>

                {inquiryResult?.postalCodeInquiry?.done?.issueTime && (
                  <Grid item xs={12} md={6}>
                    <KInfo
                      title="زمان انجام"
                      value={utcToJalaliAll(
                        inquiryResult?.postalCodeInquiry?.done?.issueTime
                      )}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <KInfo
                    title="کد پیگیری"
                    value={inquiryResult?.postalCodeInquiry?.trackingCode}
                  />
                </Grid>
              </Grid>
            </KFieldset>

            {inquiryResult.done === BooleanPlus.GRANTED && (
              <Box sx={{ display: 'flex', gap: '0 10px' }}>
                <KButton
                  type="button"
                  variant="contained"
                  color="success"
                  sx={{ width: 'max-content' }}
                  onClick={confirmInquiryBatchResult}
                  loading={inquiryConfirmLoading}
                >
                  تایید اطلاعات
                </KButton>

                <KButton
                  type="button"
                  variant="contained"
                  color="error"
                  sx={{ width: 'max-content' }}
                  onClick={witdrewInquiryResult}
                  loading={inquiryWithdrewLoading}
                >
                  رد کردن اطلاعات
                </KButton>
              </Box>
            )}

            {inquiryResult.done === BooleanPlus.RETURNED && (
              <KButton
                type="button"
                variant="contained"
                sx={{ width: 'max-content' }}
                onClick={() => basicAuthDialogRef?.current?.showDialog(inquiryResult)}
              >
                ویرایش
              </KButton>
            )}
          </Box>
        )}

        {(!inquiryResult ||
          inquiryResult.done === BooleanPlus.REJECTED ||
          inquiryResult.done === BooleanPlus.WITHDREW ||
          inquiryResult.done === BooleanPlus.CONFIRMED) && (
          <KButton
            variant="contained"
            color="info"
            onClick={() => getVouchers?.('kyc')}
            startIcon={<VerifiedUserIcon />}
            sx={{ margin: '10px 0' }}
            loading={btnLoading}
          >
            {!inquiryResult ? 'ثبت درخواست احراز هویت' : 'ثبت احراز هویت مجدد'}
          </KButton>
        )}
      </Paper>

      <BasicAuthDialog
        ref={basicAuthDialogRef}
        closeCallBack={() => getInquiryResult(user?.uuid)}
      />

      <PaymentDialog ref={paymentRef} />
    </>
  )
}
