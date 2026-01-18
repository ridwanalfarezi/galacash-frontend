import { Eye, EyeClosed, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'

import { SettingsSkeleton } from '~/components/data-display'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  useChangePassword,
  useUpdateProfile,
  useUploadAvatar,
  useUserProfile,
} from '~/lib/queries/user.queries'

const SettingsPage = () => {
  const location = useLocation()
  const isBendahara = location.pathname.startsWith('/bendahara')

  // Queries and mutations
  const { data: user, isLoading } = useUserProfile()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()
  const uploadAvatarMutation = useUploadAvatar()

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  // Update profile form when user data loads
  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      })
    }
  }, [user])

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfileMutation.mutateAsync(profileData)
      toast.success('Profil berhasil diperbarui')
    } catch {
      toast.error('Gagal memperbarui profil')
    }
  }

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Kata sandi baru tidak cocok')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Kata sandi baru harus minimal 8 karakter')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Kata sandi berhasil diubah. Silakan login kembali.')
    } catch {
      toast.error('Gagal mengubah kata sandi')
    }
  }

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar (max 5MB)')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    try {
      await uploadAvatarMutation.mutateAsync(file)
      toast.success('Foto profil berhasil diubah')
      // Reset file input
      const input = e.target as HTMLInputElement
      input.value = ''
    } catch {
      toast.error('Gagal mengubah foto profil')
    }
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan</h1>
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="bg-card flex flex-col gap-15 rounded-2xl p-10 shadow-lg md:flex-row md:gap-10">
        <div className="flex-1">
          <div className="mb-4 flex flex-col items-center justify-center gap-y-11">
            <div className="relative flex size-64 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} className="size-full object-cover" />
              ) : (
                <div className="text-4xl font-bold text-gray-500">
                  {user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'N/A'}
                </div>
              )}
            </div>
            <Button disabled={uploadAvatarMutation.isPending}>
              {uploadAvatarMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Mengunggah...</span>
                </div>
              ) : (
                <label htmlFor="photo" className="flex cursor-pointer items-center gap-2">
                  <Upload size={18} />
                  Ubah Foto Profil
                </label>
              )}
            </Button>
            <input
              type="file"
              accept="image/*"
              id="photo"
              hidden
              onChange={handleAvatarChange}
              disabled={uploadAvatarMutation.isPending}
            />
          </div>
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div className="space-y-1">
              <Label className="text-xl">Nama</Label>
              <Input
                type="text"
                placeholder="Masukkan nama Anda"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            {isBendahara ? (
              <div className="space-y-1">
                <Label className="text-xl">Email</Label>
                <Input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xl">NIM</Label>
                <Input type="text" placeholder={user?.nim} disabled className="bg-gray-100" />
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xl">Kelas</Label>
              <Input
                type="text"
                value={user?.className || 'N/A'}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="mt-5 text-end">
              <Button
                type="submit"
                className="w-full px-0 sm:w-auto sm:px-10"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
        <div className="hidden h-auto w-px bg-gray-500 md:block"></div>
        <div className="flex-1">
          <h2 className="mb-4 text-2xl font-medium">Ubah Kata Sandi</h2>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-1">
              <Label className="text-xl">Kata Sandi Lama</Label>
              <div className="relative">
                <Input
                  type={showPassword.old ? 'text' : 'password'}
                  placeholder="Kata Sandi Lama"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                />
                <Button
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  variant="ghost"
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                >
                  {showPassword.old ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Kata Sandi Baru</Label>
              <div className="relative">
                <Input
                  type={showPassword.new ? 'text' : 'password'}
                  placeholder="Kata Sandi Baru"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
                <Button
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setShowPassword({
                      ...showPassword,
                      new: !showPassword.new,
                      confirm: !showPassword.confirm,
                    })
                  }}
                >
                  {showPassword.new ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Konfirmasi Kata Sandi Baru</Label>
              <Input
                type={showPassword.confirm ? 'text' : 'password'}
                placeholder="Konfirmasi Password Baru"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
            </div>
            <div className="mt-5 space-y-5 text-end">
              <p className="text-justify text-sm font-medium text-blue-500 sm:text-base">
                Pastikan kata sandi baru Anda berbeda dari kata sandi lama.
              </p>
              <p className="text-justify text-sm font-medium text-blue-500 sm:text-base">
                Setelah mengubah kata sandi, Anda harus masuk kembali untuk melanjutkan.
              </p>
              <Button
                type="submit"
                className="w-full px-0 sm:w-auto sm:px-10"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
