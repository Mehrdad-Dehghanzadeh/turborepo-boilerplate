'use client'
import {
  KButton,
  KTextField,
  KSelect,
  KSelectGrouping,
  KCheckbox,
  KIconButton
} from '@components-kits'
import { useState, useContext, useRef } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import MoreButton from './MoreButton'
import Grid from '@mui/material/Grid'
import { useFieldArray, useForm } from 'react-hook-form'
import { ProtocolContext } from '@context/ProtocolContext'
import { deepClone } from '@utils/object'
import { PartyTypeList } from '@enums/PartyType'
import { FrequencyList } from '@enums/Frequency'
import { PaymentMethodList } from '@enums/PaymentMethod'
import { DurationsList } from '@enums/Duration'
import useFilters from '@hooks/useFilters'
import useSnackbar from '@hooks/useSnackbar'
import { CollateralTypeList } from '@enums/CollateralType'
import { GuaranteeDocumentTypeList } from '@enums/GuaranteeDocumentType'
import { EligibleLeaseTypesList } from '@enums/EligibleLeaseTypes'
import apis from '@apis'
import { useAppStore } from '@store'
import { useRouter } from 'next/navigation'
import DeleteIcon from '@mui/icons-material/Delete'
import './From.scss'
import useValidations from '@hooks/useValidations'
import { RequiredDocumentsList } from '@enums/RequiredDocuments'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { BooleanPlus } from '@enums/BooleanPlus'

export default function () {
  const protocolContext = useContext(ProtocolContext)
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const router = useRouter()
  const { price } = useFilters()
  const user = useAppStore((state) => state.user)
  const contributions = useAppStore((state) => state.contributions)
  const { required } = useValidations()

  const defaultCollateralInfoList = {
    type: '',
    guaranteeFactor: ''
  }

  const [collateralInfoList, setCollateralInfoList] = useState(() =>
    protocolContext.isEdit ? deepClone(protocolContext.editData?.collateralInfo) : []
  )

  const addCollateralInfoList = () => appendCollateralInfo(defaultCollateralInfoList)
  const minusCollateralInfoList = (index: number) => removeCollateralInfo(index)

  const [guaranteeDocumentInfoList, setGuaranteeDocumentInfoList] = useState(() =>
    protocolContext.isEdit
      ? deepClone(protocolContext.editData?.guaranteeDocumentInfo)
      : []
  )

  const addGuaranteeDocumentInfoList = () =>
    appendGuaranteeDocumentInfo(defaultCollateralInfoList)

  const minusGuaranteeDocumentInfoList = (index: number) =>
    removeGuaranteeDocumentInfo(index)

  const [requiredDocumentInfoList, setRequiredDocumentInfoList] = useState(() =>
    protocolContext.isEdit
      ? deepClone(protocolContext.editData?.requiredDocumentInfo)
      : []
  )

  const defaultRequiredDocumentConfig = {
    amountThreshold: '',
    requiredDocuments: [],
    description: ''
  }

  const addRequiredDocumentInfoList = () =>
    appendRequiredDocumentInfoList(defaultRequiredDocumentConfig)

  const minusRequiredDocumentInfoList = (index: number) =>
    removeRequiredDocumentInfoList(index)

  const defaultGuarantorConfig = { amountThreshold: '', requiredGuarantors: '' }

  const [guarantorConfigList, setGuarantorConfigList] = useState(() =>
    protocolContext.isEdit ? deepClone(protocolContext.editData?.guarantorConfigList) : []
  )

  const addGuarantorConfigList = () => appendGuarantorConfigList(defaultGuarantorConfig)
  const minusGuarantorConfigList = (index: number) => removeGuarantorConfigList(index)

  const [totalAllocatedFundPrice, setTotalAllocatedFundPrice] = useState<string | number>(
    price(protocolContext.editData?.totalAllocatedFund || '')
  )

  const [acceptableLeaseAmountMin, setAcceptableLeaseAmountMin] = useState<
    string | number
  >(price(protocolContext?.editData?.acceptableLeaseAmount.minimum || ''))

  const [acceptableLeaseAmountMax, setAcceptableLeaseAmountMax] = useState<
    string | number
  >(price(protocolContext?.editData?.acceptableLeaseAmount.maximum || ''))

  const [disableDelayPenaltyFactor, setDisableDelayPenaltyFactor] = useState<boolean>(
    !!protocolContext.editData?.delayPenaltyFactor.useDefaultFormula || false
  )

  const [prepaymentDiscountFactor, setPrepaymentDiscountFactor] = useState<boolean>(
    !!protocolContext.editData?.prepaymentDiscountFactor.useDefaultFormula || false
  )

  const defaultValues = {
    title: protocolContext.editData?.title ?? '',

    totalAllocatedFund: protocolContext.editData?.totalAllocatedFund ?? '',

    eligibleTenantTypes: protocolContext.editData?.eligibleTenantTypes ?? [],

    eligibleProductCategoryCodes: protocolContext?.isEdit
      ? protocolContext?.editData?.eligibleProductCategories.map((item: any) => item.code)
      : [],

    eligibleLeaseTypes: protocolContext?.isEdit
      ? protocolContext?.editData?.eligibleLeaseTypes || []
      : [],

    acceptableLeaseAmount: {
      maximum: protocolContext?.isEdit
        ? protocolContext?.editData?.acceptableLeaseAmount?.maximum
        : '',
      minimum: protocolContext?.isEdit
        ? protocolContext?.editData?.acceptableLeaseAmount?.minimum
        : ''
    },

    acceptableTerm: protocolContext?.editData?.acceptableTerm
      ? {
          maximum: protocolContext?.isEdit
            ? protocolContext?.editData?.acceptableTerm.maximum
            : '',

          minimum: protocolContext?.isEdit
            ? protocolContext?.editData?.acceptableTerm.minimum
            : ''
        }
      : null,

    delayPenaltyFactor: {
      useDefaultFormula: protocolContext?.isEdit
        ? protocolContext?.editData?.delayPenaltyFactor.useDefaultFormula
        : false,
      customFactor: protocolContext?.isEdit
        ? protocolContext?.editData?.delayPenaltyFactor.customFactor
        : ''
    },

    prepaymentDiscountFactor: {
      useDefaultFormula: protocolContext?.isEdit
        ? protocolContext?.editData?.prepaymentDiscountFactor.useDefaultFormula
        : false,
      customFactor: protocolContext?.isEdit
        ? protocolContext?.editData?.prepaymentDiscountFactor.customFactor
        : ''
    },

    paymentFrequencyOptions: protocolContext.isEdit
      ? [...protocolContext.editData?.paymentFrequencyOptions]
      : [],

    acceptedPaymentMethods: protocolContext.isEdit
      ? [...protocolContext.editData?.acceptedPaymentMethods]
      : [],

    expectedInterest: protocolContext.editData?.expectedInterest ?? '',

    expectedIncome: protocolContext.isEdit
      ? protocolContext.editData?.expectedIncome
      : '',

    timeToPayShop: protocolContext.editData?.timeToPayShop ?? '',

    termsAndConditionsTemplate:
      protocolContext.editData?.termsAndConditionsTemplate ?? '',

    maxExpectedLtv: protocolContext.editData?.maxExpectedLtv ?? '',

    collateralInfoList,
    guaranteeDocumentInfoList,
    guarantorConfigList,
    requiredDocumentInfoList
  }

  const { handleSubmit, control } = useForm({
    defaultValues
  })

  const {
    fields: collateralInfoFields,
    append: appendCollateralInfo,
    remove: removeCollateralInfo
  } = useFieldArray({
    control,
    name: 'collateralInfoList'
  })

  const {
    fields: guaranteeDocumentInfoFields,
    append: appendGuaranteeDocumentInfo,
    remove: removeGuaranteeDocumentInfo
  } = useFieldArray({
    control,
    name: 'guaranteeDocumentInfoList'
  })

  const {
    fields: requiredDocumentInfoFields,
    append: appendRequiredDocumentInfoList,
    remove: removeRequiredDocumentInfoList
  } = useFieldArray({
    control,
    name: 'requiredDocumentInfoList'
  })

  const {
    fields: guarantorConfigFields,
    append: appendGuarantorConfigList,
    remove: removeGuarantorConfigList
  } = useFieldArray({
    control,
    name: 'guarantorConfigList'
  })

  const createPayload = (data: any): any => {
    const payload = deepClone(data)
    payload.userUuid = user.uuid
    payload.ownerId = protocolContext?.isEdit
      ? protocolContext?.editData?.ownerId
      : contributions?.[0]?.partyId
    if (!payload.acceptableTerm.minimum && !payload.acceptableTerm.maximum) {
      payload.acceptableTerm = null
    }
    return payload
  }

  const redirect = () => {
    setTimeout(() => {
      router.push('/dashboard/protocol')
    }, 1500)
  }

  const onsubmit = (data: any) => {
    setLoading(true)
    const payload = createPayload(data)
    const protocolUuid = protocolContext.editData?.uuid
    const apiCall = protocolContext?.isEdit
      ? apis.leasingProtocols?.update(payload, protocolUuid)
      : apis.leasingProtocols?.create(payload)
    const message = protocolContext?.isEdit
      ? 'اطلاعات با موفقیت ویرایش شد'
      : 'اطلاعات با موفقیت ثبت شد'
    apiCall
      .then(() => {
        snackbar('success', message)
        redirect()
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => setLoading(false))
  }

  let collateralInfoKey = useRef<number>(1)
  let guaranteeDocumentKey = useRef<number>(-1)
  let guarantorConfigKey = useRef<number>(-1)
  let documentConfigKey = useRef<number>(-1)

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
      <form id="protocol-form" name="protocol-form" onSubmit={handleSubmit(onsubmit)}>
        <Card>
          <CardContent>
            <h2 className="protocol-form__title">
              {protocolContext?.isEdit ? protocolContext?.editData?.title : 'پروتکل جدید'}
            </h2>
            <Grid spacing={2} container>
              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="عنوان"
                  name="title"
                  control={control}
                  rules={{ required: required() }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="منابع مالی اختصاص داده شده"
                  name="totalAllocatedFund"
                  type="number"
                  inputMode="numeric"
                  control={control}
                  helperText={totalAllocatedFundPrice}
                  onChange={(e) => setTotalAllocatedFundPrice(price(e.target.value))}
                  filterPrice
                  rules={{ required: required() }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KSelect
                  sx={{ marginBottom: '12px' }}
                  label="نوع متقاضی"
                  items={PartyTypeList}
                  name="eligibleTenantTypes"
                  control={control}
                  multiple
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KSelect
                  sx={{ marginBottom: '12px' }}
                  label="نوع قرارداد تسهیلاتی"
                  items={EligibleLeaseTypesList}
                  name="eligibleLeaseTypes"
                  control={control}
                  multiple
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KSelectGrouping
                  items={protocolContext?.categories}
                  childernKey="categories"
                  titleKey="name"
                  childernTitle="name"
                  valueKey="code"
                  label="گروه کالایی"
                  sx={{ marginBottom: '12px' }}
                  control={control}
                  name="eligibleProductCategoryCodes"
                  multiple
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="کمترین مبلغ مورد تایید"
                  name="acceptableLeaseAmount.minimum"
                  type="number"
                  inputMode="numeric"
                  helperText={acceptableLeaseAmountMin}
                  onChange={(e) => setAcceptableLeaseAmountMin(price(e.target.value))}
                  control={control}
                  filterPrice
                  rules={{ required: required() }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="بیشترین مبلغ مورد تایید"
                  name="acceptableLeaseAmount.maximum"
                  type="number"
                  inputMode="numeric"
                  helperText={acceptableLeaseAmountMax}
                  onChange={(e) => setAcceptableLeaseAmountMax(price(e.target.value))}
                  control={control}
                  filterPrice
                  rules={{ required: required() }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="کمینه مدت قرارداد (ماه)"
                  name="acceptableTerm.minimum"
                  type="number"
                  inputMode="numeric"
                  control={control}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="بیشینه مدت قرارداد (ماه)"
                  name="acceptableTerm.maximum"
                  type="number"
                  inputMode="numeric"
                  control={control}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KSelect
                  sx={{ marginBottom: '12px' }}
                  label="تناوب بازپرداخت"
                  items={FrequencyList}
                  name="paymentFrequencyOptions"
                  control={control}
                  multiple
                  rules={{ required: required() }}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KSelect
                  sx={{ marginBottom: '12px' }}
                  label="روش پرداخت اقساط"
                  items={PaymentMethodList}
                  name="acceptedPaymentMethods"
                  control={control}
                  multiple
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="نرخ سود قرارداد تسهیلاتی(درصد)"
                  name="expectedInterest"
                  type="number"
                  inputMode="numeric"
                  control={control}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="نرخ بازده مورد انتظار"
                  name="expectedIncome"
                  type="number"
                  inputMode="numeric"
                  control={control}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KSelect
                  sx={{ marginBottom: '12px' }}
                  label="مهلت تسویه لیزینگ با فروشگاه"
                  items={DurationsList}
                  name="timeToPayShop"
                  control={control}
                />
              </Grid>

              <Grid xs={12} sm={6} md={4} item>
                <KTextField
                  sx={{ marginBottom: '12px' }}
                  label="بیشینه نسبت مبلغ تسهیلات به ارزش مورد معامله (درصد) "
                  name="maxExpectedLtv"
                  type="number"
                  inputMode="numeric"
                  control={control}
                />
              </Grid>
            </Grid>

            <Grid sx={{ marginTop: '12px' }} container>
              <Grid xs={12} sm={6} md={6} item>
                <div className="d-flex">
                  <KTextField
                    className="w-65"
                    sx={{ marginBottom: '12px' }}
                    label="ضریب خسارت تاخیر تادیه(درصد)"
                    name="delayPenaltyFactor.customFactor"
                    type="number"
                    inputMode="numeric"
                    control={control}
                    disabled={disableDelayPenaltyFactor}
                  />

                  <KCheckbox
                    className="mr-3 mt-1"
                    label="مقدار پیش‌فرض"
                    name="delayPenaltyFactor.useDefaultFormula"
                    control={control}
                    onChange={(e) => {
                      setDisableDelayPenaltyFactor(e?.target?.checked)
                    }}
                    defaultChecked={disableDelayPenaltyFactor}
                  />
                </div>
              </Grid>

              <Grid xs={12} sm={6} md={6} item>
                <div className="d-flex">
                  <KTextField
                    className="w-65"
                    sx={{ marginBottom: '12px' }}
                    label="ضریب تخفیف تسویه زودتر از موعد(درصد)"
                    name="prepaymentDiscountFactor.customFactor"
                    type="number"
                    inputMode="numeric"
                    control={control}
                    disabled={prepaymentDiscountFactor}
                  />

                  <KCheckbox
                    className="mr-3 mt-1"
                    label="مقدار پیش‌فرض"
                    name="prepaymentDiscountFactor.useDefaultFormula"
                    control={control}
                    onChange={(e) => {
                      setPrepaymentDiscountFactor(e?.target?.checked)
                    }}
                    defaultChecked={disableDelayPenaltyFactor}
                  />
                </div>
              </Grid>
            </Grid>

            <Grid sx={{ marginTop: '12px' }} container>
              <Grid xs={12} md={6} item>
                <KTextField
                  control={control}
                  name="termsAndConditionsTemplate"
                  label="شرایط پذیرش و قبول متقاضی"
                  minRows={4}
                  multiline
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
        </Card>

        <Card className="mt-10">
          <CardContent>
            <h2 className="protocol-form__title">تعیین مدارک مورد نیاز</h2>
            {requiredDocumentInfoFields?.map((item: unknown, index: number) => {
              documentConfigKey.current++

              return (
                <Grid
                  key={`{required-document-info-${documentConfigKey.current}`}
                  sx={{ marginTop: '12px' }}
                  spacing={2}
                  container
                >
                  <Grid xs={12} sm={6} md={4} item>
                    <KTextField
                      label="آستانه مبلغ"
                      name={`requiredDocumentInfoList[${index}].amountThreshold`}
                      control={control}
                      type="number"
                      inputMode="numeric"
                      filterPrice
                    />
                  </Grid>

                  <Grid xs={12} sm={6} md={4} item>
                    <KSelect
                      sx={{ marginBottom: '12px', minWidth: 'min-content' }}
                      label="مدارک مورد نیاز"
                      items={RequiredDocumentsList}
                      name={`requiredDocumentInfoList[${index}].requiredDocuments`}
                      control={control}
                      multiple
                    />
                  </Grid>

                  <Grid xs={12} sm={8} md={8} item>
                    <KTextField
                      label="توضیحات"
                      name={`requiredDocumentInfoList[${index}].description`}
                      control={control}
                      type="text"
                      multiline
                      minRows={5}
                    />
                  </Grid>

                  <Grid item>
                    <KIconButton
                      color="error"
                      onClick={() => minusRequiredDocumentInfoList(index)}
                    >
                      <DeleteIcon />
                    </KIconButton>
                  </Grid>
                </Grid>
              )
            })}

            <Grid container sx={{ marginTop: '20px' }}>
              <Grid xs={12} md={8} item>
                <MoreButton
                  onClick={addRequiredDocumentInfoList}
                  buttonText="اضافه کردن مدرک"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardContent>
            <h2 className="protocol-form__title">وثایق</h2>
            {collateralInfoFields?.map((item: unknown, index: number) => {
              collateralInfoKey.current++

              return (
                <Grid
                  key={`collateral-info-${collateralInfoKey.current}`}
                  sx={{ marginTop: '12px' }}
                  spacing={2}
                  container
                >
                  <Grid xs={12} sm={6} md={4} item>
                    <KSelect
                      items={CollateralTypeList}
                      sx={{ marginBottom: '12px' }}
                      label="نوع وثیقه"
                      name={`collateralInfoList[${index}].type`}
                      control={control}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} md={4} item>
                    <KTextField
                      label="نسبت (درصد اصل و سود)"
                      name={`collateralInfoList[${index}].guaranteeFactor`}
                      control={control}
                      type="number"
                      inputMode="numeric"
                    />
                  </Grid>
                  <Grid item>
                    <KIconButton
                      color="error"
                      onClick={() => minusCollateralInfoList(index)}
                    >
                      <DeleteIcon />
                    </KIconButton>
                  </Grid>
                </Grid>
              )
            })}

            <Grid container sx={{ marginTop: '20px' }}>
              <Grid xs={12} md={8} item>
                <MoreButton
                  onClick={addCollateralInfoList}
                  buttonText="اضافه کردن وثیقه"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardContent>
            <h2 className="protocol-form__title">مدارک مورد نیاز ضامنین</h2>
            {guaranteeDocumentInfoFields?.map((item: unknown, index: number) => {
              guaranteeDocumentKey.current++

              return (
                <Grid
                  key={`{guarantee-document-info-${guaranteeDocumentKey.current}`}
                  sx={{ marginTop: '12px' }}
                  spacing={2}
                  container
                >
                  <Grid xs={12} sm={6} md={4} item>
                    <KSelect
                      items={GuaranteeDocumentTypeList}
                      sx={{ marginBottom: '12px' }}
                      label="نوع وثیقه"
                      name={`guaranteeDocumentInfoList[${index}].type`}
                      control={control}
                    />
                  </Grid>

                  <Grid xs={12} sm={6} md={4} item>
                    <KTextField
                      label="نسبت (درصد اصل و سود)"
                      name={`guaranteeDocumentInfoList[${index}].guaranteeFactor`}
                      control={control}
                      type="number"
                      inputMode="numeric"
                    />
                  </Grid>

                  <Grid item>
                    <KIconButton
                      color="error"
                      onClick={() => minusGuaranteeDocumentInfoList(index)}
                    >
                      <DeleteIcon />
                    </KIconButton>
                  </Grid>
                </Grid>
              )
            })}

            <Grid container sx={{ marginTop: '20px' }}>
              <Grid xs={12} md={8} item>
                <MoreButton
                  onClick={addGuaranteeDocumentInfoList}
                  buttonText="اضافه کردن مدرک"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardContent>
            <h2 className="protocol-form__title">ضامنین</h2>
            {guarantorConfigFields?.map((item: any, index: any) => {
              guarantorConfigKey.current++
              return (
                <Grid
                  key={`{guarantor-config-${guarantorConfigKey.current}`}
                  sx={{ marginTop: '12px' }}
                  spacing={2}
                  container
                >
                  <Grid xs={12} sm={6} md={4} item>
                    <KTextField
                      label="بیشینه مبلغ"
                      name={`guarantorConfigList[${index}].amountThreshold`}
                      control={control}
                      type="number"
                      inputMode="numeric"
                      onChange={(e) => price(e.target.value)}
                      filterPrice
                    />
                  </Grid>

                  <Grid xs={12} sm={6} md={4} item>
                    <KTextField
                      label="تعداد"
                      name={`guarantorConfigList[${index}].requiredGuarantors`}
                      control={control}
                      type="number"
                      inputMode="numeric"
                    />
                  </Grid>

                  <Grid item>
                    <KIconButton
                      color="error"
                      onClick={() => minusGuarantorConfigList(index)}
                    >
                      <DeleteIcon />
                    </KIconButton>
                  </Grid>
                </Grid>
              )
            })}

            <Grid container sx={{ marginTop: '20px' }}>
              <Grid xs={12} md={8} item>
                <MoreButton
                  onClick={addGuarantorConfigList}
                  buttonText="اضافه کردن ضامن"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className="py-10 text-left">
          <KButton
            type="submit"
            color="success"
            loading={loading}
            variant="contained"
            disabled={
              protocolContext?.isEdit &&
              (protocolContext?.editData?.approved === BooleanPlus.REQUESTED ||
                protocolContext?.editData?.approved === BooleanPlus.GRANTED)
            }
          >
            ذخیره و خروج
          </KButton>
        </div>
      </form>
    </>
  )
}
