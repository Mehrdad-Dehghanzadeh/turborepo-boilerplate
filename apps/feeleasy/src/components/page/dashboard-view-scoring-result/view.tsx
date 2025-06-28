import { KFieldset, KInfo, KLoading } from '@components/kits'
import { useInquiry } from '@context/InquiryContext'
import { BooleanPlus } from '@enums/BooleanPlus'
import { utcToJalaliAll } from '@utils/date'
import { enumsProvider } from '@utils/enums'
import { Alert, AlertTitle, Box, Chip, Divider, Grid, Paper } from '@mui/material'

export default function ScoringResult() {
  const { loading, scoringResult: inquiryResult } = useInquiry()

  if (loading) return <KLoading />

  return (
    <Paper
      component="section"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px 0' }}>
        {inquiryResult?.done === BooleanPlus.REQUESTED ? (
          <Alert severity="warning">
            <AlertTitle>وضعیت اعتبار سنجی</AlertTitle>
            در انتظار نتیجه
          </Alert>
        ) : (
          <>
            <KFieldset title="استعلام چک برگشتی">
              <Grid container>
                <Grid item xs={12} md={6}>
                  <KInfo
                    title="چک برگشتی"
                    value={
                      inquiryResult?.bouncedChequeInquiry?.result?.bouncedChequeInquirys
                        ?.length
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
                    (item: Record<string, string>, index: number) => (
                      <Grid container key={index}>
                        <Grid item xs={12} md={6}>
                          <KInfo title="کد بانک" value={item?.bankCode} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <KInfo title="کد شعبه" value={item?.branchCode} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <KInfo title="نام شعبه" value={item?.branchName} />
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
                          <KInfo title="مانده سررسید گذشته" value={item?.overdueAmount} />
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
                          <KInfo title="اصل مبلغ تسهیلات" value={item?.principalAmount} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <KInfo title="سود مبلغ تسهیلات" value={item?.interestAmount} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <KInfo title="تاریخ تنظیم قرارداد" value={item?.creationDate} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <KInfo title="تاریخ سررسید نهایی" value={item?.maturityDate} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <KInfo title="مبلغ وجه التزام" value={item?.obligationAmount} />
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
  )
}
