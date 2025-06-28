import { type AxiosInstance } from 'axios'
import type { CompanyItem, CreateLeasingCompaniesDto } from '@models/LeasingCompanies'

export default ($axios: AxiosInstance) => ({
  create(payload: CreateLeasingCompaniesDto) {
    return $axios.post('/leasing-companies', payload)
  },

  read(uuid?: string) {
    const params = uuid ? { contributorUuid: uuid } : {}
    return $axios.get(`/leasing-companies`, { params })
  },

  updateLeasingCompany(payload: CompanyItem, companyUUID: string) {
    return $axios.put(`/leasing-companies/${companyUUID}`, payload)
  },

  approve(companyUUID: string, payload: any) {
    return $axios.patch(`/leasing-companies/${companyUUID}`, payload)
  }
})
