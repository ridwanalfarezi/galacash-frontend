# Bendahara Backend API Endpoints

## ✅ Available Backend APIs

All bendahara endpoints are **fully implemented** in the backend and ready for frontend integration.

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://galacash-server-2-66220284668.asia-southeast2.run.app/api`

### Authentication

All bendahara routes require:

- JWT token in `Authorization: Bearer <token>` header OR httpOnly cookie
- User role: `bendahara`

---

## 📊 Dashboard

### GET `/bendahara/dashboard`

Get bendahara dashboard with overview statistics.

**Response:**

```typescript
{
  success: true,
  data: {
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
}
```

**Frontend Service:**

```typescript
// app/lib/services/bendahara.service.ts
async getDashboard() {
  const { data } = await apiClient.get('/bendahara/dashboard')
  return data
}
```

---

## 💰 Fund Applications Management

### GET `/bendahara/fund-applications`

Get all fund applications for review with pagination and filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`pending`, `approved`, `rejected`)

**Response:**

```typescript
{
  success: true,
  data: {
    applications: FundApplication[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

### POST `/bendahara/fund-applications/{id}/approve`

Approve a fund application and automatically create expense transaction.

**Response:**

```typescript
{
  success: true,
  data: FundApplication,
  message: "Fund application approved"
}
```

### POST `/bendahara/fund-applications/{id}/reject`

Reject a fund application with reason.

**Request Body:**

```typescript
{
  rejectionReason: string
}
```

**Response:**

```typescript
{
  success: true,
  data: FundApplication,
  message: "Fund application rejected"
}
```

**Frontend Service:**

```typescript
// app/lib/services/bendahara.service.ts
async getFundApplications(params?: { page?: number; limit?: number; status?: string }) {
  const { data } = await apiClient.get('/bendahara/fund-applications', { params })
  return data
}

async approveFundApplication(id: string) {
  const { data } = await apiClient.post(`/bendahara/fund-applications/${id}/approve`)
  return data
}

async rejectFundApplication(id: string, rejectionReason: string) {
  const { data } = await apiClient.post(`/bendahara/fund-applications/${id}/reject`, {
    rejectionReason
  })
  return data
}
```

---

## 📝 Cash Bills Management

### GET `/bendahara/cash-bills`

Get all cash bills with pagination and filtering.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`unpaid`, `pending_payment`, `paid`)

**Response:**

```typescript
{
  success: true,
  data: {
    bills: CashBill[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

### POST `/bendahara/cash-bills/{id}/confirm-payment`

Confirm a cash bill payment and automatically create income transaction.

**Response:**

```typescript
{
  success: true,
  data: CashBill,
  message: "Payment confirmed"
}
```

### POST `/bendahara/cash-bills/{id}/reject-payment`

Reject a cash bill payment.

**Request Body:**

```typescript
{
  reason?: string
}
```

**Response:**

```typescript
{
  success: true,
  data: CashBill,
  message: "Payment rejected"
}
```

**Frontend Service:**

```typescript
// app/lib/services/bendahara.service.ts
async getCashBills(params?: { page?: number; limit?: number; status?: string }) {
  const { data } = await apiClient.get('/bendahara/cash-bills', { params })
  return data
}

async confirmPayment(billId: string) {
  const { data } = await apiClient.post(`/bendahara/cash-bills/${billId}/confirm-payment`)
  return data
}

async rejectPayment(billId: string, reason?: string) {
  const { data } = await apiClient.post(`/bendahara/cash-bills/${billId}/reject-payment`, {
    reason
  })
  return data
}
```

---

## 📈 Financial Recap (Rekap Kas)

### GET `/bendahara/rekap-kas`

Get financial recap with date range filtering.

**Query Parameters:**

- `startDate` (optional): Start date (format: YYYY-MM-DD)
- `endDate` (optional): End date (format: YYYY-MM-DD)
- `groupBy` (optional): Group by period (`day`, `week`, `month`, `year`)

**Response:**

```typescript
{
  success: true,
  data: {
    summary: {
      totalIncome: number,
      totalExpense: number,
      balance: number
    },
    students: Array<{
      userId: string,
      name: string,
      nim: string,
      totalPaid: number,
      totalUnpaid: number,
      paymentStatus: 'up-to-date' | 'has-arrears'
    }>,
    transactions: Transaction[],
    period: {
      startDate: string,
      endDate: string
    }
  }
}
```

**Frontend Service:**

```typescript
// app/lib/services/bendahara.service.ts
async getRekapKas(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year'
}) {
  const { data } = await apiClient.get('/bendahara/rekap-kas', { params })
  return data
}
```

---

## 👥 Students Management

### GET `/bendahara/students`

Get list of all class students.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or NIM

**Response:**

```typescript
{
  success: true,
  data: {
    students: User[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

**Frontend Service:**

```typescript
// app/lib/services/bendahara.service.ts
async getStudents(params?: { page?: number; limit?: number; search?: string }) {
  const { data } = await apiClient.get('/bendahara/students', { params })
  return data
}
```

---

## 🔄 Transactions (General Endpoints)

These endpoints are available for all authenticated users, including bendahara:

### GET `/transactions`

Get transactions list with filtering.

**Query Parameters:**

- `page`, `limit`: Pagination
- `startDate`, `endDate`: Date range filter
- `type`: Transaction type (`income`, `expense`)
- `sortBy`: Sort field (`date`, `amount`, `type`)
- `sortOrder`: Sort order (`asc`, `desc`)

### GET `/transactions/{id}`

Get transaction details by ID.

### GET `/transactions/chart-data`

Get chart data for visualization.

### POST `/transactions/export`

Export transactions to Excel/CSV.

**Response:** Blob (file download)

---

## 📦 Complete Frontend Service Structure

```typescript
// app/lib/services/bendahara.service.ts
import { apiClient } from '../api/client'
import type { components } from '~/types/api'

type Dashboard = components['schemas']['BendaharaDashboard']
type FundApplication = components['schemas']['FundApplication']
type CashBill = components['schemas']['CashBill']
type User = components['schemas']['User']
type RekapKas = components['schemas']['RekapKas']

export interface BendaharaFilters {
  page?: number
  limit?: number
  status?: string
  search?: string
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month' | 'year'
}

export const bendaharaService = {
  // Dashboard
  async getDashboard() {
    const { data } = await apiClient.get<{ success: boolean; data: Dashboard }>(
      '/bendahara/dashboard'
    )
    return data.data
  },

  // Fund Applications
  async getFundApplications(params?: BendaharaFilters) {
    const { data } = await apiClient.get('/bendahara/fund-applications', { params })
    return data.data
  },

  async approveFundApplication(id: string) {
    const { data } = await apiClient.post(`/bendahara/fund-applications/${id}/approve`)
    return data.data
  },

  async rejectFundApplication(id: string, rejectionReason: string) {
    const { data } = await apiClient.post(`/bendahara/fund-applications/${id}/reject`, {
      rejectionReason,
    })
    return data.data
  },

  // Cash Bills
  async getCashBills(params?: BendaharaFilters) {
    const { data } = await apiClient.get('/bendahara/cash-bills', { params })
    return data.data
  },

  async confirmPayment(billId: string) {
    const { data } = await apiClient.post(`/bendahara/cash-bills/${billId}/confirm-payment`)
    return data.data
  },

  async rejectPayment(billId: string, reason?: string) {
    const { data } = await apiClient.post(`/bendahara/cash-bills/${billId}/reject-payment`, {
      reason,
    })
    return data.data
  },

  // Rekap Kas
  async getRekapKas(params?: BendaharaFilters) {
    const { data } = await apiClient.get('/bendahara/rekap-kas', { params })
    return data.data
  },

  // Students
  async getStudents(params?: BendaharaFilters) {
    const { data } = await apiClient.get('/bendahara/students', { params })
    return data.data
  },
}
```

---

## 🎯 Integration Priority

1. **Dashboard** - Show overview statistics
2. **Fund Applications** - Review, approve/reject
3. **Cash Bills** - Confirm/reject payments
4. **Rekap Kas** - Financial reports
5. **Kas Kelas** - Use general `/transactions` endpoints

---

## ⚠️ Important Notes

### Transaction Creation

- **Fund Application Approval** → Automatically creates EXPENSE transaction
- **Cash Bill Confirmation** → Automatically creates INCOME transaction
- Bendahara does NOT manually create transactions via separate endpoint
- All transactions are created through the approval/confirmation flow

### Authentication

- All endpoints require `bendahara` role
- Backend validates user role via `requireBendahara` middleware
- Frontend should check role from auth state before showing bendahara routes

### Error Handling

Standard error responses:

```typescript
{
  success: false,
  error: {
    code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR",
    message: string,
    details?: any
  }
}
```

### Rate Limiting

- Applied to all API endpoints
- Default: 100 requests per 15 minutes per IP

---

## ✅ Backend Status: READY FOR INTEGRATION

All bendahara endpoints are:

- ✅ Implemented in controllers
- ✅ Connected to routes
- ✅ Validated with schemas
- ✅ Protected with authentication & authorization
- ✅ Documented in OpenAPI spec
- ✅ Deployed to Cloud Run

**Next Steps:**

1. Create `app/lib/services/bendahara.service.ts`
2. Create `app/lib/queries/bendahara.queries.ts`
3. Update bendahara route files with `clientLoader`
4. Update bendahara page components with `useQuery` and `useMutation`
