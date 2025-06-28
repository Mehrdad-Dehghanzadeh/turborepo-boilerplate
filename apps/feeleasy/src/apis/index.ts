import type { TApis } from '@type/Apis'
import $axios from './$axios'
import auth from './resources/auth'
import users from './resources/users'
import leasingCompanies from './resources/leasingCompanies'
import productCategoryGroups from './resources/productCategoryGroups'
import leasingProtocols from './resources/leasingProtocols'
import leaseRequests from './resources/leaseRequests'
import shop from './resources/shop'
import orders from './resources/orders'
import leases from './resources/leases'
import wallet from './resources/wallet'
import transactions from './resources/transactions'
import inquiry from './resources/inquiry'
import contract from './resources/contract'
import repayment from './resources/repayment'
import assets from './resources/assets'
import guarantee from './resources/guarantee'
import repaymentCheques from './resources/repaymentCheques'
import invoice from './resources/invoice'
import leasingAgent from './resources/leasingAgent'

const apis: TApis = {
  auth: auth($axios),
  users: users($axios),
  leasingCompanies: leasingCompanies($axios),
  productCategoryGroups: productCategoryGroups($axios),
  leasingProtocols: leasingProtocols($axios),
  leaseRequests: leaseRequests($axios),
  shop: shop($axios),
  orders: orders($axios),
  leases: leases($axios),
  wallet: wallet($axios),
  transactions: transactions($axios),
  inquiry: inquiry($axios),
  contract: contract($axios),
  repayment: repayment($axios),
  assets: assets($axios),
  guarantee: guarantee($axios),
  repaymentCheques: repaymentCheques($axios),
  invoice: invoice($axios),
  leasingAgent: leasingAgent($axios)
}

export default apis
