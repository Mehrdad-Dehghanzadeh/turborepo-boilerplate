import { Chip, Divider, Grid, Paper } from '@mui/material'
import { utcToJalali, utcToJalaliAll } from '@utils/date'
import { enumsProvider } from '@utils/enums'
import { KFieldset, KInfo, KLoading } from '@components/kits'
import { useInquiry } from '@context/InquiryContext'
import useFilters from '@hooks/useFilters'
import Typography from '@mui/material/Typography'

export default function InquiryResult() {
  const { loading, repaymentChequeResult: inquiryResult } = useInquiry()
  const { price } = useFilters()

  if (loading) return <KLoading />

  return (
    <>
      {inquiryResult ? (
        <Paper
          component="section"
          sx={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px 0'
          }}
        >
          {inquiryResult?.chequeInquiries?.map((res: any, index: number) => (
            <KFieldset title={`استعلام چک شماره ${index + 1}`} key={index}>
              <Grid container>
                <Grid xs={12} md={4} lg={6} item>
                  <KInfo
                    title="وضیعت"
                    value={
                      <Chip
                        label={
                          enumsProvider('AuthenticationList', res?.done?.status)?.title
                        }
                        color={
                          enumsProvider('AuthenticationList', res?.done?.status)?.color
                        }
                        size="small"
                        variant="outlined"
                      />
                    }
                  />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo
                    title="زمان انجام"
                    value={utcToJalaliAll(res?.done?.issueTime)}
                  />
                </Grid>

                {res?.done?.issueTime && (
                  <Grid xs={12} md={4} lg={6} item>
                    <KInfo
                      title="زمان تایید"
                      value={utcToJalaliAll(res?.done?.issueTime)}
                    />
                  </Grid>
                )}

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="شناسه چک" value={res?.result?.chequeInfo?.identifier} />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="سریال چک" value={res?.result?.chequeInfo?.serial} />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="دارنده چک" value={res?.result?.chequeInfo?.owner} />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo
                    title="موعد پرداخت"
                    value={res?.result?.chequeInfo?.actionDate}
                  />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="عنوان چک" value={res?.result?.chequeInfo?.branchTitle} />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="کد شعبه" value={res?.result?.chequeInfo?.branchCode} />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="کدرهگیری استعلام" value={res?.trackingCode} />
                </Grid>

                <Grid xs={12} sx={{ marginBottom: '15px' }}>
                  <Divider>
                    <Chip label="اطلاعات جهت درج در چک" size="small" color="info" />
                  </Divider>
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo title="مبلغ" value={price(res?.result?.chequeInfo?.amount)} />
                </Grid>

                <Grid xs={12} md={4} lg={6} item>
                  <KInfo
                    title="تاریخ"
                    value={utcToJalali(res?.result?.chequeInfo?.dueDate)}
                  />
                </Grid>
              </Grid>
            </KFieldset>
          ))}
        </Paper>
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', color: 'var(--color-gray-500)' }}
        >
          استعلام انجام نشده است
        </Typography>
      )}
    </>
  )
}
