import { deepFreeze } from '@utils/object'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import BusinessIcon from '@mui/icons-material/Business'
import ArticleIcon from '@mui/icons-material/Article'
import CategoryIcon from '@mui/icons-material/Category'
import PeopleIcon from '@mui/icons-material/People'
import DescriptionIcon from '@mui/icons-material/Description'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import PaidIcon from '@mui/icons-material/Paid'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import { PartyCategory } from '@enums/PartyCategory'
import type { NavItem, AppHrefs } from '@type/App'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

export const appHrefs: AppHrefs = {
  'dashboard-profile': {
    href: '/dashboard/profile',
    title: 'پروفایل من'
  },

  'dashboard-feeleasy': {
    href: '/dashboard/feeleasy',
    title: 'فیلیزی'
  },

  'dashboard-lease-requests': {
    href: '/dashboard/lease-requests',
    title: 'تسهیلات درخواستی من'
  },

  'dashboard-my-leases': {
    href: '/dashboard/my-leases',
    title: 'تسهیلات تایید شده من'
  },

  'dashboard-my-orders': {
    href: '/dashboard/my-orders',
    title: 'سفارش‌های من'
  },

  'dashboard-company': {
    href: '/dashboard/company',
    title: 'نهاد مالی'
  },

  'dashboard-protocol': {
    href: '/dashboard/protocol',
    title: 'پروتکل لیزینگ '
  },

  'dashboard-users': {
    href: '/dashboard/users',
    title: 'کاربران'
  },

  'dashboard-leases': {
    href: '/dashboard/leases',
    title: 'تسهیلات تایید شده '
  },

  'dashboard-manage-leasing-protocols': {
    title: 'پروتکل‌ها',
    href: '/dashboard/manage-leasing-protocols'
  },

  'dashboard-manage-lease-requests': {
    title: 'درخواست‌های تسهیلات',
    href: '/dashboard/manage-lease-requests'
  },

  'dashboard-product-category-groups': {
    title: 'گروه محصولات',
    href: '/dashboard/product-category-groups'
  },

  'dashboard-shop': {
    href: '/dashboard/shop',
    title: 'فروشگاه'
  },

  'dashboard-shop-wallet': {
    href: '/dashboard/shop-wallet',
    title: 'کیف فروشگاه'
  },

  'dashboard-orders': {
    href: '/dashboard/orders',
    title: 'سفارش‌ها'
  },

  'dashboard-feeleasy-wallet': {
    href: '/dashboard/feeleasy-wallet',
    title: 'کیف پول فیلیزی'
  }
}

export default deepFreeze<NavItem[]>([
  {
    text: appHrefs['dashboard-feeleasy'].title,
    href: appHrefs['dashboard-feeleasy'].href,
    icon: <AccountBalanceIcon />,
    roles: [PartyCategory.Admin]
  },

  {
    text: appHrefs['dashboard-feeleasy-wallet'].title,
    href: appHrefs['dashboard-feeleasy-wallet'].href,
    icon: <AccountBalanceWalletIcon />,
    roles: [PartyCategory.Admin]
  },

  {
    text: appHrefs['dashboard-profile'].title,
    href: appHrefs['dashboard-profile'].href,
    icon: <ManageAccountsIcon />
  },

  {
    text: appHrefs['dashboard-lease-requests'].title,
    href: appHrefs['dashboard-lease-requests'].href,
    icon: <CurrencyExchangeIcon />
  },

  {
    text: appHrefs['dashboard-my-leases'].title,
    href: appHrefs['dashboard-my-leases'].href,
    icon: <PaidIcon />
  },

  {
    text: appHrefs['dashboard-my-orders'].title,
    href: appHrefs['dashboard-my-orders'].href,
    icon: <ShoppingBasketIcon />
  },

  {
    text: appHrefs['dashboard-company'].title,
    href: appHrefs['dashboard-company'].href,
    icon: <BusinessIcon />,
    roles: [PartyCategory.Leasing, PartyCategory.Admin]
  },

  {
    text: appHrefs['dashboard-protocol'].title,
    href: appHrefs['dashboard-protocol'].href,
    icon: <ArticleIcon />,
    roles: [PartyCategory.Leasing]
  },

  {
    text: appHrefs['dashboard-manage-leasing-protocols'].title,
    href: appHrefs['dashboard-manage-leasing-protocols'].href,
    icon: <DescriptionIcon />,
    roles: [PartyCategory.Admin]
  },
  {
    text: appHrefs['dashboard-manage-lease-requests'].title,
    href: appHrefs['dashboard-manage-lease-requests'].href,
    icon: <LocalAtmIcon />,
    roles: [PartyCategory.Admin, PartyCategory.Leasing]
  },

  {
    text: appHrefs['dashboard-leases'].title,
    href: appHrefs['dashboard-leases'].href,
    icon: <CreditScoreIcon />,
    roles: [PartyCategory.Admin, PartyCategory.Leasing]
  },

  {
    text: appHrefs['dashboard-product-category-groups'].title,
    href: appHrefs['dashboard-product-category-groups'].href,
    icon: <CategoryIcon />,
    roles: [PartyCategory.Admin]
  },
  {
    text: appHrefs['dashboard-users'].title,
    href: appHrefs['dashboard-users'].href,
    icon: <PeopleIcon />,
    roles: [PartyCategory.Admin]
  },
  {
    text: appHrefs['dashboard-shop'].title,
    href: appHrefs['dashboard-shop'].href,
    icon: <StorefrontIcon />,
    roles: [PartyCategory.Admin, PartyCategory.Shop]
  },

  {
    text: appHrefs['dashboard-orders'].title,
    href: appHrefs['dashboard-orders'].href,
    icon: <ProductionQuantityLimitsIcon />,
    roles: [PartyCategory.Admin, PartyCategory.Shop]
  },
  {
    text: appHrefs['dashboard-shop-wallet'].title,
    href: appHrefs['dashboard-shop-wallet'].href,
    icon: <AccountBalanceWalletIcon />,
    roles: [PartyCategory.Shop]
  }
])
