'use client'
import { KButton, KFieldset, KInfo } from '@components-kits'
import { useState, forwardRef, useImperativeHandle } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { deepClone } from '@utils/object'
import useFilters from '@hooks/useFilters'
import { enumsProvider } from '@utils/enums'
import { Box } from '@mui/material'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const [open, setOpen] = useState<boolean>(false)
  const [info, setInfo] = useState<any>(null)
  const { price } = useFilters()

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    closeCallBack?.()
  }

  const showDialog = (data: any) => {
    setInfo(deepClone(data))
    showCallBack?.()
    setOpen(true)
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  return (
    <Dialog open={open} maxWidth="md">
      {info && (
        <DialogContent sx={{ width: '680px' }}>
          <KFieldset title="جزئیات پروتکل">
            <Grid spacing={2} container>
              <Grid xs={6} item>
                <KInfo title="عنوان" value={info?.title} />
              </Grid>

              <Grid xs={6} item>
                <KInfo title="نهاد مالی" value={info?.ownerName} />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="منابع مالی اختصاص داده شده"
                  value={price(info?.totalAllocatedFund)}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="کمترین مبلغ قابل تایید"
                  value={price(info?.acceptableLeaseAmount?.minimum)}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="بیشترین مبلغ قابل تایید"
                  value={price(info?.acceptableLeaseAmount?.maximum)}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="نوع متقاضی قابل پذیرش"
                  value={info?.eligibleTenantTypes?.map((el: string, index: number) => (
                    <span key={`PartyType-${index}-${el}`}>
                      {index > 0 && ' ، '}
                      {enumsProvider('PartyTypeList', el)?.title}
                    </span>
                  ))}
                />
              </Grid>

              {info?.eligibleProductCategories && (
                <Grid xs={6} item>
                  <KInfo
                    title="گروه کالا/ خدمات"
                    value={info.eligibleProductCategories?.map(
                      (el: any, index: number) => (
                        <p
                          className="ml-1"
                          key={`eligibleProductCategories-${index}-${el}`}
                        >
                          {el.name}
                        </p>
                      )
                    )}
                  />
                </Grid>
              )}

              <Grid xs={6} item>
                <KInfo
                  title="نوع قرارداد تسهیلاتی"
                  value={info?.eligibleLeaseTypes?.map((el: string, index: number) => (
                    <span key={`EligibleLeaseTypes-${index}-${el}`}>
                      {index > 0 && ' ، '}
                      {enumsProvider('EligibleLeaseTypesList', el)?.title}
                    </span>
                  ))}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="کمینه مدت قرارداد (ماه)"
                  value={price(info?.acceptableTerm?.minimum, 'ماه')}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="بیشینه مدت قرارداد (ماه)"
                  value={price(info?.acceptableTerm?.maximum, 'ماه')}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="تناوب بازپرداخت"
                  value={info?.paymentFrequencyOptions?.map(
                    (el: string, index: number) => (
                      <p className="ml-1" key={`paymentFrequencyOptions-${index}-${el}`}>
                        {enumsProvider('FrequencyList', el)?.title}
                      </p>
                    )
                  )}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="روش پرداخت اقساط"
                  value={info?.acceptedPaymentMethods?.map(
                    (el: string, index: number) => (
                      <p className="ml-1" key={`acceptedPaymentMethods-${index}-${el}`}>
                        {enumsProvider('PaymentMethodList', el)?.title}
                      </p>
                    )
                  )}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="نرخ سود قرارداد تسهیلاتی"
                  value={price(info?.expectedInterest, 'درصد')}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="نرخ بازده مورد انتظار"
                  value={price(info?.expectedIncome, 'درصد')}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="مهلت تسویه لیزینگ با فروشگاه"
                  value={enumsProvider('DurationsList', info?.timeToPayShop)?.title}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="ضریب تخفیف تسویه زودتر از موعد"
                  value={
                    info?.prepaymentDiscountFactor?.useDefaultFormula
                      ? 'مقدار پیش فرض'
                      : info?.prepaymentDiscountFactor?.customFactor
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="ضریب خسارت تاخیر تادیه"
                  value={
                    info?.delayPenaltyFactor?.useDefaultFormula
                      ? 'مقدار پیش فرض'
                      : info?.delayPenaltyFactor?.customFactor
                  }
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="وثایق"
                  value={info?.collateralInfo.map((item: any, index: number) => {
                    return (
                      <Box key={`collateralInfo-${index}-${item}`}>
                        <p>
                          نوع وثیقه :
                          {enumsProvider('CollateralTypeList', item.type)?.title}
                        </p>
                        <p>نسبت(درصد): {item.guaranteeFactor} درصد</p>
                      </Box>
                    )
                  })}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="ضامنین"
                  value={info?.guarantorConfigList.map((item: any, index: number) => {
                    return (
                      <Box key={`guarantorConfigList-${index}-${item}`}>
                        <p>آستانه مقدار : {item.amountThreshold}</p>
                        <p>تعداد : {item.requiredGuarantors}</p>
                      </Box>
                    )
                  })}
                />
              </Grid>

              <Grid xs={6} item>
                <KInfo
                  title="مدارک مورد نیاز ضامنین"
                  value={info?.guaranteeDocumentInfo.map((item: any, index: number) => {
                    return (
                      <Box key={`guaranteeDocumentInfo-${index}-${item}`}>
                        {enumsProvider('GuaranteeDocumentTypeList', item.type)?.title} /
                        نسبت (درصد): {item.guaranteeFactor} درصد
                      </Box>
                    )
                  })}
                />
              </Grid>

              {info.requiredDocumentInfo && (
                <Grid xs={6} item>
                  <KInfo
                    title="مدارک مورد نیاز"
                    value={info?.requiredDocumentInfo.map((item: any, index: number) => {
                      return (
                        <Box
                          sx={{
                            borderBottom: '1px solid #e2e2e2',
                            marginBottom: '10px',
                            paddingBottom: '5px'
                          }}
                          key={`requiredDocumentInfo-${index}-${item}`}
                        >
                          <p>تا سقف مبلغ : {price(item.amountThreshold)}</p>
                          <div>
                            لیست مدارک :
                            {item.requiredDocuments.map((item: any, index: number) => (
                              <p key={`requiredDocuments-${index}-${item}`}>
                                &ndash; &nbsp;
                                {enumsProvider('RequiredDocumentsList', item)?.title}
                              </p>
                            ))}
                          </div>
                          <p>توضیحات : {item.description}</p>
                        </Box>
                      )
                    })}
                  />
                </Grid>
              )}

              <Grid xs={6} item>
                <KInfo title="توضیحات" value={info?.termsAndConditionsTemplate} />
              </Grid>
            </Grid>
          </KFieldset>
        </DialogContent>
      )}
      <Divider />

      <DialogActions>
        <KButton type="button" color="error" onClick={onClose}>
          بستن
        </KButton>
      </DialogActions>
    </Dialog>
  )
})
