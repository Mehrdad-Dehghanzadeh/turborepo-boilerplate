import { useInquiry } from '@context/InquiryContext'
import { KFieldset, KInfo, KLoading } from '@components/kits'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { enumsProvider } from '@utils/enums'
import { Chip } from '@mui/material'
import { utcToJalali, utcToJalaliAll } from '@utils/date'

export default function InquiryResult() {
  const { loading, kycResult: inquiryResult } = useInquiry()

  if (loading) return <KLoading />
  if (!inquiryResult) return null

  return (
    <Paper
      component="section"
      sx={{
        paddingX: '16px',
        paddingBottom: '16px',
        paddingTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px 0'
      }}
    >
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
                inquiryResult?.identityCardInquiry?.result?.nationalCard?.nationalCode
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="تاریخ تولد"
              value={utcToJalali(
                inquiryResult?.identityCardInquiry?.result?.nationalCard?.dateOfBirth
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="محل تولد"
              value={inquiryResult?.identityCardInquiry?.result?.identityCard?.birthPlace}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="نام پدر"
              value={inquiryResult?.identityCardInquiry?.result?.identityCard?.fatherName}
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
                inquiryResult?.simCardOwnershipInquiry?.parameters?.mobilePhoneNumber
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="کد ملی"
              value={inquiryResult?.simCardOwnershipInquiry?.parameters?.nationalCode}
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
            <KInfo title="کد پیگیری" value={inquiryResult?.ibanInquiry?.trackingCode} />
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
              value={inquiryResult?.postalCodeInquiry?.result?.postalAddress?.address}
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
                value={utcToJalaliAll(inquiryResult?.postalCodeInquiry?.done?.issueTime)}
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
    </Paper>
  )
}
