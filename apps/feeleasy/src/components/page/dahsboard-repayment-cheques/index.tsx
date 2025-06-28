'use client'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Repayments from '@models/Repayments'
import repaymentCheque, {
  ApproveChequesDto,
  ApproveChequesInquiry
} from '@models/RepaymentCheques'
import { Box, Paper } from '@mui/material'
import { KButton, KLoading } from '@components/kits'
import { ChequeParameters, ChequeInquiryDto } from '@models/Inquiry'
import InquiryResult from './inquiryResult'
import Repayment from './repayment'
import ChequeRegisterForm from './chequeRegisterForm'
import { RepaymentContext } from '@context/RepaymentContext'
import Swal from 'sweetalert2'
import { BooleanPlus } from '@enums/BooleanPlus'
import Cheques from './cheques'

export default function AddRepaymentCheques() {
  const [loading, setLoading] = useState<boolean>(false)
  const [inquiryResult, setInquiryResult] = useState<any>(null)
  const params = useSearchParams()
  const leaseUuid = params.get('leaseUuid')
  const { snackbar } = useSnackbar()
  const router = useRouter()
  const redirect = () => router.back()
  const [repaymentData, setRepaymentData] = useState<Repayments | null>(null)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const [repaymentCheques, setRepaymentCheques] = useState<repaymentCheque[] | null>(null)
  const contextValue = useMemo(() => ({ repaymentData }), [repaymentData])

  const [approveLoading, setApproveLoading] = useState<boolean>(false)
  const [sendForApproveLoading, setSendForApproveLoading] = useState<boolean>(false)
  const [returnForUpdateLoading, setReturnForUpdateLoading] = useState<boolean>(false)
  const [inquiryCanceleLoading, setInquiryCanceleLoading] = useState<boolean>(false)
  const [inquiryApproveLoading, setInquiryApproveLoading] = useState<boolean>(false)
  const [inquiryWithdrewLoading, setInquiryWithrewLoading] = useState<boolean>(false)

  const getRepayments = () => {
    setLoading(true)
    apis.repayment
      .read(leaseUuid)
      .then(({ data }: { data: Repayments }) => {
        setRepaymentData(data)
      })
      .catch((err: Error) => snackbar('error', err))
  }

  const getChequeInquiry = () => {
    setLoading(true)
    const repaymentUuid = repaymentData?.uuid

    apis.inquiry
      .getInquiryBatchResult({ subjectUuid: repaymentUuid })
      .then(({ data }: any) => {
        setInquiryResult(data.REPAYMENT_CHEQUE)
      })
      .catch((err: Error) => {
        snackbar('error ', err)
      })
      .finally(() => setLoading(false))
  }

  const getRepaymentCheques = () => {
    setLoading(true)
    const repaymentUuid = repaymentData?.uuid

    apis.repayment
      .readCheques(repaymentUuid)
      .then(({ data }: { data: repaymentCheque[] }) => {
        setRepaymentCheques(data)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  const createPayload = (chequeParameters: ChequeParameters[]) => {
    const payload: ChequeInquiryDto = {
      type: 'REPAYMENT_CHEQUE',
      subjectUuid: repaymentData?.uuid,
      chequeParameters
    }

    return payload
  }

  const handlePostChequeInquiry = (data: any) => {
    setBtnLoading(true)
    const { chequeParameters } = data
    const payload: ChequeInquiryDto = createPayload(chequeParameters)

    apis.inquiry
      .postInquiryBatch(payload)
      .then(() => {
        snackbar('success', 'شناسه چک ها با موفقیت ثبت شد')
        getChequeInquiry()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleApproveChequeInquiry = () => {
    setInquiryApproveLoading(true)
    const repaymentUuid = repaymentData?.uuid
    const inquiryBatchUuid = inquiryResult?.uuid

    const payload: ApproveChequesInquiry = {
      inquiryBatchUuid,
      type: 'LEASE_REPAYMENT'
    }

    apis.repayment
      .approveChequesInquiry(repaymentUuid, payload)
      .then(() => {
        snackbar('success', 'استعلام با موفقیت تایید شد')
        getRepaymentCheques()
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setInquiryApproveLoading(false))
  }

  const handleCanceleChequeInquiry = () => {
    setInquiryCanceleLoading(true)
    const inquiryUuid = inquiryResult.uuid

    const payload = {
      done: BooleanPlus.CANCELED,
      type: 'REPAYMENT_CHEQUE'
    }

    apis.inquiry
      .modifyInquiryBatchResult(inquiryUuid, payload)
      .then(() => {
        snackbar('success ', 'استعلام با موفقیت لغو شد')
        getChequeInquiry()
      })
      .catch((err: Error) => snackbar('error ', err))
      .finally(() => setInquiryCanceleLoading(false))
  }

  const handleWithdrewChequeInquiry = () => {
    setInquiryWithrewLoading(true)
    const inquiryUuid = inquiryResult.uuid

    const payload = {
      done: BooleanPlus.WITHDREW,
      type: 'REPAYMENT_CHEQUE'
    }

    apis.inquiry
      .modifyInquiryBatchResult(inquiryUuid, payload)
      .then(() => {
        snackbar('success ', 'نتیجه استعلام با موفقیت رد شد')
        getChequeInquiry()
      })
      .catch((err: Error) => snackbar('error ', err))
      .finally(() => setInquiryWithrewLoading(false))
  }

  const handleApproveCheques = ({
    actionType,
    payload
  }: {
    actionType: string
    payload: ApproveChequesDto | null
  }) => {
    const repaymentUuid = repaymentData?.uuid

    if (actionType === 'sendForApprove') setSendForApproveLoading(true)
    if (actionType === 'returnForUpdate') setReturnForUpdateLoading(true)
    if (actionType === 'approve') setApproveLoading(true)

    apis.repayment
      .approve(repaymentUuid, payload)
      .then(() => {
        snackbar('success', 'با موفقیت انجام شد')
        getRepayments()
      })
      .catch((err: any) => {
        if (err?.response?.data?.code === 'NO_CHEQUES_UPLOADED') {
          handleStatusError(err?.response?.data?.message, actionType)
        } else {
          snackbar('error', err)
        }
      })
      .finally(() => {
        setSendForApproveLoading(false)
        setReturnForUpdateLoading(false)
        setApproveLoading(false)
      })
  }

  const handleStatusError = (err: any, actionType: string) => {
    let payload: ApproveChequesDto | null = null

    if (actionType === 'sendForApprove') {
      payload = {
        chequesApproved: BooleanPlus.REQUESTED,
        suppressWarnings: true
      }
    }

    if (actionType === 'approve') {
      payload = {
        chequesApproved: BooleanPlus.GRANTED,
        suppressWarnings: true
      }
    }

    const mainPayload = { actionType, payload }

    Swal.fire({
      text: `${err}.آیا مطمئن هستید؟`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'بله',
      cancelButtonText: 'خیر'
    }).then((result) => {
      if (result.isConfirmed) {
        handleApproveCheques(mainPayload)
      }
    })
  }

  useEffect(() => {
    getRepayments()
  }, [leaseUuid])

  useEffect(() => {
    if (repaymentData) {
      getChequeInquiry()
      getRepaymentCheques()
    }
  }, [repaymentData])

  const hasRepaymentCheques = repaymentCheques && repaymentCheques.length > 0

  const shouldShowInquiryResult =
    inquiryResult &&
    (inquiryResult?.done === BooleanPlus.GRANTED ||
      inquiryResult?.done === BooleanPlus.REQUESTED ||
      inquiryResult?.done === BooleanPlus.RETURNED ||
      inquiryResult?.done === BooleanPlus.REJECTED)

  const shouldShowForm =
    !inquiryResult ||
    inquiryResult?.done === BooleanPlus.CANCELED ||
    inquiryResult?.done === BooleanPlus.WITHDREW ||
    inquiryResult?.done === BooleanPlus.REJECTED

  if (loading || !repaymentData) return <KLoading />

  return (
    <Box>
      <KButton
        startIcon={<ArrowForwardIcon />}
        color="info"
        size="large"
        sx={{ marginBottom: '16px' }}
        onClick={redirect}
      >
        بازگشت
      </KButton>

      <RepaymentContext.Provider value={contextValue}>
        <Paper component="section" sx={{ padding: '16px', margin: '20px 0' }}>
          <Repayment />
        </Paper>

        <Box>
          {hasRepaymentCheques && (
            <Cheques
              repaymentCheques={repaymentCheques}
              handleApproveCheques={handleApproveCheques}
              approveLoading={approveLoading}
              sendForapproveLoading={sendForApproveLoading}
              returnForUpdateLoading={returnForUpdateLoading}
              getRepaymentCheques={getRepaymentCheques}
            />
          )}

          {shouldShowInquiryResult && (
            <InquiryResult
              handleApproveChequeInquiry={handleApproveChequeInquiry}
              handleCanceleChequeInquiry={handleCanceleChequeInquiry}
              handleWithdrewChequeInquiry={handleWithdrewChequeInquiry}
              inquiryApproveLoading={inquiryApproveLoading}
              inquiryCanceleLoading={inquiryCanceleLoading}
              inquiryWithdrewLoading={inquiryWithdrewLoading}
              inquiryResult={inquiryResult}
              getChequeInquiry={getChequeInquiry}
            />
          )}

          {shouldShowForm && (
            <ChequeRegisterForm
              btnLoading={btnLoading}
              handlePostChequeInquiry={handlePostChequeInquiry}
              inquiryResult={inquiryResult}
            />
          )}
        </Box>
      </RepaymentContext.Provider>
    </Box>
  )
}
