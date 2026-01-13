# Frontend-Backend API Analysis

## ✅ MATCH ANALYSIS: Frontend Requirements vs Backend Endpoints

---

## 1. Bendahara Dashboard Page

### Frontend Requirements (app/pages/bendahara/dashboard.tsx)

**Displays:**

- Total Balance (Saldo Efektif)
- Total Income (filtered by date range)
- Total Expense (filtered by date range)
- Recent Transactions (grouped by date, with date range filter)
- Pending Fund Applications (submissions with approve/reject buttons)

**Needs:**

1. Dashboard summary statistics
2. Transactions list with date filtering
3. Fund applications with status "pending"
4. Quick approve/reject actions

### Backend Endpoints Available

✅ **MATCH**: `GET /bendahara/dashboard`

```typescript
{
  totalBalance: number,
  totalIncome: number,
  totalExpense: number,
  pendingFundApplications: number,
  pendingPayments: number,
  totalStudents: number,
  recentTransactions: Transaction[],
  recentFundApplications: FundApplication[],
  recentCashBills: CashBill[]
}
```

✅ **MATCH**: Quick actions in dashboard use:

- `POST /bendahara/fund-applications/{id}/approve`
- `POST /bendahara/fund-applications/{id}/reject`

### Status: ✅ **FULLY SUPPORTED**

---

## 2. Bendahara Aju Dana Page

### Frontend Requirements (app/pages/bendahara/aju-dana.tsx)

**Displays:**

- List of all fund applications
- Filter by: status, applicant, category, amount range
- Sort by: date, purpose, category, amount, applicant, status
- View details in modal (DetailAjuDanaBendahara)
- Approve/Reject actions with buttons

**Needs:**

1. Get all fund applications with pagination
2. Filter by status
3. Approve application
4. Reject application with reason
5. Export functionality

### Backend Endpoints Available

✅ **MATCH**: `GET /bendahara/fund-applications`

- Supports: `page`, `limit`, `status` filters
- Returns: applications array + pagination

✅ **MATCH**: `POST /bendahara/fund-applications/{id}/approve`

✅ **MATCH**: `POST /bendahara/fund-applications/{id}/reject`

- Requires: `rejectionReason` in body

⚠️ **PARTIAL**: Frontend has filters for applicant, category, amount

- Backend only supports `status` filter
- **Frontend needs to filter client-side** for applicant/category/amount

⚠️ **MISSING**: Export fund applications

- No `/bendahara/fund-applications/export` endpoint

### Status: ⚠️ **MOSTLY SUPPORTED** (client-side filtering needed)

---

## 3. Bendahara Kas Kelas Page

### Frontend Requirements (app/pages/bendahara/kas-kelas.tsx)

**Displays:**

- Transaction history list
- Filter by type: all, income, expense
- Sort by: date, amount, purpose, type
- Create new transaction modal (BuatTransaksi)
- Income/Expense pie charts
- Export functionality

**Needs:**

1. Get transactions list with filters
2. Create new transaction (income/expense)
3. Chart data for visualization
4. Export transactions

### Backend Endpoints Available

✅ **MATCH**: `GET /transactions`

- Supports: `page`, `limit`, `type`, `startDate`, `endDate`, `sortBy`, `sortOrder`

✅ **MATCH**: `GET /transactions/chart-data`

✅ **MATCH**: `POST /transactions/export`

- Returns: Blob (Excel/CSV file)

❌ **MISSING**: Create transaction endpoint for bendahara

- **No `POST /transactions` or `/bendahara/transactions` endpoint**
- **CRITICAL GAP**: Bendahara cannot manually create transactions

**Note from backend code:**

- Transactions are auto-created when:
  - Approving fund application → creates EXPENSE
  - Confirming cash bill → creates INCOME
- No manual transaction creation endpoint exists

### Status: ❌ **MISSING CRITICAL FEATURE** (manual transaction creation)

---

## 4. Bendahara Rekap Kas Page

### Frontend Requirements (app/pages/bendahara/rekap-kas.tsx)

**Displays:**

- Student payment recap table
- Monthly payment status (Sep, Oct, Nov, Dec with checkmarks)
- Total unpaid amount per student
- Status badge: Lunas (paid) / Belum Lunas (unpaid)
- Filter and sort capabilities
- Export functionality
- Click student row → navigate to detail-rekap-kas

**Needs:**

1. Student list with payment status per month
2. Calculate total unpaid per student
3. Export recap
4. Student payment details (for detail page)

### Backend Endpoints Available

✅ **MATCH**: `GET /bendahara/rekap-kas`

```typescript
{
  summary: {
    totalIncome: number,
    totalExpense: number,
    balance: number
  },
  students: [{
    userId: string,
    name: string,
    nim: string,
    totalPaid: number,
    totalUnpaid: number,
    paymentStatus: 'up-to-date' | 'has-arrears'
  }],
  transactions: Transaction[],
  period: { startDate, endDate }
}
```

⚠️ **PARTIAL MATCH**: Backend provides:

- ✅ Student list with totalPaid/totalUnpaid
- ❌ No month-by-month breakdown (Sep, Oct, Nov, Dec status)
- Backend aggregates total, frontend shows per-month checkboxes

**Frontend displays monthly breakdown, backend provides totals only**

❌ **MISSING**: Export rekap-kas

- Backend has `/bendahara/rekap-kas/export` in OpenAPI spec
- Need to check if implemented

### Status: ⚠️ **PARTIAL MATCH** (needs monthly breakdown)

---

## 5. Bendahara Detail Rekap Kas Page

### Frontend Requirements (app/pages/bendahara/detail-rekap-kas.tsx)

**Displays:**

- Individual student's payment history
- Monthly bills with status
- Filter and sort bills
- View bill details in modal
- Approve/reject payment proof

**Needs:**

1. Get student's cash bills
2. Confirm payment
3. Reject payment with reason

### Backend Endpoints Available

✅ **MATCH**: `GET /bendahara/cash-bills`

- Can filter by student (though filter params unclear)
- Returns bills with status

✅ **MATCH**: `POST /bendahara/cash-bills/{id}/confirm-payment`

✅ **MATCH**: `POST /bendahara/cash-bills/{id}/reject-payment`

- Accepts optional `reason` in body

⚠️ **UNCLEAR**: How to filter bills by specific student?

- Need to check if backend supports `userId` query param

### Status: ✅ **SUPPORTED** (with minor clarification needed)

---

## 6. BuatTransaksi Modal

### Frontend Requirements (app/components/modals/BuatTransaksi.tsx)

**Form Fields:**

- Date (SingleDatePicker)
- Purpose/Description (text input)
- Type (income/expense select)
- Amount (currency input)
- Attachment (file upload)

**Needs:**

- Create transaction endpoint

### Backend Endpoints Available

❌ **MISSING**: No transaction creation endpoint

- **CRITICAL GAP for manual transaction entry**

### Status: ❌ **NOT SUPPORTED**

---

## Summary of Gaps

### ❌ CRITICAL MISSING

1. **Manual Transaction Creation**
   - **Endpoint needed**: `POST /bendahara/transactions` or `POST /transactions`
   - **Request Body**:
     ```typescript
     {
       date: string,
       description: string,
       type: 'income' | 'expense',
       amount: number,
       attachment?: File,
       category?: string
     }
     ```
   - **Impact**: Bendahara cannot create manual income/expense entries
   - **Frontend affected**: BuatTransaksi modal unusable

### ⚠️ PARTIAL GAPS

2. **Fund Applications Filtering**
   - Backend only supports `status` filter
   - Frontend filters: applicant, category, amount (must filter client-side)

3. **Rekap Kas Monthly Breakdown**
   - Backend returns `totalPaid` / `totalUnpaid` aggregates
   - Frontend displays monthly checkboxes (Sep, Oct, Nov, Dec)
   - **Solution**: Either:
     - Fetch individual bills per student and group by month (client-side)
     - Add month-by-month data to `/bendahara/rekap-kas` response

4. **Export Endpoints**
   - Fund applications export not available
   - Rekap kas export in spec but needs verification

### ✅ WELL SUPPORTED

- Dashboard statistics and recent data
- Fund application approve/reject
- Cash bill confirm/reject
- Transaction list with filters
- Transaction chart data
- Transaction export

---

## Recommendations

### Priority 1: Add Transaction Creation (CRITICAL)

```typescript
// Backend: Add to bendahara.routes.ts
router.post(
  '/transactions',
  validateBody(createTransactionSchema),
  bendaharaController.createTransaction
)

// Controller
export const createTransaction = async (req, res) => {
  const { date, description, type, amount, category } = req.body
  const bendaharaId = req.user.sub
  const classId = req.user.classId

  // Handle file upload if present
  const attachment = req.file?.path

  const transaction = await transactionService.create({
    date,
    description,
    type,
    amount,
    category,
    attachment,
    createdBy: bendaharaId,
    classId,
  })

  res.json({ success: true, data: transaction })
}
```

### Priority 2: Enhance Rekap Kas Response

Add monthly breakdown to `/bendahara/rekap-kas`:

```typescript
students: [{
  userId: string,
  name: string,
  nim: string,
  totalPaid: number,
  totalUnpaid: number,
  paymentStatus: 'up-to-date' | 'has-arrears',
  // ADD THIS:
  monthlyPayments: [{
    month: string,        // "2025-09"
    isPaid: boolean,
    amount: number,
    billId?: string
  }]
}]
```

### Priority 3: Add Export Endpoints

```typescript
// Fund applications export
POST /bendahara/fund-applications/export
→ Returns Excel/CSV blob

// Verify rekap-kas export is implemented
POST /bendahara/rekap-kas/export
→ Returns Excel/CSV blob
```

### Priority 4: Frontend Adaptations

**For filtering limitations:**

- Filter fund applications by applicant/category/amount on client-side
- Fetch all pages if needed, or adjust UI to only show status filter

**For rekap kas monthly view:**

- Fetch all cash bills and group by student + month
- OR simplify UI to show only totals (match backend)

---

## Conclusion

**Backend API Coverage: 75%**

✅ **Well supported:**

- Dashboard overview
- Fund application review (approve/reject)
- Cash bill management (confirm/reject)
- Transaction viewing & filtering
- Basic exports

❌ **Missing critical feature:**

- **Manual transaction creation** - blocks primary bendahara workflow

⚠️ **Needs enhancement:**

- Monthly payment breakdown for rekap kas
- Advanced filtering for fund applications
- Additional export endpoints

**Next Step:** Create transaction creation endpoint in backend OR adjust frontend to only use auto-generated transactions (from approvals/confirmations).
