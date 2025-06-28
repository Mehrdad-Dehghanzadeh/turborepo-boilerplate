'use client'
import apis from '@apis'
import { KLoading, KTabs } from '@components/kits'
import useSnackbar from '@hooks/useSnackbar'
import { useAppStore } from '@store'
import { PartyCategory } from '@enums/PartyCategory'
import { useEffect, useState } from 'react'
import { AgentType } from '@models/Agent'
import BasicInfoTab from './Tabs/BasicInfoTab'
import ContactInfoTab from './Tabs/ContactInfoTab'
import PostalInfoTab from './Tabs/PostalInfoTab'
import Status from './Tabs/Status'

export default function Feeleasy() {
  const [loading, setLoading] = useState<boolean>(false)
  const [feeleasyInfo, setFeeleasyInfo] = useState<AgentType>(null)

  const contributions = useAppStore((state) => state.contributions)
  const feeleasyUuid = contributions?.find(
    (item) => item.partyCategory === PartyCategory.Admin
  )?.partyId

  const { snackbar } = useSnackbar()

  const getFeeleasy = () => {
    setLoading(true)

    apis.leasingAgent
      .read(feeleasyUuid)
      .then(({ data }: { data: AgentType }) => setFeeleasyInfo(data))
      .catch((err: Error) => snackbar('error', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getFeeleasy()
  }, [])

  if (loading) return <KLoading />

  return (
    <KTabs tabs={['اطلاعات پایه', 'اطلاعات تماس', 'اطلاعات پستی', 'وضیعت']}>
      <BasicInfoTab feeleasyInfo={feeleasyInfo} />
      <ContactInfoTab feeleasyInfo={feeleasyInfo} />
      <PostalInfoTab feeleasyInfo={feeleasyInfo} />
      <Status feeleasyInfo={feeleasyInfo} />
    </KTabs>
  )
}
