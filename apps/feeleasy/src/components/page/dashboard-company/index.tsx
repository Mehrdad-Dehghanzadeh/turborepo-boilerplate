'use client'
import Dialog from '@components-page/dashboard-company/Dialog'
import CompaniesGrid from '@components-page/dashboard-company/CompaniesGrid'
import { CompanyContext } from '@context/CompanyContext'
import { getToken } from '@utils/auth'
import apis from '@apis'
import { useEffect, useMemo, useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'
import { useAppStore } from '@store'

export default function () {
  const isAdmin: boolean = useAppStore((state) => state.isAdmin)

  const { snackbar } = useSnackbar()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCompany, setSelectedCompany] = useState(null)

  const getData = () => {
    const uuid = isAdmin ? '' : getToken()

    apis.leasingCompanies
      .read(uuid)
      .then((res: any) => {
        setCompanies(Array.isArray(res?.data) ? res.data : [])
        setLoading(false)
      })
      .catch((err: any) => {
        snackbar('error', err)
      })
  }

  const context = useMemo(() => {
    return {
      companies,
      setCompanies,
      loading,
      setLoading,
      selectedCompany,
      setSelectedCompany,
      getData
    }
  }, [companies, loading])

  useEffect(() => {
    getData()
  }, [])

  return (
    <CompanyContext.Provider value={context}>
      <Dialog />
      <CompaniesGrid />
    </CompanyContext.Provider>
  )
}
