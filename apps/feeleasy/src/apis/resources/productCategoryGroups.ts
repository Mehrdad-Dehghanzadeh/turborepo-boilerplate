import type { ProductCategoryGroups } from '@models/ProductCategoryGroups'

export default ($axios: any) => ({
  create(payload: ProductCategoryGroups) {
    return $axios.post('/productCategoryGroups', payload)
  },

  read() {
    return $axios.get('/productCategoryGroups')
  },

  update(payload: ProductCategoryGroups) {
    return $axios.put(`/productCategoryGroups/${payload.code}/`, payload)
  }
})
