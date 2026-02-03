import Alert from './Alert'
import ArrowDownCircle from './ArrowDownCircle'
import ArrowUpCircle from './ArrowUpCircle'
import Bank from './Bank'
import Check from './Check'
import CloseSidebar from './CloseSidebar'
import Export from './Export'
import Eye from './Eye'
import EyeOff from './EyeOff'
import Home from './Home'
import LowIncomeLevel from './LowIncomeLevel'
import Money from './Money'
import MoneyTotal from './MoneyTotal'
import Notebook from './Notebook'
import Plus from './Plus'
import Settings from './Settings'
import SignOut from './SignOut'
import Sort from './Sort'
import TagihanKas from './TagihanKas'
import Wallet from './Wallet'
import X from './X'

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
