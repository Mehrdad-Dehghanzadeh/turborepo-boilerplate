import { type EnumList } from '@type/Enums'

export enum CompanyType {
  PublicJoinStock = 'PUBLIC_JOINT_STOCK',
  PrivateJointStock = 'PRIVATE_JOINT_STOCK'
}

export const CompanyTypeList: EnumList = [
  {
    value: CompanyType.PublicJoinStock,
    title: 'سهامی عام',
    color: 'info'
  },

  {
    value: CompanyType.PrivateJointStock,
    title: 'سهامی خاص',
    color: 'info'
  }
]
