import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  return (
    <div className="p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="bg-card flex flex-col gap-15 rounded-2xl p-10 shadow-lg md:flex-row md:gap-10">
        <div className="flex-1">
          <div className="mb-4 flex flex-col items-center justify-center gap-y-11">
            <img src="/patya.png" className="size-64 rounded-full object-cover" />
            <Button>
              <label htmlFor="photo" className="cursor-pointer">
                Ubah Foto Profil
              </label>
            </Button>
            <input type="file" accept="image/*" id="photo" hidden />
          </div>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xl">Nama</Label>
              <Input type="text" placeholder="Enter your name" />
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Email</Label>
              <Input type="email" placeholder="Enter your e-mail" />
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Kelas</Label>
              <Select>
                <SelectTrigger className="w-full rounded-md border-2 border-gray-500 py-4.5 text-base focus:border-gray-900 sm:w-1/2">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Kelas A</SelectItem>
                  <SelectItem value="health">Kelas B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-5 text-end">
              <Button type="submit" className="w-full px-0 sm:w-auto sm:px-10">
                Simpan
              </Button>
            </div>
          </form>
        </div>
        <div className="hidden h-auto w-px bg-gray-500 md:block"></div>
        <div className="flex-1">
          <h2 className="mb-4 text-2xl font-medium">Ubah Kata Sandi</h2>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xl">Kata Sandi Lama</Label>
              <div className="relative">
                <Input
                  type={showPassword.old ? 'text' : 'password'}
                  placeholder="Kata Sandi Lama"
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
                />
                <Button
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  variant="ghost"
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      new: !showPassword.new,
                      confirm: !showPassword.confirm,
                    })
                  }
                >
                  {showPassword.new ? <Eye /> : <EyeClosed />}
                </Button>
              </div>{' '}
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Konfirmasi Kata Sandi Baru</Label>
              <Input
                type={showPassword.confirm ? 'text' : 'password'}
                placeholder="Konfirmasi Password Baru"
              />
            </div>
            <div className="mt-5 space-y-5 text-end">
              <p className="text-justify text-sm font-medium text-blue-500 sm:text-base">
                Pastikan kata sandi baru Anda berbeda dari kata sandi lama.
              </p>
              <p className="text-justify text-sm font-medium text-blue-500 sm:text-base">
                Setelah mengubah kata sandi, Anda harus masuk kembali untuk melanjutkan.
              </p>
              <Button type="submit" className="w-full px-0 sm:w-auto sm:px-10">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
