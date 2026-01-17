import React from 'react'
import { Outlet } from 'react-router-dom'

const EditorLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <header className="bg-gray-800 border-b border-gray-700">
            <div className="px-4 py-3">
              <h1 className="text-lg font-medium text-white">Editor</h1>
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default EditorLayout
