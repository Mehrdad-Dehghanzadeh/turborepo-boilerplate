'use client'
import { ProtocolContext } from '@context/ProtocolContext'
import { useEffect, useMemo, useState } from 'react'
import Form from './Form'
import apis from '@apis'
import useSnackbar from '@hooks/useSnackbar'

interface Props {
  editData: any
  isEdit: boolean
}

export default function ({ editData, isEdit }: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>([])
  const contextValue = useMemo(
    () => ({ loading, setLoading, categories, setCategories, isEdit, editData }),
    [loading, categories]
  )

  const { snackbar } = useSnackbar()

  const getAllCategories = () => {
    apis.productCategoryGroups
      .read()
      .then((res: any) => {
        setCategories(res.data ?? [])
      })
      .catch(() => {
        snackbar('error', 'مشکل دریافت ')
      })
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <ProtocolContext.Provider value={contextValue}>
      <Form />
    </ProtocolContext.Provider>
  )
}
