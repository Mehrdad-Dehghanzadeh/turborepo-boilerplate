import { createContext } from 'react'

type ProductCategoryContextStates = {
  loading: boolean
  productCategory: any[]
  selectedProductCategory: any
}

type ProductCategoryActions = {
  setLoading?: (val: boolean) => void
  ProductCategory?: (val: any[]) => void
  setProductCategory?: (val: any) => void
  setSelectedProductCategory?: (val: any) => void
}

export type ProductCategoryContextType = ProductCategoryContextStates &
  ProductCategoryActions

export const ProductCategoryContext = createContext<ProductCategoryContextType>({
  loading: true,
  productCategory: [],
  selectedProductCategory: null
})
