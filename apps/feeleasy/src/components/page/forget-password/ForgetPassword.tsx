'use client'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import { KStepper } from '@components-kits'
import { useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'
import { SendOtpDto } from '@models/Users'
import apis from '@apis'
import './forgetPassword.scss'

export default function SignUpSteppr() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const { snackbar } = useSnackbar()
  const [loading, setLoading] = useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = useState<NumberString>('0')
  const [uuid, setUuid] = useState<string>('')

  const sendOtp = (data: SendOtpDto, msg: string) => {
    data.intent = 'VERIFY_MOBILE'
    setLoading(true)

    apis.users
      .sendOtp(data)
      .then(() => {
        snackbar('success', msg)
        setActiveStep(1)
        setPhoneNumber(data.mobilePhoneNumber)
      })
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  return (
    <KStepper activeStep={activeStep}>
      <Step1 sendOtp={sendOtp} loading={loading} />
      <Step2
        sendOtp={sendOtp}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        phoneNumber={phoneNumber}
        setUuid={setUuid}
      />
      <Step3 uuid={uuid} setActiveStep={setActiveStep} />
    </KStepper>
  )
}
