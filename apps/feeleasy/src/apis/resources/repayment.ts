import { AxiosInstance } from 'axios'
import { ApproveChequesDto, ApproveChequesInquiry } from '@models/RepaymentCheques'

export default ($axios: AxiosInstance) => ({
  read(leaseUuid: string) {
    return $axios.get(`/leases/${leaseUuid}/repayment`)
  },

  approve(repaymentUuid: string, payload: ApproveChequesDto) {
    return $axios.patch(`/repayments/${repaymentUuid}`, payload)
  },

  readCheques(repaymentUuid: string) {
    return $axios.get(`/repayments/${repaymentUuid}/cheques`)
  },

  approveChequesInquiry(repaymentUuid: string, payload: ApproveChequesInquiry) {
    return $axios.post(`/repayments/${repaymentUuid}/cheques`, payload)
  }
})
