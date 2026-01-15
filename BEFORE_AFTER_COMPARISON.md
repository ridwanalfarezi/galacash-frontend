# Before & After Comparison

## Task 1: Export Button Integration

### BEFORE:

```tsx
// pages/user/kas-kelas.tsx
// const handleExport = async () => {
//   try {
//     const blob = await transactionService.exportTransactions({
//       type: filterType === 'all' ? undefined : filterType,
//     })
//     // ... commented out code
//   } catch {
//     toast.error('Gagal mengekspor transaksi')
//   }
// }

<Button className="w-full sm:w-auto">
  <Export className="h-5 w-5" />
  Export {/* Non-functional button */}
</Button>
```

### Problems:

- Export method was commented out (TODO comment)
- Export endpoint was using POST instead of GET
- Button had no onClick handler
- Feature was completely non-functional

### AFTER:

```tsx
// pages/user/kas-kelas.tsx
const [isExporting, setIsExporting] = useState(false)

const handleExport = async () => {
  try {
    setIsExporting(true)
    const blob = await transactionService.exportTransactions({
      type: filterType === 'all' ? undefined : filterType,
    })
    // Download handling...
    toast.success('Transaksi berhasil diekspor')
  } catch {
    toast.error('Gagal mengekspor transaksi')
  } finally {
    setIsExporting(false)
  }
}

;<Button className="w-full sm:w-auto" onClick={handleExport} disabled={isExporting}>
  <Export className="h-5 w-5" />
  {isExporting ? 'Mengekspor...' : 'Export'}
</Button>
```

### Fixed:

- ✅ Export method now active and functional
- ✅ Uses correct GET endpoint
- ✅ Button connected to handler with onClick
- ✅ Loading state during export
- ✅ File downloads automatically
- ✅ Toast notifications for feedback

---

## Task 2: Settings Page User Info

### BEFORE:

```tsx
// pages/shared/settings.tsx
const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState({...})
  const location = useLocation()
  const isBendahara = location.pathname.startsWith('/bendahara')

  return (
    <div className="p-8">
      <div className="bg-card">
        <div className="flex flex-col items-center justify-center gap-y-11">
          <img src="/patya.png" className="size-64 rounded-full" />  {/* Hardcoded image */}
          <Button>
            <label htmlFor="photo">Ubah Foto Profil</label>
          </Button>
          <input type="file" accept="image/*" id="photo" hidden />
        </div>
        <form className="space-y-4">
          <div>
            <Label>Nama</Label>
            <Input type="text" placeholder="Enter your name" />  {/* No value */}
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your e-mail" />  {/* No value */}
          </div>
          <div>
            <Label>Kelas</Label>
            <Select>  {/* Hardcoded options */}
              <SelectItem value="education">Kelas A</SelectItem>
              <SelectItem value="health">Kelas B</SelectItem>
            </Select>
          </div>
        </form>
        {/* Password form with no functionality */}
      </div>
    </div>
  )
}
```

### Problems:

- Hardcoded image path (`/patya.png`)
- No API integration
- Form fields show placeholders, not real data
- No form submission handling
- Password change form is non-functional
- Avatar upload has no handler
- All data is dummy/static

### AFTER:

```tsx
// pages/shared/settings.tsx
const SettingsPage = () => {
  // Real API hooks
  const { data: user, isLoading } = useUserProfile()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()
  const uploadAvatarMutation = useUploadAvatar()

  // Form states
  const [profileData, setProfileData] = useState({...})
  const [passwordData, setPasswordData] = useState({...})

  // Load real data when user fetches
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  // Real API handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    await updateProfileMutation.mutateAsync(profileData)
    toast.success('Profil berhasil diperbarui')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Kata sandi baru tidak cocok')
      return
    }
    await changePasswordMutation.mutateAsync({...})
    toast.success('Kata sandi berhasil diubah')
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    await uploadAvatarMutation.mutateAsync(file)
    toast.success('Foto profil berhasil diubah')
  }

  return (
    <div className="p-8">
      {isLoading ? <LoadingSpinner /> : (
        <div>
          <div className="size-64 rounded-full bg-gray-200">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} />  {/* Real user image */}
            ) : (
              <div>{user?.name.slice(0, 2)}</div>  {/* Fallback initials */}
            )}
          </div>

          <form onSubmit={handleProfileSubmit}>
            <Input
              value={profileData.name}
              onChange={e => setProfileData({...profileData, name: e.target.value})}
            />
            {isBendahara && (
              <Input
                value={profileData.email}
                onChange={e => setProfileData({...profileData, email: e.target.value})}
              />
            )}
            <Button disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </form>

          <form onSubmit={handlePasswordSubmit}>
            <Input
              value={passwordData.oldPassword}
              onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
            />
            <Button disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </form>

          <input
            type="file"
            onChange={handleAvatarChange}
            disabled={uploadAvatarMutation.isPending}
          />
        </div>
      )}
    </div>
  )
}
```

### Fixed:

- ✅ Real user avatar from API or initials fallback
- ✅ Form fields auto-populated with real data
- ✅ Working profile update submission
- ✅ Working password change with validation
- ✅ Working avatar upload handler
- ✅ Loading states during API calls
- ✅ Toast notifications for all actions
- ✅ Role-based field visibility
- ✅ Proper form validation
- ✅ Error handling on all endpoints

---

## Summary of Changes

| Aspect          | Before           | After                              |
| --------------- | ---------------- | ---------------------------------- |
| Export Endpoint | POST (wrong)     | GET (correct)                      |
| Export Button   | Non-functional   | Fully functional                   |
| Settings Avatar | Hardcoded image  | Real user avatar                   |
| Settings Forms  | No submission    | Working with API                   |
| User Data       | Dummy/Static     | Real from API                      |
| Password Change | Non-functional   | Fully functional                   |
| Avatar Upload   | No handler       | Working with validation            |
| Loading States  | None             | Complete with disabled buttons     |
| Error Handling  | Basic toast only | Full error handling                |
| User Feedback   | Minimal          | Toast notifications on all actions |

---

## New Files Created

1. **app/lib/services/user.service.ts** - User profile API operations
2. **app/lib/queries/user.queries.ts** - React Query hooks for user data
3. **IMPLEMENTATION_SUMMARY.md** - Detailed implementation guide
4. **QUICK_REFERENCE.md** - Quick testing guide

---

## API Integration

### Transaction Export

- Endpoint: `GET /api/transactions/export`
- Returns: Blob (Excel file)
- Filters: type, category, startDate, endDate, search

### User Profile

- GET `/api/users/profile` - Fetch profile
- PUT `/api/users/profile` - Update name/email
- PUT `/api/users/password` - Change password
- POST `/api/users/avatar` - Upload avatar

All endpoints require authentication via cookies.
