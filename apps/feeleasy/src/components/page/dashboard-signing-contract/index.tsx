'use client'
import { KButton, KFieldset, KLoading, KTextField } from '@components/kits'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import useValidations from '@hooks/useValidations'
import { useEffect, useRef, useState } from 'react'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import Contract, { ContractParties, SigninigContractPayload } from '@models/Contracts'
import { useAppStore } from '@store'
import { useRouter, useSearchParams } from 'next/navigation'
import { Typography } from '@mui/material'
import generatePDF, { Margin, Options } from 'react-to-pdf'
import { BooleanPlus } from '@enums/BooleanPlus'
import Swal from 'sweetalert2'

const RESENT_OTP = 90

type Payload = {
  suppressWarnings: boolean
}

export default function SigningContract() {
  const { control, handleSubmit, reset } = useForm<any>()
  const { required, maxLength, minLength } = useValidations()
  const [showOtpInput, setShowOtp] = useState<boolean>(false)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [sendOtpLoading, setSendOtpLoading] = useState<boolean>(false)
  const [sentOtp, setSentOpt] = useState<boolean>(false)
  const [signingContractLoading, setSigningContractLoading] = useState<boolean>(false)
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)
  const [markedUpTerm, setMarkedUpTerm] = useState<string>('')
  const [contractParties, setContractParties] = useState<ContractParties[]>([])
  const [contract, setContract] = useState<Contract | null>(null)
  const user = useAppStore((state) => state.user)
  const params = useSearchParams()
  const leaseUuid = params.get('leaseUuid')
  const contractUuid = params.get('contractUuid')
  const [time, setTime] = useState<number>(RESENT_OTP)
  const contractRef = useRef<HTMLAllCollection>(null)
  const router = useRouter()

  const options: Options = {
    filename: 'contract.pdf',
    method: 'save',

    page: {
      margin: Margin.LARGE,
      format: 'a4'
    },

    canvas: {
      qualityRatio: 1
    },

    overrides: {
      pdf: {
        unit: 'mm'
      }
    }
  }

  const onSubmitForm = (data: any) => {
    setSigningContractLoading(true)
    const principalUuid = user?.uuid
    const signatoryUuid = user?.uuid

    const payload: SigninigContractPayload = {
      principalUuid: principalUuid,
      signatoryUuid: signatoryUuid,
      otp: data?.otp
    }
    apis.contract
      .signing(leaseUuid, payload)
      .then(() => {
        snackbar('success', 'کد تایید ثبت شد')
        setSentOpt(false)
        setShowOtp(false)
        router.push('my-orders')
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setSigningContractLoading(false))
  }

  const sendOtp = () => {
    reset()
    setTime(RESENT_OTP)
    setSendOtpLoading(true)
    setSentOpt(false)
    setShowOtp(false)

    const userUuid = user.uuid

    const payload = {
      intent: 'SIGN_LEASE_CONTRACT',
      reference: contract?.uuid
    }

    apis.contract
      .sendOtp(userUuid, payload)
      .then(() => {
        setSentOpt(true)
        setShowOtp(true)
        snackbar('success', 'کد تایید با موفقیت ارسال شد')
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setSendOtpLoading(false))
  }

  const downloadPdf = async () => {
    setDownloadLoading(true)

    const contractContent = contractRef

    if (contractContent.current) {
      await generatePDF(contractContent, options)
    }

    setDownloadLoading(false)
  }

  const generateContract = (payload?: Payload) => {
    setLoading(true)

    const mainPayload = payload ?? {
      suppressWarnings: false
    }

    apis.contract
      .create(leaseUuid, mainPayload)
      .then(({ data }: { data: Contract }) => {
        setContract(data)
        setContractParties(data?.contractParties)
        setMarkedUpTerm(data?.markedUpTerm)
      })
      .catch((err: any) => {
        if (err.response.data.code === 'CONTRACT_ALREADY_EXIST') {
          handleContractError(err.response.data.message)
        }
      })
      .finally(() => setLoading(false))
  }

  const handleContractError = (errorText: string) => {
    Swal.fire({
      text: `${errorText}. مفاد قرارداد به روزرسانی خواهد شد`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'تایید',
      cancelButtonText: 'انصراف'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          suppressWarnings: true
        }
        generateContract(payload)
      }
      if (result.isDismissed) {
        readContract()
      }
    })
  }

  const readContract = () => {
    setLoading(true)

    apis.contract
      .read(contractUuid)
      .then(({ data }: any) => {
        setContract(data)
        setContractParties(data?.contractParties)
        setMarkedUpTerm(data?.markedUpTerm)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    generateContract()
  }, [])

  useEffect(() => {
    const timer = time > 0 && sentOtp && setInterval(() => setTime((t) => t - 1), 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [time, sendOtp])

  if (loading) return <KLoading />

  return (
    <>
      <Paper component="section" sx={{ paddingX: '16px', paddingY: '16px' }}>
        <KFieldset title="متن قرارداد ">
          <Box
            ref={contractRef}
            dangerouslySetInnerHTML={{ __html: markedUpTerm }}
            sx={{ paddingX: '30px', textAlign: 'justify' }}
            className="contract"
          />

          {contractParties.map(
            (item: ContractParties) =>
              item?.party?.uuid === user.uuid &&
              item.partyCategory === 'INDIVIDUAL' &&
              item.signed === BooleanPlus.REQUESTED && (
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {sentOtp && time > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '14px',
                        color: 'var(--color-gray-600)',
                        margin: '15px 0'
                      }}
                    >
                      {time} ثانیه تا ارسال مجدد کد تایید
                    </Typography>
                  )}

                  <Box component="div" sx={{ display: 'flex', gap: '0 10px' }}>
                    {showOtpInput && (
                      <KTextField
                        control={control}
                        name="otp"
                        placeholder="کد تایید"
                        label="کد تایید"
                        color="info"
                        rules={{
                          required: required(),
                          maxLength: maxLength(4),
                          minLength: minLength(4)
                        }}
                        type="number"
                      />
                    )}

                    {sentOtp && time > 0 ? (
                      <KButton
                        variant="outlined"
                        color="success"
                        size="medium"
                        type="submit"
                        loading={signingContractLoading}
                        sx={{ height: '50px' }}
                      >
                        ثبت امضا
                      </KButton>
                    ) : (
                      <KButton
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => sendOtp()}
                        sx={{ height: '50px', margin: '10px 0' }}
                        loading={sendOtpLoading}
                      >
                        {sentOtp ? 'ارسال مجدد کد تایید' : 'امضای قرارداد'}
                      </KButton>
                    )}
                  </Box>
                </form>
              )
          )}

          <KButton
            variant="contained"
            color="info"
            size="small"
            onClick={downloadPdf}
            sx={{ height: '50px', margin: '10px 0' }}
            loading={downloadLoading}
          >
            دانلود نسخه ی پی دی اف قرارداد
          </KButton>
        </KFieldset>
      </Paper>
    </>
  )
}
