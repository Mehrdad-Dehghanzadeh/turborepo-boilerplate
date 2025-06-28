import { enumsProvider } from '@utils/enums'
import { KFieldset, KInfo } from '@components/kits'
import { AgentType } from '@models/Agent'
import { Chip, Grid, Paper } from '@mui/material'

type PropsType = {
  feeleasyInfo: AgentType
}

export default function Status({ feeleasyInfo }: Readonly<PropsType>) {
  return (
    <Paper sx={{ padding: '20px' }}>
      <KFieldset title="اطلاعات پایه">
        <Grid container>
          <Grid xs={12} md={6} item>
            <KInfo
              title="وضیعت تایید"
              value={
                <Chip
                  variant="outlined"
                  color={enumsProvider('States', feeleasyInfo?.approved ?? '')?.color}
                  label={enumsProvider('States', feeleasyInfo?.approved ?? '')?.title}
                />
              }
            />
          </Grid>

          <Grid xs={12} md={6} item>
            <KInfo
              title="وضیعت فعالیت"
              value={
                <Chip
                  variant="outlined"
                  color={feeleasyInfo?.enabled ? 'success' : 'error'}
                  label={feeleasyInfo?.enabled ? 'فعال' : 'غیرفعال'}
                />
              }
            />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
