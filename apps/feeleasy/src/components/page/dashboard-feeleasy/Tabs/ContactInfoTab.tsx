import { AgentType } from '@models/Agent'
import { KFieldset, KInfo } from '@components/kits'
import { Grid, Paper } from '@mui/material'

type PropsType = {
  feeleasyInfo: AgentType
}

export default function ContactInfoTab({ feeleasyInfo }: Readonly<PropsType>) {
  return (
    <Paper sx={{ padding: '20px' }}>
      <KFieldset title="اطلاعات تماس">
        <Grid container>
          <Grid xs={12} md={6} item>
            <KInfo
              title="تلفن همراه"
              value={feeleasyInfo?.contactInfo?.mobilePhoneNumber}
            />
          </Grid>

          <Grid xs={12} md={6} item>
            <KInfo
              title="تلفن ثابت"
              value={feeleasyInfo?.contactInfo?.landlinePhoneNumber}
            />
          </Grid>

          <Grid xs={12} md={6} item>
            <KInfo title="ایمیل" value={feeleasyInfo?.contactInfo?.emailAddress} />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
