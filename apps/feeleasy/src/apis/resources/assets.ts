import { VehiclesDetails } from '@models/Assets'
import { type AxiosInstance } from 'axios'

export default ($axios: AxiosInstance) => ({
  getVehicles(assetUuid: string) {
    return $axios.get(`/assets/vehicles/${assetUuid}`)
  },

  postVehicles(payload: VehiclesDetails) {
    return $axios.post(`/assets/vehicles`, payload)
  },

  updateVehicles(assetUuid: string, payload: VehiclesDetails) {
    return $axios.put(`/assets/vehicles/${assetUuid}`, payload)
  },

  getVehiclesDocuments(assetUuid: string) {
    return $axios.get(`/assets/vehicles/${assetUuid}/documents`)
  },

  postVehiclesDocuments(assetUuid: string, vehicleTitle: string, payload: any) {
    return $axios.put(`/assets/vehicles/${assetUuid}/documents/${vehicleTitle}`, payload)
  }
})
