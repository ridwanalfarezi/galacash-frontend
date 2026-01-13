import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import Eye from '~/components/icons/eye'
import EyeOff from '~/components/icons/eye-off'
import { APIError } from '~/lib/api/errors'
import { queryClient } from '~/lib/query-client'
import { authService } from '~/lib/services/auth.service'

function FormHeader() {
  return (
    <>
      <img src="/logo.png" alt="Logo" className="h-24 md:h-28" />
      <div className="flex items-center gap-2 self-stretch opacity-50">
        <hr className="w-full border-gray-900" />
        <h1 className="text-center text-base text-nowrap text-gray-900">Masuk Ke Akun Anda</h1>
        <hr className="w-full border-gray-900" />
      </div>
    </>
  )
}

function NimInput({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}) {
  return (
    <>
      <input
        type="tel"
        placeholder="NIM"
        value={value}
        className={`h-12 self-stretch rounded-t-2xl border px-4 py-3.5 placeholder-gray-500 focus:z-20 focus:outline-2 focus:outline-blue-500 ${error ? 'border-red-500' : 'border-gray-500'}`}
        maxLength={10}
        onChange={onChange}
        required={true}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </>
  )
}

function PasswordInput({
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  error,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  showPassword: boolean
  toggleShowPassword: () => void
  error?: string
}) {
  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Kata Sandi"
        value={value}
        onChange={onChange}
        className={`h-12 w-full rounded-b-2xl border px-4 py-3.5 pr-12 placeholder-gray-500 focus:z-20 focus:outline-2 focus:outline-blue-500 ${error ? 'border-red-500' : 'border-gray-500'}`}
        required
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 focus:outline-none"
        aria-label={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
      </button>
      {error && <p className="absolute -bottom-6 left-0 text-sm text-red-500">{error}</p>}
    </div>
  )
}

function SignInForm({
  nim,
  setNim,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errors,
  setErrors,
  onSubmit,
  isSubmitting,
}: {
  nim: string
  setNim: (v: string) => void
  password: string
  setPassword: (v: string) => void
  showPassword: boolean
  setShowPassword: (v: boolean) => void
  errors: { nim?: string; password?: string }
  setErrors: (v: { nim?: string; password?: string }) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}) {
  const handleNimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNim(e.target.value)
    setErrors({ ...errors, nim: undefined })
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors({ ...errors, password: undefined })
  }
  const toggleShow = () => setShowPassword(!showPassword)

  return (
    <form
      className="z-10 flex w-full max-w-150 flex-col items-center justify-between gap-8 rounded-4xl bg-gray-100 p-8 font-sans shadow-md"
      onSubmit={onSubmit}
    >
      <FormHeader />
      <div className="flex flex-col items-start self-stretch">
        <NimInput value={nim} onChange={handleNimChange} error={errors.nim} />
        <PasswordInput
          value={password}
          onChange={handlePasswordChange}
          showPassword={showPassword}
          toggleShowPassword={toggleShow}
          error={errors.password}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="self-stretch rounded-2xl border bg-blue-700 px-4 py-3 text-xl font-semibold text-gray-300 hover:bg-blue-500 active:ring-2 active:ring-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  )
}

function SignInPage() {
  const navigate = useNavigate()
  const [nim, setNim] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ nim?: string; password?: string }>({})

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { nim: string; password: string }) => authService.login(credentials),
    onSuccess: (user) => {
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth'] })

      // Show success toast
      toast.success('Login berhasil!')

      // Redirect based on role
      if (user.role === 'bendahara') {
        navigate('/bendahara/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    },
    onError: (error) => {
      if (error instanceof APIError) {
        if (error.code === 'INVALID_CREDENTIALS') {
          setErrors({ password: 'NIM atau password salah' })
        } else {
          toast.error(error.message || 'Terjadi kesalahan saat login')
        }
      } else {
        toast.error('Terjadi kesalahan saat login')
      }
    },
  })

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
      loginMutation.mutate({ nim, password })
    }
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-8 bg-gray-300 bg-[url(/bg_gala.webp)] bg-cover bg-center px-8 md:px-0">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <SignInForm
        nim={nim}
        setNim={setNim}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={loginMutation.isPending}
      />
    </div>
  )
}

export default SignInPage
