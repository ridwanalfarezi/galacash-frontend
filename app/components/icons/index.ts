import ArrowDownCircle from './arrow-down-circle'
import ArrowUpCircle from './arrow-up-circle'
import CloseSidebar from './close-sidebar'
import Home from './home'
import LowIncomeLevel from './low-income-level'
import Money from './money'
import MoneyTotal from './money-total'
import Settings from './settings'
import SignOut from './sign-out'

export const Icons = {
  Home,
  Money,
  LowIncomeLevel,
  CloseSidebar,
  Settings,
  SignOut,
  MoneyTotal,
  ArrowDownCircle,
  ArrowUpCircle,
} as const

export type IconKey = keyof typeof Icons

export type IconProps = {
  size?: number
  className?: string
}
