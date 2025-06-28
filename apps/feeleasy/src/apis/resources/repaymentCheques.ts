import { AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  get(chequeUuid: string) {
    return $axios.get(`/cheques/${chequeUuid}`)
  },

  getImage(chequeUuid: string) {
    return $axios.get(`/cheques/${chequeUuid}/image`)
  },

  postImage(chequeUuid: string, payload: any) {
    return $axios.put(`/cheques/${chequeUuid}/image`, payload)
  }
})
