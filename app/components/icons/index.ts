import CloseSidebar from './close-sidebar'
import Home from './home'
import LowIncomeLevel from './low-income-level'
import Money from './money'
import Settings from './settings'
import SignOut from './sign-out'

export const Icons = {
  Home,
  Money,
  LowIncomeLevel,
  CloseSidebar,
  Settings,
  SignOut,
} as const

export type IconKey = keyof typeof Icons

export type IconProps = {
  size?: number
  className?: string
}
