'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('megan@pacommand.nl')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a brief login delay
    await new Promise(r => setTimeout(r, 700))

    if (password === '' || password.length >= 1) {
      router.push('/dashboard')
    } else {
      setError('Onjuist wachtwoord.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#F5F0E8' }}
    >
      {/* Left — decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14"
        style={{ background: '#1A3A2A' }}
      >
        {/* Logo */}
        <div>
          <Image
            src="https://res.cloudinary.com/dnjbtlwz9/image/upload/v1773585457/NODEFY_full_RGB_black_1_hieyp6.png"
            alt="Logo"
            width={120}
            height={36}
            className="brightness-0 invert"
            unoptimized
          />
        </div>

        {/* Quote / tagline */}
        <div>
          <p
            className="text-4xl font-semibold leading-snug mb-6"
            style={{ fontFamily: "'DM Serif Display', serif", color: '#F5F0E8' }}
          >
            Alles op één plek.<br />
            Voor elke klant.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.55)' }}>
            E-mail, taken, agenda, uren en documenten — georganiseerd voor jou als professional.
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="flex gap-3">
          {['#1B4F72', '#27AE60', '#8E44AD'].map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full opacity-40"
              style={{ background: color }}
            />
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex justify-center">
          <Image
            src="https://res.cloudinary.com/dnjbtlwz9/image/upload/v1773585457/NODEFY_full_RGB_black_1_hieyp6.png"
            alt="Logo"
            width={110}
            height={34}
            unoptimized
          />
        </div>

        <div className="w-full max-w-sm">
          {/* Welcome text */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#A09890' }}>
              Welkom terug
            </p>
            <h1
              className="text-4xl font-semibold leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", color: '#0F0E0C' }}
            >
              Welkom,<br />Megan
            </h1>
            <p className="text-sm mt-2" style={{ color: '#6B6560' }}>
              Log in om door te gaan naar je cockpit.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: '#6B6560' }}
                htmlFor="email"
              >
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E0D9CE',
                  color: '#0F0E0C',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: '#6B6560' }}
                htmlFor="password"
              >
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E0D9CE',
                    color: '#0F0E0C',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#A09890' }}
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs" style={{ color: '#C0392B' }}>{error}</p>
            )}

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs transition-colors"
                style={{ color: '#A09890' }}
              >
                Wachtwoord vergeten?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
              style={{
                background: loading ? '#2D5A3D' : '#1A3A2A',
                color: '#F5F0E8',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                'Inloggen'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: '#C0B9AE' }}>
            PA Command Center · Alleen voor geautoriseerde gebruikers
          </p>
        </div>
      </div>
    </div>
  )
}
