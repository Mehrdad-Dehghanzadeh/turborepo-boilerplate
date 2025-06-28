import { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { LeaseRequestsApproveDto, LeaseRequestsDto } from '@models/LeaseRequests'

export default ($axios: AxiosInstance) => ({
  create(payload: LeaseRequestsDto) {
    return $axios.post('/lease-requests', payload)
  },

  read(params: any, config: InternalAxiosRequestConfig) {
    return $axios.get('/lease-requests', { params, ...config })
  },

  getItem(uuid: string) {
    return $axios.get(`/lease-requests/${uuid}`)
  },

  update(payload: LeaseRequestsDto, uuid: string) {
    return $axios.put(`/lease-requests/${uuid}`, payload)
  },

  readDocuments(uuid: string) {
    return $axios.get(`/lease-requests/${uuid}/documents`)
  },

  postDocuments(uuid: string, payload: any) {
    return $axios.post(`/lease-requests/${uuid}/documents`, payload)
  },

  deleteDocument(
    leaseRequestUuid: string,
    documentId: string,
    payload: any,
    config: InternalAxiosRequestConfig
  ) {
    return $axios.delete(`/lease-requests/${leaseRequestUuid}/documents/${documentId}`, {
      data: payload,
      ...config
    })
  },

  approve(uuid: string, payload: LeaseRequestsApproveDto) {
    return $axios.patch(`/lease-requests/${uuid}`, payload)
  }
})
