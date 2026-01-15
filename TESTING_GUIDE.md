# Complete Testing Guide

## Prerequisites

- Backend server running on correct port
- User/Bendahara accounts available
- Authentication cookies set

---

## Task 1: Export Button Testing

### Test Case 1.1: Export from User Kas-Kelas Page

**Steps**:

1. Navigate to `/user/kas-kelas`
2. Wait for transactions to load
3. Click "Export" button
4. Wait for file download

**Expected Results**:

- ✅ Button shows "Mengekspor..." during download
- ✅ Excel file downloads automatically
- ✅ Toast shows "Transaksi berhasil diekspor"
- ✅ File named `transactions-YYYY-MM-DD.xlsx`

**Verification**:

- Open the Excel file
- Check it contains transaction data
- Verify columns: Date, Type, Category, Description, Amount
- Check total calculations at bottom

---

### Test Case 1.2: Export with Filter - Income Only

**Steps**:

1. Navigate to `/user/kas-kelas`
2. Click filter dropdown
3. Select "Pemasukan" (Income)
4. Click "Export" button

**Expected Results**:

- ✅ File downloads
- ✅ Excel file only contains income transactions
- ✅ All entries show "Income" or "Pemasukan" type

---

### Test Case 1.3: Export with Filter - Expense Only

**Steps**:

1. Navigate to `/user/kas-kelas`
2. Click filter dropdown
3. Select "Pengeluaran" (Expense)
4. Click "Export" button

**Expected Results**:

- ✅ File downloads
- ✅ Excel file only contains expense transactions
- ✅ All entries show "Expense" or "Pengeluaran" type

---

### Test Case 1.4: Export from Bendahara Kas-Kelas

**Steps**:

1. Navigate to `/bendahara/kas-kelas`
2. Wait for transactions to load
3. Click "Export" button
4. Wait for file download

**Expected Results**:

- ✅ Same behavior as user kas-kelas
- ✅ File downloads with all transactions
- ✅ Toast notification shows success

---

### Test Case 1.5: Export Error Handling

**Steps**:

1. Disconnect internet/disable backend
2. Navigate to `/user/kas-kelas`
3. Click "Export" button

**Expected Results**:

- ✅ Toast shows error: "Gagal mengekspor transaksi"
- ✅ Button re-enables after error
- ✅ No file downloads

---

## Task 2: Settings Page Testing

### Test Case 2.1: Load Settings as Regular User

**Steps**:

1. Log in as regular user (NIM: 1313600001)
2. Navigate to `/user/settings`
3. Wait for page to load

**Expected Results**:

- ✅ Page shows loading spinner briefly
- ✅ User name displays in form field
- ✅ NIM displays (but is disabled/read-only)
- ✅ Avatar displays correctly or shows initials
- ✅ No email field visible (user role)
- ✅ Password change form visible

---

### Test Case 2.2: Load Settings as Bendahara

**Steps**:

1. Log in as bendahara (NIM: 1313624056-admin)
2. Navigate to `/bendahara/settings`
3. Wait for page to load

**Expected Results**:

- ✅ Page shows loading spinner briefly
- ✅ User name displays in form field
- ✅ Email field visible with email value
- ✅ Avatar displays correctly or shows initials
- ✅ Password change form visible

---

### Test Case 2.3: Update User Profile Name

**Steps**:

1. Navigate to `/user/settings`
2. Wait for page to load
3. Clear "Nama" field
4. Type new name: "John Doe Updated"
5. Click "Simpan" button
6. Wait for submission

**Expected Results**:

- ✅ Button shows "Menyimpan..." during submission
- ✅ Toast shows "Profil berhasil diperbarui"
- ✅ Form field retains new value
- ✅ Page refreshes with new name

---

### Test Case 2.4: Update Bendahara Email

**Steps**:

1. Navigate to `/bendahara/settings`
2. Clear "Email" field
3. Type new email: "newemail@example.com"
4. Click "Simpan" button
5. Wait for submission

**Expected Results**:

- ✅ Button shows "Menyimpan..."
- ✅ Toast shows "Profil berhasil diperbarui"
- ✅ Email field updated with new value

---

### Test Case 2.5: Change Password - Valid

**Steps**:

1. Navigate to settings
2. Scroll to "Ubah Kata Sandi" section
3. Enter "Kata Sandi Lama" (current password)
4. Enter "Kata Sandi Baru" (new password, min 8 chars)
5. Confirm password in "Konfirmasi" field
6. Click "Simpan" button

**Expected Results**:

- ✅ Passwords match and at least 8 characters
- ✅ Button shows "Menyimpan..."
- ✅ Toast shows "Kata sandi berhasil diubah"
- ✅ Form clears after success
- ✅ Message: "Setelah mengubah kata sandi, Anda harus masuk kembali"

---

### Test Case 2.6: Change Password - Mismatch

**Steps**:

1. Navigate to settings
2. Enter old password
3. Enter new password: "newpass123"
4. Enter different confirmation: "differentpass"
5. Click "Simpan" button

**Expected Results**:

- ✅ Toast shows error: "Kata sandi baru tidak cocok"
- ✅ No API call made
- ✅ Form retains values

---

### Test Case 2.7: Change Password - Too Short

**Steps**:

1. Navigate to settings
2. Enter old password
3. Enter new password: "short"
4. Confirm same: "short"
5. Click "Simpan" button

**Expected Results**:

- ✅ Toast shows: "Kata sandi baru harus minimal 8 karakter"
- ✅ No API call made
- ✅ Form retains values

---

### Test Case 2.8: Upload Avatar - Valid Image

**Steps**:

1. Navigate to `/user/settings`
2. Click "Ubah Foto Profil" button
3. Select an image file (JPG/PNG, < 5MB)
4. Wait for upload

**Expected Results**:

- ✅ Avatar preview updates immediately
- ✅ Toast shows "Foto profil berhasil diubah"
- ✅ Profile query re-fetches with new avatar
- ✅ File input clears

---

### Test Case 2.9: Upload Avatar - Invalid File Type

**Steps**:

1. Navigate to settings
2. Click "Ubah Foto Profil"
3. Select a non-image file (PDF, TXT, etc.)
4. Wait for response

**Expected Results**:

- ✅ Toast shows "File harus berupa gambar"
- ✅ No upload occurs
- ✅ Avatar remains unchanged

---

### Test Case 2.10: Upload Avatar - File Too Large

**Steps**:

1. Navigate to settings
2. Click "Ubah Foto Profil"
3. Select image > 5MB
4. Wait for response

**Expected Results**:

- ✅ Toast shows "Ukuran file terlalu besar (max 5MB)"
- ✅ No upload occurs
- ✅ Avatar remains unchanged

---

### Test Case 2.11: Avatar Display - With Image

**Steps**:

1. User has avatar uploaded
2. Navigate to `/user/settings`
3. Look at top-left avatar circle

**Expected Results**:

- ✅ Avatar image displays
- ✅ Properly sized to 256x256px
- ✅ Rounded corners

---

### Test Case 2.12: Avatar Display - Fallback (No Image)

**Steps**:

1. User has no avatar uploaded
2. Navigate to `/user/settings`
3. Look at top-left avatar circle

**Expected Results**:

- ✅ Initials display instead
- ✅ Gray background
- ✅ Proper size and styling

---

## Validation Checklist

### Export Button:

- [ ] Downloads Excel file
- [ ] File has correct format
- [ ] Filter works (income/expense)
- [ ] Error handling works
- [ ] Button disabled during export
- [ ] Toast notifications show

### Settings Page:

- [ ] User data loads correctly
- [ ] Avatar displays (image or initials)
- [ ] Profile update works
- [ ] Password change validation works
- [ ] Password change submission works
- [ ] Avatar upload validation works
- [ ] Avatar upload submission works
- [ ] Loading states show properly
- [ ] Toast notifications show
- [ ] Error handling works
- [ ] Role-based fields visible correctly
- [ ] Form fields auto-populate on load

---

## Edge Cases to Test

1. **Network Offline**: Try export/form submission with no internet
2. **Slow Network**: Test with network throttling enabled
3. **Invalid Credentials**: Wrong old password on password change
4. **Concurrent Requests**: Rapid export clicks
5. **File Size**: Very large Excel generation
6. **Session Expiry**: Try actions after token expires
7. **Special Characters**: Upload file with special name
8. **Multiple Avatars**: Upload multiple images in sequence

---

## Performance Considerations

### Export Performance:

- Large transaction sets (1000+) should still download smoothly
- Memory usage should not spike significantly
- File generation should complete in < 5 seconds

### Settings Performance:

- Profile load should complete in < 2 seconds
- Avatar upload should complete in < 10 seconds
- Form submission should complete in < 5 seconds

---

## Accessibility Notes

- Buttons should be keyboard accessible (Tab navigation)
- Form inputs should be focusable
- Loading states should be announced
- Error messages should be visible to screen readers
- Images should have alt text where applicable

---

## Notes for QA

1. Backend must be running for all tests
2. Database should have test data
3. Test accounts must exist
4. Cookies must be properly set
5. Check browser console for errors
6. Verify network tab shows correct requests
7. Check API responses in DevTools
