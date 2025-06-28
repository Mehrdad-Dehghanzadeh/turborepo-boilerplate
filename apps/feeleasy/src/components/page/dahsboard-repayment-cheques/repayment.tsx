import { KFieldset, KInfo } from '@components/kits'
import useFilters from '@hooks/useFilters'
import { enumsProvider } from '@utils/enums'
import Repayments from '@models/Repayments'
import { Grid } from '@mui/material'
import { useContext } from 'react'
import { RepaymentContext } from '@context/RepaymentContext'

type PropsType = {
  repaymentData: Repayments
}

export default function Repayment() {
  const { price } = useFilters()
  const { repaymentData } = useContext(RepaymentContext)

  return (
    <KFieldset title="اطلاعات بازپرداخت">
      <Grid container>
        <Grid xs={12} md={6} item>
          <KInfo
            title="مبلغ کل بازپرداخت"
            value={price(repaymentData?.totalRepaymentAmount)}
          />
        </Grid>

        <Grid xs={12} md={6} item>
          <KInfo
            title="مبلغ پرداخت شده"
            value={price(
              repaymentData?.totalRepaymentAmount - repaymentData?.totalRemainingAmount
            )}
          />
        </Grid>

        <Grid xs={12} md={6} item>
          <KInfo
            title="مبلغ باقی مانده"
            value={price(repaymentData?.totalRemainingAmount)}
          />
        </Grid>

        <Grid xs={12} md={6} item>
          <KInfo title="مدت بازپرداخت" value={repaymentData?.repaymentSchedule.term} />
        </Grid>

        <Grid xs={12} md={6} item>
          <KInfo
            title="دوره بازپرداخت"
            value={
              enumsProvider(
                'FrequencyList',
                repaymentData?.repaymentSchedule?.paymentFrequency
              )?.title
            }
          />
        </Grid>
      </Grid>
    </KFieldset>
  )
}
