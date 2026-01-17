import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navigation/Navbar'
import WhatsAppButton from '../components/WhatsAppButton'
import ChatbotButton from '../components/ChatbotButton'
import CookiesBanner from '../components/CookiesBanner'

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-16">
        <Outlet />
      </main>

      {/* Floating Action Buttons */}
      <WhatsAppButton />
      <ChatbotButton />
      <CookiesBanner />
    </div>
  )
}

export default PublicLayout
