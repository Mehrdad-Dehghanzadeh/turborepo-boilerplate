'use client'
import DashboardProtocol from '@components-page/dashboard-protocol-add'
import apis from '@apis'
import { deepClone } from '@utils/object'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { KLoading } from '@components/kits'
import { resourceOwnerConfig } from '@data/apisHeaderConfig'

export default function () {
  const [editData, setEditData] = useState<any>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const searchParams = useSearchParams()
  const protocolUuid = searchParams.get('protocolUuid')

  useEffect(() => {
    if (protocolUuid) getLeasingProtocolData()
  }, [])

  const getLeasingProtocolData = async () => {
    try {
      setLoading(true)
      const { data } = await apis.leasingProtocols.getItem(
        protocolUuid,
        resourceOwnerConfig
      )
      setEditData(deepClone(data))
      setIsEdit(true)
    } catch (err: any) {
      console.error(err)
      throw err?.data?.error || 'Invalid search'
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <KLoading />
  }

  return (
    <article className="dashboard-protocol-add" id="dashboard-protocol-add">
      <DashboardProtocol editData={editData} isEdit={isEdit} />
    </article>
  )
}
