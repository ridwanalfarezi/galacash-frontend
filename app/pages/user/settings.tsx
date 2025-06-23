import React from 'react'

const SettingsPage = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[32px] font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center gap-2"></div>
      </div>

      {/* Settings background */}
      <div className="bg-card rounded-lg p-6 shadow-md">
        {/* Profile picture */}
        <div className="flex flex-col items-center">
          <img
            sizes="width: 100%; height: 100%; border-radius: 240px"
            src="C:\Users\User\Work\UNIV\GALAPROJECT\GalaCash\public\logo.png"
            className="h-32 w-32 rounded-full object-cover"
          />
          <button className="mt-3 rounded bg-blue-900 px-4 py-2 text-white">
            Edit Foto Profil
          </button>
        </div>

        {/* Settings form */}
        <form>
          <div className="mb-4 w-full">
            <label className="mb-2 block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="Nama"
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="E-mail"
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Enter your Email"
            />
          </div>

          {/* class select */}
          <div>
            <label className="mb-1 block font-medium">Kelas</label>
            <select className="w-half rounded border border-gray-300 p-2">
              <option>Kelas A</option>
              <option>Kelas B</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsPage
