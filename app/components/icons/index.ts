import Alert from './alert'
import ArrowDownCircle from './arrow-down-circle'
import ArrowUpCircle from './arrow-up-circle'
import Bank from './bank'
import Check from './check'
import CloseSidebar from './close-sidebar'
import Export from './export'
import Eye from './eye'
import EyeOff from './eye-off'
import Home from './home'
import LowIncomeLevel from './low-income-level'
import Money from './money'
import MoneyTotal from './money-total'
import Notebook from './notebook'
import Plus from './plus'
import Settings from './settings'
import SignOut from './sign-out'
import Sort from './sort'
import TagihanKas from './tagihan-kas'
import Wallet from './wallet'
import X from './x'

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
  Plus,
  Export,
  Sort,
  Eye,
  EyeOff,
  TagihanKas,
  Notebook,
  Bank,
  Wallet,
  Alert,
  Check,
  X,
} as const

export type IconKey = keyof typeof Icons
