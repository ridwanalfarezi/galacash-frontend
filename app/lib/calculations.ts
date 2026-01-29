import type { components } from '~/types/api'

type CashBill = components['schemas']['CashBill']

export type TotalBills = {
  amount: number
  date: Date
  latestDate: Date
}

export const calculateTotalBills = (bills: CashBill[]): TotalBills | null => {
  if (!bills || bills.length === 0) return null

  let totalAmount = 0
  let minDateTs = Infinity
  let maxDateTs = -Infinity

  // Use a loop for better performance and fewer allocations than reduce
  for (let i = 0; i < bills.length; i++) {
    const bill = bills[i]
    const amount = Number(bill.totalAmount || 0)
    totalAmount += amount

    // Construct date from month (1-12) and year values
    const billMonth = Number(bill.month) || 1
    const billYear = Number(bill.year) || new Date().getFullYear()
    const billDate = new Date(billYear, billMonth - 1, 1) // month is 0-indexed in JS
    const billTime = billDate.getTime()

    if (billTime < minDateTs) minDateTs = billTime
    if (billTime > maxDateTs) maxDateTs = billTime
  }

  return {
    amount: totalAmount,
    date: new Date(minDateTs),
    latestDate: new Date(maxDateTs),
  }
}

export const calculateDeadline = (totalBills: TotalBills | null): Date | null => {
  if (!totalBills) return null

  const excludedMonths = [0, 1, 6, 7] // Jan, Feb, Jul, Aug
  const date = new Date(totalBills.latestDate)
  date.setMonth(date.getMonth() + 1)
  date.setDate(1)

  while (excludedMonths.includes(date.getMonth())) {
    date.setMonth(date.getMonth() + 1)
  }
  return date
}
