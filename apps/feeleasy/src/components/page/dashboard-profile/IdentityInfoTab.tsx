import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { useAppStore } from '@store'
import { utcToJalali } from '@utils/date'
import { KFieldset, KInfo } from '@components/kits'
import { Chip } from '@mui/material'
import { enumsProvider } from '@utils/enums'

export default function () {
  const user = useAppStore((state) => state.user)
  const verification = useAppStore((state) => state.verification)

  return (
    <Paper
      component="section"
      id="profile-tabs-personal-info"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <KFieldset title="اطلاعات شناسایی">
        <Grid container>
          <Grid item xs={12} md={6}>
            <KInfo title="نام" value={user?.firstName} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="نام خانوادگی" value={user?.lastName} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="کد ملی" value={user?.nationalCard?.nationalCode} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="تاریخ تولد"
              value={utcToJalali(user?.nationalCard?.dateOfBirth)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="محل تولد" value={user?.identityCard?.birthPlace} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="نام پدر" value={user?.identityCard?.fatherName} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo title="شماره شبای تایید شده" value={verification?.verifiedIban} />
          </Grid>

          <Grid item xs={12} md={6}>
            <KInfo
              title="وضعیت اطلاعات شناسایی"
              value={
                <Chip
                  variant="outlined"
                  size="small"
                  color={
                    enumsProvider('States', verification?.identityCardVerified)?.color
                  }
                  label={
                    enumsProvider('States', verification?.identityCardVerified)?.title
                  }
                />
              }
            />
          </Grid>
        </Grid>
      </KFieldset>
    </Paper>
  )
}
