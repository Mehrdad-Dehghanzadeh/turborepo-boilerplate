import { AxiosInstance } from 'axios'
import type { ApproveDto, LeaseUpdateDto } from '@models/Lease'

export default ($axios: AxiosInstance) => ({
  getItems(params?: any) {
    return $axios.get('/leases', { params })
  },

  update(payload: LeaseUpdateDto, uuid: string) {
    return $axios.put(`/leases/${uuid}`, payload)
  },

  payments(leaseUuid: string) {
    return $axios.get(`/leases/${leaseUuid}/payments`)
  },

  approve(leaseUuid: string, payload: ApproveDto) {
    return $axios.patch(`/leases/${leaseUuid}`, payload)
  },

  getCreditAllocationText(leaseUuid: NumberString) {
    return $axios.get(`/leases/${leaseUuid}/credit-allocation-term`)
  }
})
