import repaymentCheque from '@models/RepaymentCheques'
import { Box, Paper } from '@mui/material'
import ChequeUploadForm from './chequeUploadForm'
import { KButton } from '@components/kits'
import { useAppStore } from '@store'
import { BooleanPlus } from '@enums/BooleanPlus'
import { RepaymentContext } from '@context/RepaymentContext'
import { useContext } from 'react'

type PropsType = {
  repaymentCheques: repaymentCheque[]
  handleApproveCheques: (arg: any) => void
  approveLoading: boolean
  sendForapproveLoading: boolean
  returnForUpdateLoading: boolean
  getRepaymentCheques: () => void
}

export default function Cheques({
  repaymentCheques,
  handleApproveCheques,
  approveLoading,
  sendForapproveLoading,
  returnForUpdateLoading,
  getRepaymentCheques
}: Readonly<PropsType>) {
  const isAdmin = useAppStore((state) => state.isAdmin)
  const { repaymentData } = useContext(RepaymentContext)
  const isLeasing = useAppStore((state) => state.isLeasing)

  const sendForApprove = {
    actionType: 'sendForApprove',
    payload: {
      chequesApproved: BooleanPlus.REQUESTED
    }
  }
  const approve = {
    actionType: 'approve',
    payload: {
      chequesApproved: BooleanPlus.GRANTED
    }
  }

  const returnForUpdate = {
    actionType: 'returnForUpdate',
    payload: {
      chequesApproved: BooleanPlus.RETURNED
    }
  }

  return (
    <Paper
      component="section"
      sx={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px 0'
      }}
    >
      {repaymentCheques.map((cheque: repaymentCheque, index: number) => (
        <ChequeUploadForm
          key={index}
          cheque={cheque}
          getRepaymentCheques={getRepaymentCheques}
          index={index}
        />
      ))}

      {!isAdmin && !isLeasing && (
        <KButton
          variant="contained"
          color="primary"
          sx={{ width: '150px', marginLeft: 'auto' }}
          loading={sendForapproveLoading}
          onClick={() => handleApproveCheques(sendForApprove)}
          disabled={
            repaymentData?.chequesApproved === BooleanPlus.GRANTED ||
            repaymentData?.chequesApproved === BooleanPlus.REQUESTED
          }
        >
          ارسال برای تایید
        </KButton>
      )}

      {(isAdmin || isLeasing) && (
        <Box sx={{ display: 'flex', gap: '0 20px', justifyContent: 'end' }}>
          <KButton
            variant="contained"
            color="error"
            loading={returnForUpdateLoading}
            onClick={() => handleApproveCheques(returnForUpdate)}
            disabled={repaymentData?.chequesApproved !== BooleanPlus.REQUESTED}
          >
            برگشت جهت ویرایش
          </KButton>

          <KButton
            variant="contained"
            color="success"
            loading={approveLoading}
            onClick={() => handleApproveCheques(approve)}
            disabled={repaymentData?.chequesApproved !== BooleanPlus.REQUESTED}
          >
            تایید چک های بازپرداخت
          </KButton>
        </Box>
      )}
    </Paper>
  )
}
