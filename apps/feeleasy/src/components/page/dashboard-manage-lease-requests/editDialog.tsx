'use client'
import { KButton, KSelect, KTextField, KFieldset, KInfo } from '@components-kits'
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { deepClone } from '@utils/object'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { enumsProvider } from '@utils/enums'
import useFilters from '@hooks/useFilters'
import {
  LeaseRequestsDto,
  RequiredCollaterals,
  RequiredDocuments
} from '@models/LeaseRequests'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import { BooleanPlus } from '@enums/BooleanPlus'

type Props = {
  showCallBack?: () => void
  closeCallBack?: () => void
}

export default forwardRef<any, Props>(function (
  { showCallBack, closeCallBack }: Readonly<Props>,
  _ref
) {
  const { price } = useFilters()
  const { snackbar } = useSnackbar()
  const { required } = useValidations()
  const [open, setOpen] = useState<boolean>(false)
  const [info, setInfo] = useState<any>(null)
  const [protocol, setProtocol] = useState<any>(null)
  const [termValue, setTermValue] = useState<number>(0)
  const [repaymentPlan, setRepaymentPlan] = useState<any>(null)
  const [sliderStep, setSliderStep] = useState<number>(1)
  const [isDisable, setIsDisable] = useState<boolean>(false)

  const [requiredDocumentInfo, setRequiredDocumentInfo] =
    useState<RequiredDocuments | null>(null)

  const [requiredCollaterals, setRequiredCollaterals] = useState<
    RequiredCollaterals[] | null
  >(null)

  const { handleSubmit, control, reset, getValues, setValue, watch } =
    useForm<LeaseRequestsDto>({
      defaultValues: {
        amount: 0,
        interest: 0,
        term: 0,
        paymentFrequency: '',
        selectedCategoryCode: ''
      }
    })

  const paymentFrequency = watch('paymentFrequency')

  const onClose = () => {
    setOpen(false)
    setInfo(null)
    closeCallBack?.()
    setProtocol(null)
    setRequiredDocumentInfo(null)
    setRepaymentPlan(null)
    setIsDisable(false)
    reset()
  }

  const setformValues = (data: LeaseRequestsDto) => {
    control._formValues.amount = data.amount
    control._formValues.interest = data?.interest
    control._formValues.paymentFrequency = data?.paymentFrequency
    control._formValues.term = data?.term
    control._formValues.selectedCategoryCode = data?.selectedCategoryCode
  }

  const showDialog = (data: any) => {
    setInfo(deepClone(data))
    setTermValue(data?.term)

    const termValue = enumsProvider('FrequencyList', data.paymentFrequency)?.key
    setSliderStep(termValue as number)

    data?.approved === BooleanPlus.GRANTED && setIsDisable(true)
    apis.leasingProtocols
      .getItem(data?.leasingProtocolUuid)
      .then((res: any) => {
        setProtocol(res.data)
        setformValues(data)
        setOpen(true)
      })
      .catch((err: Error) => {
        snackbar('error', err.message)
      })
      .finally(() => {
        showCallBack?.()
      })
  }

  useImperativeHandle(_ref, () => ({
    showDialog
  }))

  const createPayload = (data: LeaseRequestsDto) => {
    const payload = deepClone<any>(data)
    payload.leasingProtocolUuid = info?.leasingProtocolUuid
    payload.userUuid = info?.userUuid
    payload.term = termValue
    return payload
  }

  const onSubmitForm = (data: LeaseRequestsDto) => {
    const payload = createPayload(data)
    apis.leaseRequests
      .update(payload, info?.uuid)
      .then(() => {
        onClose()
        snackbar('success', 'درخواست شما با موفقیت بروز شد')
      })
      .catch((err: Error) => {
        snackbar('error', err.message)
      })
  }

  const marks = [
    {
      value: protocol?.acceptableTerm?.minimum,
      label: `${protocol?.acceptableTerm?.minimum} ماه`
    },
    {
      value: protocol?.acceptableTerm?.maximum,
      label: `${protocol?.acceptableTerm?.maximum} ماه`
    }
  ]

  const getRepaymentPlan = () => {
    const term = termValue
    const amount = getValues('amount')
    const paymentFrequency = getValues('paymentFrequency')
    const protocolUUID = protocol?.uuid

    if (amount && paymentFrequency && term) {
      const params = {
        amount,
        paymentFrequency,
        term
      }

      apis.leasingProtocols
        .getPaymentPlans(protocolUUID, params)
        .then(({ data }: any) => {
          setRepaymentPlan(data?.[0])
        })
        .catch((err: Error) => snackbar('error', err))
    }
  }

  const getRequiredDocumentsInfo = () => {
    const protocolUUID = protocol?.uuid
    const amount = repaymentPlan?.totalRepaymentAmount

    apis.leasingProtocols
      .getRequiredDocuments(protocolUUID, { amount })
      .then(({ data }: any) => {
        setRequiredDocumentInfo(data.requiredDocuments)
        setRequiredCollaterals(data.requiredCollaterals)
      })
      .catch((err: Error) => snackbar('error', err))
  }

  const validateTermValue = (value: number, paymentFrequency: number) => {
    if (value % paymentFrequency !== 0) {
      return Math.ceil(value / paymentFrequency) * paymentFrequency
    }
    return value
  }

  const handleChange = (_: Event, newValue: number | number[]) => {
    setTermValue(newValue as number)
  }

  const getSelectedItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    const selectedKey = enumsProvider('FrequencyList', selectedValue)?.key
    setSliderStep(selectedKey as number)
    setTermValue(validateTermValue(termValue, selectedKey as number))
  }

  useEffect(() => {
    getRepaymentPlan()
  }, [open, termValue, paymentFrequency])

  useEffect(() => {
    if (repaymentPlan?.totalRepaymentAmount) {
      getRequiredDocumentsInfo()
    }
  }, [open, repaymentPlan])

  return (
    <Dialog open={open}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent sx={{ width: '580px' }}>
          {protocol && (
            <KFieldset className="mb-4" title="مشخصات طرح">
              <Grid spacing={3} container>
                <Grid xs={6} item>
                  <KInfo title="طرح" value={info?.protocolTitle} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="کمترین مبلغ مورد تایید"
                    value={price(protocol?.acceptableLeaseAmount?.minimum)}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="بیشترین مبلغ مورد تایید"
                    value={price(protocol?.acceptableLeaseAmount?.maximum)}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="کمینه مدت بازپرداخت (ماه)"
                    value={price(protocol?.acceptableTerm?.minimum, 'ماه')}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="بیشینه مدت بازپرداخت (ماه)"
                    value={price(protocol?.acceptableTerm?.maximum, 'ماه')}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="تناوب بازپرداخت"
                    value={protocol?.paymentFrequencyOptions?.map(
                      (el: string, index: number) => (
                        <p
                          className="ml-1"
                          key={`paymentFrequencyOptions-${index}-${el}`}
                        >
                          {enumsProvider('FrequencyList', el)?.title}
                        </p>
                      )
                    )}
                  />
                </Grid>
                <Grid xs={6} item>
                  <KInfo
                    title="سود تسهیلات"
                    value={price(protocol?.expectedInterest, 'درصد')}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="گروه کالا یا خدمات"
                    value={protocol?.eligibleProductCategories.map(
                      (item: any, index: number) => (
                        <p key={`eligibleProductCategories-${index}-${item}`}>
                          {item.name}
                        </p>
                      )
                    )}
                  />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="متقاضی" value={info?.userName} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo title="نهاد مالی" value={info?.companyName} />
                </Grid>

                <Grid xs={6} item>
                  <KInfo
                    title="مدارک مورد نیاز"
                    value={protocol?.requiredDocumentInfo.map(
                      (item: any, index: number) => (
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
                    )}
                  />
                </Grid>
              </Grid>
            </KFieldset>
          )}

          <KTextField
            sx={{ marginBottom: '24px' }}
            control={control}
            label="مبلغ"
            name="amount"
            rules={{ required: required() }}
            filterPrice
            onBlur={() => {
              getRepaymentPlan()
            }}
            disabled={isDisable}
          />

          <KSelect
            sx={{ marginBottom: '24px' }}
            label="تناوب بازپرداخت"
            name="paymentFrequency"
            control={control}
            items={protocol?.paymentFrequencyOptions.map((item: any) => {
              return {
                title: enumsProvider('FrequencyList', item)?.title,
                value: item
              }
            })}
            rules={{ required: required() }}
            onChange={(e) => {
              setValue('paymentFrequency', e.target.value)
              getSelectedItem(e)
            }}
            disabled={isDisable}
          />

          <Grid item xs={12}>
            <Box sx={{ paddingX: '10px' }}>
              <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                تعیین مدت بازپرداخت : &nbsp;
                {termValue ?? 0} ماه
              </Typography>
              <Slider
                marks={marks}
                step={sliderStep}
                value={termValue}
                valueLabelDisplay="auto"
                min={protocol?.acceptableTerm?.minimum}
                max={protocol?.acceptableTerm?.maximum}
                onChange={handleChange}
                disabled={!protocol || isDisable}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <KSelect
              items={protocol?.eligibleProductCategories}
              titleKey="name"
              valueKey="code"
              label="گروه کالایی"
              sx={{ marginBottom: '12px' }}
              name="selectedCategoryCode"
              control={control}
              rules={{ required: required() }}
              disabled={!protocol || isDisable}
            />
          </Grid>

          <Grid item xs={12}>
            {repaymentPlan && (
              <KFieldset className="mb-4" title="محاسبه اقساط">
                <Grid spacing={1} container>
                  <Grid xs={4} item>
                    <KInfo
                      title="مبلغ هر قسط"
                      value={price(repaymentPlan?.installmentAmount)}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <KInfo
                      title="مبلغ کل بازپرداخت"
                      value={price(repaymentPlan?.totalRepaymentAmount)}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <KInfo title="پیش پرداخت" value={price(repaymentPlan?.commission)} />
                  </Grid>
                </Grid>
              </KFieldset>
            )}
          </Grid>

          <Grid item xs={12}>
            {requiredDocumentInfo && (
              <KFieldset className="mb-4" title="مدارک مورد نیاز">
                <Grid spacing={1} container>
                  <Grid xs={6} item>
                    <KInfo
                      title="مدارک"
                      value={requiredDocumentInfo?.requiredDocuments?.map(
                        (item: any, index: number) => (
                          <p
                            key={`requiredDocumentInfo-requiredDocuments-${index}-${item}`}
                          >
                            &ndash; &nbsp;
                            {enumsProvider('RequiredDocumentsList', item)?.title}
                          </p>
                        )
                      )}
                    />
                  </Grid>

                  <Grid xs={6} item>
                    <KInfo
                      title="تا سقف مبلغ"
                      value={price(requiredDocumentInfo?.amountThreshold)}
                    />
                  </Grid>

                  <Grid xs={12} item>
                    <KInfo title="توضیحات" value={requiredDocumentInfo?.description} />
                  </Grid>
                </Grid>
              </KFieldset>
            )}
          </Grid>

          <Grid item xs={12}>
            {requiredCollaterals && (
              <KFieldset className="mb-4" title="وثایق مورد نیاز">
                {requiredCollaterals.map((collateral: any, index: number) => (
                  <Grid spacing={1} container key={`requiredCollaterals-${index}`}>
                    <Grid xs={6} item>
                      <KInfo
                        title="نوع"
                        value={
                          enumsProvider('CollateralTypeList', collateral.type)?.title
                        }
                      />
                    </Grid>

                    <Grid xs={6} item>
                      <KInfo title="مبلغ" value={collateral.guaranteeAmount} />
                    </Grid>
                  </Grid>
                ))}
              </KFieldset>
            )}
          </Grid>
        </DialogContent>

        <Divider />
        <DialogActions>
          <KButton
            type="submit"
            variant="contained"
            color="success"
            disabled={info?.approved === BooleanPlus.GRANTED}
          >
            ذخیره
          </KButton>

          <KButton type="button" variant="outlined" color="error" onClick={onClose}>
            بستن
          </KButton>
        </DialogActions>
      </form>
    </Dialog>
  )
})
