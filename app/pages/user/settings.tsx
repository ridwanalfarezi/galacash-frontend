import React from 'react'

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
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center gap-2"></div>
      </div>

      {/* Settings card */}
      <div className="bg-card flex flex-col gap-15 rounded-2xl p-10 shadow-lg md:flex-row md:gap-10">
        {/* Left side: Profile picture and settings form */}
        <div className="flex-1">
          {/* Profile picture */}
          <div className="mb-4 flex flex-col items-center justify-center gap-y-11">
            <img src="/patya.png" className="size-64 rounded-full object-cover" />
            <Button>Edit Foto Profil</Button>
          </div>
          {/* Settings form */}
          <form className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xl">Nama</Label>
              <Input type="text" placeholder="Enter your name" />
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Email</Label>
              <Input type="email" placeholder="Enter your e-mail" />
            </div>

            {/* class select */}
            <div className="space-y-1">
              <Label className="text-xl">Kelas</Label>
              <Select>
                <SelectTrigger className="w-1/2 rounded-md border-2 border-gray-500 py-4.5 text-base focus:border-gray-900">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Kelas A</SelectItem>
                  <SelectItem value="health">Kelas B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          <div className="mt-4 grid grid-cols-1 md:mt-0 md:min-h-26 md:place-items-end">
            <Button>Simpan</Button>
          </div>
        </div>
        {/* Divider */}
        <div className="hidden h-auto w-px bg-gray-500 md:block"></div>
        {/* Right side: password lama dan password baru*/}
        <div className="flex-1">
          <h2 className="mb-4 text-2xl font-medium">Ubah Password</h2>
          {/* Settings form */}
          <form className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xl">Password Lama</Label>
              <Input type="password" placeholder="Password Lama" />
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Password Baru</Label>
              <Input type="password" placeholder="Password Baru" />
            </div>

            <div className="space-y-1">
              <Label className="text-xl">Konfirmasi Password Baru</Label>
              <Input type="password" placeholder="Konfirmasi Password Baru" />
            </div>
          </form>

          <div className="mt-4 grid grid-cols-1 md:mt-0 md:min-h-104 md:place-items-end">
            <Button>Simpan</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
