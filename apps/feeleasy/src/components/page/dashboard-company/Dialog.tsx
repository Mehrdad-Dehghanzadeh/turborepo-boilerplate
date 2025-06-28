'use client'
import { KButton } from '@components-kits'
import { useState, useContext } from 'react'
import DomainAddIcon from '@mui/icons-material/DomainAdd'
import Dialog from '@mui/material/Dialog'
import { KStepper } from '@/components/kits'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import { CompanyContext } from '@context/CompanyContext'
import { useAppStore } from '@store'

export default function () {
  const isAdmin = useAppStore((state) => state.isAdmin)
  const [step, setStep] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const companyContext = useContext(CompanyContext)

  const onClose = () => {
    setOpen(false)
    setStep(0)
    companyContext.setSelectedCompany?.(null)
  }

  return (
    <div className="d-flex justify-content-end mb-10">
      {!isAdmin && (
        <KButton
          variant="outlined"
          onClick={() => setOpen(true)}
          startIcon={<DomainAddIcon />}
        >
          تعریف شرکت لیزینگ
        </KButton>
      )}

      <Dialog open={open}>
        <KStepper activeStep={step}>
          <Step1 setStep={setStep} onClose={onClose} />
          <Step2 setStep={setStep} onClose={onClose} />
          <Step3 setStep={setStep} onClose={onClose} />
          <Step4 setStep={setStep} onClose={onClose} />
          <Step5 setStep={setStep} onClose={onClose} />
          <Step6 onClose={onClose} />
        </KStepper>
      </Dialog>
    </div>
  )
}
