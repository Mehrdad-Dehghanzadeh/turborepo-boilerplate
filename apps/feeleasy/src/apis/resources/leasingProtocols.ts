import { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { paramsToCriteria } from '@utils/object'

export default ($axios: AxiosInstance) => ({
  create(payload: any) {
    return $axios.post('/leasing-protocols', payload)
  },

  update(payload: any, protocolUUID: NumberString) {
    return $axios.put(`/leasing-protocols/${protocolUUID}`, payload)
  },

  read(params: any, config: InternalAxiosRequestConfig) {
    const criteria = paramsToCriteria(params)

    return $axios.get('/leasing-protocols', {
      params: criteria ? { criteria } : null,
      ...config
    })
  },

  getItem(protocolUUID: string, config: InternalAxiosRequestConfig) {
    return $axios.get(`/leasing-protocols/${protocolUUID}`, config)
  },

  getProductCategory(protocolUUID: string) {
    return $axios.get(`/leasing-protocols/${protocolUUID}/productCategories`)
  },

  approve(uuid: string, payload: any) {
    return $axios.patch(`/leasing-protocols/${uuid}`, payload)
  },

  getPaymentPlans(uuid: string, params: any) {
    return $axios.get(`/leasing-protocols/${uuid}/repayment-plans`, {
      params
    })
  },

  getRequiredDocuments(uuid: string, params: any) {
    return $axios.get(`/leasing-protocols/${uuid}/required`, {
      params
    })
  }
})
