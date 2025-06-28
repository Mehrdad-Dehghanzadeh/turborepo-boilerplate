import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { KButton, KFieldset, KInfo, KSelect } from '@components-kits'
import { useAppStore } from '@store'
import { useForm } from 'react-hook-form'
import { GenderList } from '@enums/Gender'
import { EducationLevelList } from '@enums/EducationLevel'
import { MaritalStatusList } from '@enums/MaritalStatus'
import useValidations from '@hooks/useValidations'
import { PersonalInfoDto } from '@models/Users'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import { deepClone } from '@utils/object'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'
import { enumsProvider } from '@/utils/enums'

export default function () {
  const user = useAppStore((state) => state.user)
  const updateUser = useAppStore((state) => state.updateUser)
  const { snackbar } = useSnackbar()

  const { control, handleSubmit } = useForm<PersonalInfoDto>({
    defaultValues: {
      gender: user?.personalInfo?.gender || '',
      maritalStatus: user?.personalInfo?.maritalStatus || '',
      educationLevel: user?.personalInfo?.educationLevel || ''
    }
  })

  const { required } = useValidations()
  const [loading, setLoading] = useState<boolean>(false)

  const onSubmitForm = (data: PersonalInfoDto) => {
    setLoading(true)
    const payload = deepClone(data)

    apis.users
      .updatePersonalInfo(user.uuid, payload)
      .then(() => updateUser())
      .then(() => {
        snackbar('success', 'اطلاعات شما با موفقیت بروزرسانی شد')
      })
      .catch((error: any) => {
        snackbar('error', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Paper
      component="section"
      id="profile-tabs-national-card"
      sx={{ paddingX: '16px', paddingBottom: '16px', paddingTop: '24px' }}
    >
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <KSelect
              name="gender"
              control={control}
              items={GenderList}
              label="جنسیت"
              rules={{ required: required() }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <KSelect
              name="educationLevel"
              control={control}
              items={EducationLevelList}
              label="تحصیلات"
              rules={{ required: required() }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <KSelect
              control={control}
              rules={{ required: required() }}
              name="maritalStatus"
              items={MaritalStatusList}
              label="وضعیت تاهل"
            />
          </Grid>
        </Grid>

        <div className="d-flex align-items-center justify-content-end">
          <KButton
            type="submit"
            variant="contained"
            color="success"
            loading={loading}
            sx={{ marginTop: '15px' }}
          >
            ثبت اطلاعات
          </KButton>
        </div>
      </form>

      <Divider sx={{ marginTop: '30px ', marginBottom: '20px' }} />

      {user?.personalInfo && (
        <KFieldset title="اطلاعات شخصی">
          <Grid container>
            <Grid item xs={12} md={4}>
              <KInfo
                title="جنسیت"
                value={enumsProvider('GenderList', user?.personalInfo?.gender)?.title}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <KInfo
                title="سطح تحصیلات"
                value={
                  enumsProvider('EducationLevelList', user?.personalInfo?.educationLevel)
                    ?.title
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <KInfo
                title="وضعیت تاهل"
                value={
                  enumsProvider('MaritalStatusList', user?.personalInfo?.maritalStatus)
                    ?.title
                }
              />
            </Grid>
          </Grid>
        </KFieldset>
      )}
    </Paper>
  )
}
