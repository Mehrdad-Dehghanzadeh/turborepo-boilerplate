import { SendOtpPayload, SigninigContractPayload } from '@models/Contracts'
import { AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  read(uuid: string) {
    return $axios.get(`/contracts/${uuid}`)
  },

  create(uuid: string, payload: any) {
    return $axios.put(`/leases/${uuid}/contract`, payload)
  },

  sendOtp(uuid: string, payload: SendOtpPayload) {
    return $axios.post(`/users/${uuid}/otps`, payload)
  },

  signing(leaseUuid: string, payload: SigninigContractPayload) {
    return $axios.post(`/leases/${leaseUuid}/contract/signatures`, payload)
  }
})
