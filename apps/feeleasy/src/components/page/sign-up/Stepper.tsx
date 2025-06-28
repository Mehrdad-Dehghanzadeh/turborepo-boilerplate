'use client'
import apis from '@apis'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import { KStepper } from '@components-kits'
import { useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'
import { SendOtpDto } from '@models/Users'

export default function SignUpSteppr() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [uuid, setUuid] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { snackbar } = useSnackbar()

  const sendOtp = (data: SendOtpDto, msg: string) => {
    data.intent = 'USER_REGISTRATION'
    setLoading(true)
    apis.users
      .sendOtp(data)
      .then(() => {
        snackbar('success', msg)
        setPhoneNumber(data.mobilePhoneNumber)
        setActiveStep(1)
      })
      .catch((err: Error) => {
        snackbar('error', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <KStepper activeStep={activeStep}>
      <Step1 sendOtp={sendOtp} loading={loading} />

      <Step2
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        phoneNumber={phoneNumber}
        setUuid={setUuid}
        sendOtp={sendOtp}
      />
      <Step3 setActiveStep={setActiveStep} uuid={uuid} />
    </KStepper>
  )
}
