import { KFieldset, KInfo } from '@components/kits'
import { Grid, Paper } from '@mui/material'

type PropsType = {
  inquiryResult: any
}

export default function InquiryResult({ inquiryResult }: Readonly<PropsType>) {
  return (
    <Paper component="section" sx={{ padding: '16px' }}>
      <KFieldset title="استعلام">
        <Grid container>
          <Grid item xs={12} md={6}>
            <KInfo
              title="شناسه چک"
              value={inquiryResult?.result?.chequeInfo?.identifier}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="سریال چک" value={inquiryResult?.result?.chequeInfo?.serial} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="دارنده چک" value={inquiryResult?.result?.chequeInfo?.owner} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="مبلغ" value={inquiryResult?.result?.chequeInfo?.amount} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="کدشعبه" value={inquiryResult?.result?.chequeInfo?.branchCode} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="کد رهگیری" value={inquiryResult?.trackingCode} />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
