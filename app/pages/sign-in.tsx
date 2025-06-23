function SignInPage() {
  return (
    <>
      <form className="bg-main-bg flex h-[400px] w-[600px] flex-col items-center justify-between rounded-4xl px-[56px] py-[32px] font-sans shadow-md">
        <h1 className="text-primary-700 self-stretch text-center text-[32px] font-semibold">
          Masuk ke akun Anda
        </h1>
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="flex items-center gap-[8px] self-stretch opacity-50">
            <hr className="border-text-icon w-full" />
            <label className="text-text-icon w-full text-center text-[16px] text-nowrap">
              Masuk menggunakan E-mail
            </label>
            <hr className="border-text-icon w-full" />
          </div>
          <div className="flex flex-col items-start self-stretch">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Alamat E-mail"
              className="placeholder-inactive-text border-inactive-text h-12 self-stretch rounded-t-2xl border border-b-[0px] px-4 py-3.5"
              required
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="placeholder-inactive-text border-inactive-text h-12 self-stretch rounded-b-2xl border px-4 py-3.5"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary-700 text-main-bg self-stretch rounded-2xl border px-4 py-3 text-[20px] font-semibold"
        >
          Masuk
        </button>
      </form>
    </>
  )
}

export default SignInPage
