'use client'
import Dialog from './Dialog'
import ProductCategoryGrid from './ProductCategoryGrid'
import { ProductCategoryContext } from '@context/ProductCategoryContext'
import apis from '@apis'
import { useEffect, useMemo, useState } from 'react'
import useSnackbar from '@hooks/useSnackbar'

export default function () {
  const { snackbar } = useSnackbar()
  const [selectedProductCategory, setSelectedProductCategory] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [productCategory, setProductCategory] = useState<any[]>([])

  const context = useMemo(() => {
    return {
      selectedProductCategory,
      setSelectedProductCategory,
      loading,
      setLoading,
      productCategory,
      setProductCategory
    }
  }, [productCategory, loading])

  const getData = () => {
    apis.productCategoryGroups
      .read()
      .then((res: any) => {
        setProductCategory(Array.isArray(res?.data) ? res.data : [])
        setLoading(false)
      })
      .catch((err: any) => {
        snackbar('error', err)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <ProductCategoryContext.Provider value={context}>
      <Dialog />
      <ProductCategoryGrid />
    </ProductCategoryContext.Provider>
  )
}
