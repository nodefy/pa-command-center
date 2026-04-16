'use client'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1B4F72]">PA Command Center</h1>
          <p className="text-sm text-[#7F8C8D] mt-1">Jouw AI-cockpit</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-sm border border-gray-100 rounded-xl',
            },
          }}
        />
      </div>
    </div>
  )
}
