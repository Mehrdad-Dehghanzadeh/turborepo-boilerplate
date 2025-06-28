'use client'
import { KButton, KTextField, KSelect, KFieldset, KInfo } from '@components-kits'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { useState, useContext, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import useFilters from '@hooks/useFilters'
import useSnackbar from '@hooks/useSnackbar'
import type {
  LeaseRequestsDto,
  RequiredCollaterals,
  RequiredDocuments
} from '@models/LeaseRequests'
import { Box } from '@mui/material'
import {
  LeaseRequestContext,
  type LeaseRequestContextType
} from '@context/LeaseRequestContext'
import { useAppStore } from '@store'
import Grid from '@mui/material/Grid'
import apis from '@apis'
import { deepClone } from '@utils/object'
import { enumsProvider } from '@utils/enums'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import { BooleanPlus } from '@enums/BooleanPlus'

type RowItem = LeaseRequestsDto & {
  uuid: string
  approved: BooleanPlus
}

export default forwardRef<{}, any>(function (props, _ref) {
  const { price } = useFilters()
  const { snackbar } = useSnackbar()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedProtocol, setSelectedProtocol] = useState<any>(null)
  const [amountHelper, setAmountHelper] = useState<string>(price(''))
  const { required } = useValidations()
  const [loading, setLoading] = useState<boolean>(false)
  const context = useContext<LeaseRequestContextType>(LeaseRequestContext)
  const user = useAppStore((state) => state.user)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editValue, setEditValue] = useState<RowItem | null>(null)
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const [termValue, setTermValue] = useState<number>(
    selectedProtocol?.acceptableTerm?.minimum || 0
  )
  const [repaymentPlan, setRepaymentPlan] = useState<any>(null)
  const [sliderStep, setSliderStep] = useState<number>(1)

  const [requiredDocumentInfo, setRequiredDocumentInfo] =
    useState<RequiredDocuments | null>(null)

  const [requiredCollaterals, setRequiredCollaterals] = useState<
    RequiredCollaterals[] | null
  >(null)

  const { handleSubmit, control, reset, getValues, setValue, watch } =
    useForm<LeaseRequestsDto>({
      defaultValues: {
        amount: '',
        paymentFrequency: '',
        leasingProtocolUuid: '',
        userUuid: user?.uuid,
        selectedCategoryCode: ''
      }
    })

  const paymentFrequency = watch('paymentFrequency')

  const getRepaymentPlan = () => {
    const term = termValue
    const paymentFrequency = getValues('paymentFrequency')
    const amount = getValues('amount')
    const protocolUUID = selectedProtocol?.uuid

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
    const protocolUUID = selectedProtocol?.uuid
    const amount = repaymentPlan?.totalRepaymentAmount

    apis.leasingProtocols
      .getRequiredDocuments(protocolUUID, { amount })
      .then(({ data }: any) => {
        setRequiredDocumentInfo(data.requiredDocuments)
        setRequiredCollaterals(data.requiredCollaterals)
      })
      .catch((err: Error) => snackbar('error', err))
  }

  const closeDialog = () => {
    setOpen(false)
    setAmountHelper(price(''))
    setIsEdit(false)
    setEditValue(null)
    setSelectedProtocol(null)
    setIsDisable(false)
    setTermValue(0)
    setRepaymentPlan(null)
    setRequiredDocumentInfo(null)
    setRequiredCollaterals(null)
    setSliderStep(1)
    reset()
  }

  const createPayload = (data: LeaseRequestsDto) => {
    const val = deepClone(data)
    val.amount = Number(val.amount)
    val.interest = selectedProtocol.expectedInterest
    val.term = termValue
    return val
  }

  const createRequest = (data: LeaseRequestsDto): void => {
    const payload = createPayload(data)
    apis.leaseRequests
      .create(payload)
      .then(() => {
        snackbar('success', 'درخواست شما با موفقیت ثبت شد')
        context.resetTable?.()
        closeDialog()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const updateRequest = (data: LeaseRequestsDto, editValue: RowItem | null) => {
    const payload = createPayload(data)

    apis.leaseRequests
      .update(payload, editValue?.uuid)
      .then(() => {
        snackbar('success', 'درخواست شما با موفقیت ویرایش شد')
        context.resetTable?.()
        closeDialog()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onsubmit = (data: LeaseRequestsDto) => {
    setLoading(true)
    if (isEdit) {
      updateRequest(data, editValue)
    } else {
      createRequest(data)
    }
  }

  const editValueMapper = (rowItem: RowItem) => {
    setEditValue(deepClone(rowItem))
    control._formValues.amount = rowItem?.amount
    control._formValues.interest = rowItem?.interest
    control._formValues.paymentFrequency = rowItem?.paymentFrequency
    control._formValues.userUuid = rowItem?.userUuid
    control._formValues.leasingProtocolUuid = rowItem?.leasingProtocolUuid
    control._formValues.selectedCategoryCode = rowItem.selectedCategoryCode
    setSelectedProtocol(() =>
      context.protocols.find((el) => el.uuid === rowItem?.leasingProtocolUuid)
    )
    setTermValue(rowItem?.term as number)
  }

  const openToEdit = (rowItem: RowItem) => {
    rowItem?.approved === BooleanPlus.GRANTED && setIsDisable(true)
    setOpen(true)
    editValueMapper(rowItem)
    setIsEdit(true)
    const termValue = enumsProvider('FrequencyList', rowItem.paymentFrequency)?.key
    setSliderStep(termValue as number)
  }

  const validateTermValue = (value: number, paymentFrequency: number) => {
    if (value % paymentFrequency !== 0) {
      return Math.ceil(value / paymentFrequency) * paymentFrequency
    }
    return value
  }

  const handleChange = (_: Event, newValue: number | number[]) => {
    setTermValue(validateTermValue(newValue as number, sliderStep))
  }

  const getSelectedItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    const selectedKey = enumsProvider('FrequencyList', selectedValue)?.key
    setSliderStep(selectedKey as number)
    setTermValue(validateTermValue(termValue, selectedKey as number))
  }

  useImperativeHandle(_ref, () => ({
    openToEdit
  }))

  const marks = [
    {
      value: selectedProtocol?.acceptableTerm?.minimum,
      label: `${selectedProtocol?.acceptableTerm?.minimum} ماه`
    },
    {
      value: selectedProtocol?.acceptableTerm?.maximum,
      label: `${selectedProtocol?.acceptableTerm?.maximum} ماه`
    }
  ]

  useEffect(() => {
    if (isEdit && editValue?.term) setTermValue(editValue?.term as number)

    if (!isEdit && selectedProtocol?.acceptableTerm?.minimum)
      setTermValue(selectedProtocol?.acceptableTerm?.minimum)
  }, [selectedProtocol])

  useEffect(() => {
    getRepaymentPlan()
  }, [open, termValue, paymentFrequency])

  useEffect(() => {
    if (repaymentPlan?.totalRepaymentAmount) {
      getRequiredDocumentsInfo()
    }
  }, [open, repaymentPlan])

  return (
    <div className="d-flex justify-content-end mb-2 ml-2">
      <KButton
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<AddCircleOutlineOutlinedIcon />}
      >
        درخواست جدید
      </KButton>

      <Dialog open={open}>
        <form
          className="pt-4"
          id="lease-request-form"
          name="lease-request-form"
          onSubmit={handleSubmit(onsubmit)}
        >
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <KSelect
                  className="mb-4"
                  sx={{ marginBottom: '16px' }}
                  items={context.protocols}
                  valueKey="uuid"
                  titleKey2="leasingCompanyName"
                  label="طرح انتخابی"
                  name="leasingProtocolUuid"
                  onChange={(e) => {
                    setSelectedProtocol(() =>
                      context.protocols.find((el) => el.uuid === e?.target?.value)
                    )
                  }}
                  control={control}
                  rules={{ required: required() }}
                  disabled={isDisable}
                />
                {selectedProtocol && (
                  <KFieldset className="mb-4" title="مشخصات طرح">
                    <Grid spacing={1} container>
                      <Grid xs={6} item>
                        <KInfo title="نام شرکت" value={selectedProtocol?.ownerName} />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo
                          title="کمترین مبلغ مورد تایید"
                          value={price(selectedProtocol?.acceptableLeaseAmount?.minimum)}
                        />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo
                          title="بیشترین مبلغ مورد تایید"
                          value={price(selectedProtocol?.acceptableLeaseAmount?.maximum)}
                        />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo
                          title="سود تسهیلات"
                          value={price(selectedProtocol?.expectedInterest, 'درصد')}
                        />
                      </Grid>

                      <Grid xs={6} item>
                        <KInfo
                          title="گروه کالا یا خدمات"
                          value={selectedProtocol?.eligibleProductCategories.map(
                            (item: any, index: number) => (
                              <p key={`eligibleProductCategories-${index}-${item}`}>
                                {item.name}
                              </p>
                            )
                          )}
                        />
                      </Grid>
                    </Grid>
                  </KFieldset>
                )}
              </Grid>

              <Grid item xs={12}>
                <KTextField
                  className="mb-4"
                  label="مبلغ درخواستی"
                  name="amount"
                  control={control}
                  rules={{ required: required() }}
                  type="number"
                  onChange={(e) => {
                    setAmountHelper(price(e.target.value))
                  }}
                  onBlur={() => {
                    getRepaymentPlan()
                  }}
                  filterPrice
                  helperText={amountHelper}
                  disabled={isDisable}
                />
              </Grid>

              <Grid item xs={12}>
                <KSelect
                  className="mb-4"
                  label="تناوب بازپرداخت"
                  name="paymentFrequency"
                  type="number"
                  control={control}
                  items={selectedProtocol?.paymentFrequencyOptions.map((item: any) => {
                    return {
                      title: enumsProvider('FrequencyList', item)?.title,
                      value: item
                    }
                  })}
                  rules={{ required: required() }}
                  disabled={isDisable || !selectedProtocol}
                  onChange={(e) => {
                    setValue('paymentFrequency', e.target.value)
                    getSelectedItem(e)
                  }}
                />
              </Grid>

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
                    min={selectedProtocol?.acceptableTerm?.minimum}
                    max={selectedProtocol?.acceptableTerm?.maximum}
                    onChange={handleChange}
                    disabled={!selectedProtocol || isDisable}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <KSelect
                  items={selectedProtocol?.eligibleProductCategories}
                  titleKey="name"
                  valueKey="code"
                  label="گروه کالایی"
                  sx={{ marginBottom: '12px' }}
                  name="selectedCategoryCode"
                  control={control}
                  rules={{ required: required() }}
                  disabled={!selectedProtocol || isDisable}
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
                        <KInfo
                          title="پیش پرداخت"
                          value={price(repaymentPlan?.commission)}
                        />
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
                        <KInfo
                          title="توضیحات"
                          value={requiredDocumentInfo?.description}
                        />
                      </Grid>
                    </Grid>
                  </KFieldset>
                )}
              </Grid>

              <Grid item xs={12}>
                {requiredCollaterals && (
                  <KFieldset className="mb-4" title="وثایق مورد نیاز">
                    {requiredCollaterals.map((collateral: any, index: number) => (
                      <Grid spacing={1} container key={`collateral-${index}`}>
                        <Grid xs={6} item>
                          <KInfo
                            title="نوع"
                            value={
                              enumsProvider('CollateralTypeList', collateral.type)?.title
                            }
                          />
                        </Grid>

                        <Grid xs={6} item>
                          <KInfo title="مبلغ" value={price(collateral.guaranteeAmount)} />
                        </Grid>
                      </Grid>
                    ))}
                  </KFieldset>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />

          <DialogActions>
            <KButton
              type="button"
              variant="outlined"
              color="error"
              disabled={loading}
              onClick={closeDialog}
            >
              بستن
            </KButton>

            <KButton
              type="submit"
              variant="contained"
              color="success"
              loading={loading}
              disabled={
                !!editValue &&
                (editValue?.approved === BooleanPlus.REQUESTED ||
                  editValue?.approved === BooleanPlus.GRANTED)
              }
            >
              ذخیره
            </KButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
})
