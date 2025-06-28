'use client'
import { useAppStore } from '@store'
import AdminTable from './AdminTable'
import ShopTable from './ShopTable'

export default function DashboardShop() {
  const isAdmin = useAppStore((state) => state.isAdmin)
  return <div>{isAdmin ? <AdminTable /> : <ShopTable />}</div>
}
