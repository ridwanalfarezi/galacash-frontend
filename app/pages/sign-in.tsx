import { useState } from 'react'

import Eye from '~/components/icons/eye'
import EyeOff from '~/components/icons/eye-off'

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-8 bg-gray-300 bg-[url(/bg_gala.webp)] bg-cover bg-center px-8 md:px-0">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <form className="z-1 flex w-full max-w-[600px] flex-col items-center justify-between gap-8 rounded-4xl bg-gray-100 p-8 font-sans shadow-md">
        <img src="/logo.png" alt="Logo" className="h-24 md:h-28" />
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center gap-2 self-stretch opacity-50">
            <hr className="w-full border-gray-900" />
            <label className="text-center text-base text-nowrap text-gray-900">
              Masuk Ke Akun Anda
            </label>
            <hr className="w-full border-gray-900" />
          </div>
          <div className="flex flex-col items-start self-stretch">
            <input
              type="tel"
              placeholder="NIM"
              className="h-12 self-stretch rounded-t-2xl border border-gray-500 px-4 py-3.5 placeholder-gray-500"
              pattern="13136\d{5}"
              maxLength={10}
              required={true}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="h-12 self-stretch rounded-b-2xl border border-gray-500 px-4 py-3.5 placeholder-gray-500"
              required={true}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="-translate-x-4 -translate-y-9 self-end"
            >
              {showPassword ? (
                <EyeOff size={24} className="text-gray-500" />
              ) : (
                <Eye size={24} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="self-stretch rounded-2xl border bg-blue-700 px-4 py-3 text-xl font-semibold text-gray-300"
        >
          Masuk
        </button>
      </form>
    </div>
  )
}

export default SignInPage
