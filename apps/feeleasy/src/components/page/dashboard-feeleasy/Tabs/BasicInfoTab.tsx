import { KFieldset, KInfo } from '@components/kits'
import { AgentType } from '@models/Agent'
import { Grid, Paper } from '@mui/material'

type PropsType = {
  feeleasyInfo: AgentType
}

export default function BasicInfoTab({ feeleasyInfo }: Readonly<PropsType>) {
  return (
    <Paper sx={{ padding: '20px' }}>
      <KFieldset title="اطلاعات پایه">
        <Grid container>
          <Grid xs={12} md={6} item>
            <KInfo title="نام" value={feeleasyInfo?.name} />
          </Grid>

          <Grid xs={12} md={6} item>
            <KInfo title="آدرس وبسایت" value={feeleasyInfo?.websiteAddress} />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
