import { useState } from 'react'

import Eye from '~/components/icons/eye'
import EyeOff from '~/components/icons/eye-off'

function SignInPage() {
  const [nim, setNim] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ nim?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { nim?: string; password?: string } = {}

    if (!/^13136\d{5}$/.test(nim)) {
      newErrors.nim = 'NIM harus dimulai dengan 13136 dan memiliki 10 digit.'
    }

    if (password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form valid, kirim data:', { nim, password })
    } else {
      console.log('Form tidak valid')
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-8 bg-gray-300 bg-[url(/bg_gala.webp)] bg-cover bg-center px-8 md:px-0">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <form className="z-10 flex w-full max-w-[600px] flex-col items-center justify-between gap-8 rounded-4xl bg-gray-100 p-8 font-sans shadow-md">
        <img src="/logo.png" alt="Logo" className="h-24 md:h-28" />
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center gap-2 self-stretch opacity-50">
            <hr className="w-full border-gray-900" />
            <h1 className="text-center text-base text-nowrap text-gray-900">Masuk Ke Akun Anda</h1>
            <hr className="w-full border-gray-900" />
          </div>
          <div className="flex flex-col items-start self-stretch">
            <input
              type="tel"
              placeholder="NIM"
              value={nim}
              className={`h-12 self-stretch rounded-t-2xl border px-4 py-3.5 placeholder-gray-500 focus:z-20 focus:outline-2 focus:outline-blue-500 ${errors.nim ? 'border-red-500' : 'border-gray-500'}`}
              maxLength={10}
              onChange={(e) => {
                setNim(e.target.value)
                setErrors((prev) => ({ ...prev, nim: undefined }))
              }}
              required={true}
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                className={`h-12 w-full rounded-b-2xl border px-4 py-3.5 pr-12 placeholder-gray-500 focus:z-20 focus:outline-2 focus:outline-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-500'}`}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 focus:outline-none"
                aria-label={showPassword ? 'Sembunyikan Password' : 'Tampilkan Password'}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
            {errors.nim && <p className="text-sm text-red-500">{errors.nim}</p>}
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="self-stretch rounded-2xl border bg-blue-700 px-4 py-3 text-xl font-semibold text-gray-300 hover:bg-blue-500 active:ring-2 active:ring-blue-700"
          onClick={handleSubmit}
        >
          Masuk
        </button>
      </form>
    </div>
  )
}

export default SignInPage
