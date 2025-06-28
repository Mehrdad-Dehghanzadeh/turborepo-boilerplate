import { AgentType } from '@models/Agent'
import { KFieldset, KInfo } from '@components/kits'
import { Grid, Paper } from '@mui/material'

type PropsType = {
  feeleasyInfo: AgentType
}

export default function PostalInfoTab({ feeleasyInfo }: Readonly<PropsType>) {
  return (
    <Paper sx={{ padding: '20px' }}>
      <KFieldset title="اطلاعات پستی">
        <Grid container>
          <Grid xs={12} md={6} item>
            <KInfo title="کدپستی" value={feeleasyInfo?.postalAddress?.postalCode} />
          </Grid>

          <Grid xs={12} md={6} item>
            <KInfo title="شهر" value={feeleasyInfo?.postalAddress?.city} />
          </Grid>

          <Grid xs={12} md={6} item>
            <KInfo title="منطقه" value={feeleasyInfo?.postalAddress?.state} />
          </Grid>

          <Grid xs={12} item>
            <KInfo title="آدرس" value={feeleasyInfo?.postalAddress?.address} />
          </Grid>

          <Grid xs={12} item>
            <KInfo title="توضیحات" value={feeleasyInfo?.postalAddress?.comment} />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
