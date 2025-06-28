'use client'
import { KButton, KLoading } from '@components/kits'
import { useRouter, useSearchParams } from 'next/navigation'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import useSnackbar from '@hooks/useSnackbar'
import { useEffect, useState } from 'react'
import apis from '@apis'
import { Box, Paper } from '@mui/material'
import Guarantee, {
  ApproveInquiryDto,
  Cheque,
  CollateralsOrDocuments,
  SendForApproveDto
} from '@models/Guarantee'
import { BooleanPlus } from '@enums/BooleanPlus'
import GuaranteeInfo from './guaranteeInfo'
import InquiryResult from './inquiryResult'
import ChequeRegisterForm from './chequeRegisterForm'
import ChequeInfo from './chequeInfo'
import ChequeUploadForm from './chequeUploadForm'
import { FormData, GuaranteeChequeInquiryDto } from '@models/Inquiry'

export default function AddGuaranteeCheque() {
  const router = useRouter()
  const redirect = () => router.back()
  const params = useSearchParams()
  const leaseUuid = params.get('leaseUuid')
  const { snackbar } = useSnackbar()
  const [inquiryApproveLoading, setInquiryApproveLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [guaranteeInfo, setGuaranteeInfo] = useState<Guarantee | null>(null)
  const [inquiryResult, setInquiryResult] = useState<any>(null)
  const [chequeUuid, setChequeUuid] = useState<string>('')
  const [chequeRefrenceUuid, setChequeRefrenceUuid] = useState<string>('')
  const [guaranteeUuid, setGuaranteeUuid] = useState<string>('')
  const [chequeInfo, setChequeInfo] = useState<Cheque | null>(null)
  const [sendForApproveLoading, setSendForApproveLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [newInquiry, setNewInquiry] = useState<boolean>(false)
  const inquiryUuid = inquiryResult?.uuid

  const createPayload = (data: FormData) => {
    const payload: GuaranteeChequeInquiryDto = {
      ...data,
      type: 'GUARANTEE_CHEQUE',
      subjectUuid: guaranteeInfo?.uuid ?? ''
    }

    return payload
  }

  const getGuarantee = () => {
    setLoading(true)
    apis.guarantee
      .read(leaseUuid)
      .then(({ data }: { data: Guarantee }) => {
        setGuaranteeInfo(data)
        if (data) {
          const chequeUuid =
            data?.applicantCollaterals?.find(
              (item: CollateralsOrDocuments) => item.type === 'CHEQUE'
            )?.id ?? ''

          const chequeRefrenceUuid =
            data?.applicantCollaterals?.find(
              (item: CollateralsOrDocuments) => item.type === 'CHEQUE'
            )?.referenceUuid ?? ''

          const guaranteeUuid = data?.uuid ?? ''

          setChequeUuid(chequeUuid)
          setChequeRefrenceUuid(chequeRefrenceUuid)
          setGuaranteeUuid(guaranteeUuid)
        }
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const getGuaranteeCheque = () => {
    setLoading(true)

    apis.repaymentCheques
      .get(chequeRefrenceUuid)
      .then(({ data }: { data: Cheque }) => {
        setChequeInfo(data)
      })
      .catch((err: Error) => snackbar('err', err))
      .finally(() => setLoading(false))
  }

  const getInquiry = () => {
    setLoading(true)

    const params = {
      subjectUuid: guaranteeUuid,
      secondaryId: chequeUuid
    }

    apis.inquiry
      .getInquiry(params)
      .then(({ data }: { data: any }) => {
        setInquiryResult(data?.[0])
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const onSubmitInquiry = (data: FormData) => {
    setBtnLoading(true)
    const payload = createPayload(data)

    if (isEdit) {
      handleEditInquiry(payload)
    } else {
      handlePostInquiry(payload)
    }
  }

  const handlePostInquiry = (payload: GuaranteeChequeInquiryDto) => {
    apis.inquiry
      .postInquiry(payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        getInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setBtnLoading(false)
        setNewInquiry(false)
      })
  }

  const handleEditInquiry = (payload: GuaranteeChequeInquiryDto) => {
    apis.inquiry
      .editInquiry(inquiryUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت ویرایش شد')
        getInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setBtnLoading(false)
        setIsEdit(false)
      })
  }

  const approveChequeInquiry = () => {
    setInquiryApproveLoading(true)
    const payload: ApproveInquiryDto = { inquiryUuid }
    const collateralUuid = chequeUuid

    apis.guarantee
      .approveChequeInquiry(guaranteeUuid, collateralUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت تایید شد')
        getGuarantee()
        getInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setInquiryApproveLoading(false))
  }

  const sendForApprove = () => {
    setSendForApproveLoading(true)

    const payload: SendForApproveDto = {
      approved: BooleanPlus.REQUESTED
    }

    apis.guarantee
      .modifyState(guaranteeUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        getGuarantee()
      })
      .catch((err: Error) => snackbar('erorr', err))
      .finally(() => setSendForApproveLoading(false))
  }

  const hasGuaranteeCheque = chequeInfo

  const shouldShowInquiryResult = inquiryResult

  const shouldShowForm =
    !inquiryResult ||
    inquiryResult?.done?.status === BooleanPlus.CANCELED ||
    inquiryResult?.done?.status === BooleanPlus.REJECTED ||
    newInquiry ||
    isEdit

  useEffect(() => {
    getGuarantee()
  }, [leaseUuid])

  useEffect(() => {
    if (guaranteeUuid && chequeUuid) getInquiry()
  }, [guaranteeUuid, chequeUuid])

  useEffect(() => {
    if (chequeRefrenceUuid) getGuaranteeCheque()
  }, [chequeRefrenceUuid])

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

      <GuaranteeInfo guaranteeInfo={guaranteeInfo} />

      {shouldShowInquiryResult && (
        <InquiryResult
          inquiryApproveLoading={inquiryApproveLoading}
          approveChequeInquiry={approveChequeInquiry}
          inquiryResult={inquiryResult}
          setIsEdit={setIsEdit}
          setNewInquiry={setNewInquiry}
          getInquiry={getInquiry}
        />
      )}

      {shouldShowForm &&
        guaranteeInfo?.applicantCollaterals.map(
          (collateral: CollateralsOrDocuments, index: number) =>
            collateral.type === 'CHEQUE' && (
              <Box sx={{ margin: '20px 0' }} key={index}>
                <Paper
                  component="section"
                  sx={{ padding: '16px' }}
                  key={`collateral-${index}-key`}
                >
                  <ChequeRegisterForm
                    btnLoading={btnLoading}
                    collateral={collateral}
                    onSubmitInquiry={onSubmitInquiry}
                  />
                </Paper>
              </Box>
            )
        )}

      {hasGuaranteeCheque && (
        <>
          <ChequeInfo chequeInfo={chequeInfo} />

          {(guaranteeInfo?.approved === BooleanPlus.NA ||
            guaranteeInfo?.approved === BooleanPlus.RETURNED) && (
            <ChequeUploadForm
              chequeUuid={chequeInfo?.uuid}
              getGuaranteeCheque={getGuaranteeCheque}
            />
          )}

          <Box sx={{ paddingBottom: '20px' }}>
            <KButton
              variant="contained"
              color="primary"
              onClick={sendForApprove}
              loading={sendForApproveLoading}
              sx={{ display: 'block', marginLeft: 'auto' }}
              disabled={
                guaranteeInfo?.approved === BooleanPlus.REQUESTED ||
                guaranteeInfo?.approved === BooleanPlus.GRANTED
              }
            >
              ارسال برای تایید
            </KButton>
          </Box>
        </>
      )}
    </>
  )
}
