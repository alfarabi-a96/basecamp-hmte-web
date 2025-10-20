import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Loading from '../components/Loading'
import { FormData } from '../types'
import loginBg from '../assets/image.jpeg'

const LoginPage: React.FC = () => {
  const { login, loginAsGuest, isLoading, user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Redirect jika sudah login
  if (user) {
    return <Navigate to='/dashboard' replace />
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!formData.username || !formData.password) {
      setError('Username dan password harus diisi')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await login(formData.username, formData.password)
      if (!result.success) {
        setError(result.error || 'Terjadi kesalahan saat login')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login')
    }

    setIsSubmitting(false)
  }

  const handleGuestLogin = (): void => {
    loginAsGuest()
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Foto dengan Blur */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)'
        }}
      />

      {/* Overlay Gelap */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Login Form Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '448px'
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                margin: '0 auto',
                height: '64px',
                width: '64px',
                backgroundImage:
                  'linear-gradient(to bottom right, rgb(96, 165, 250), rgb(37, 99, 235))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <LogIn
                style={{ width: '32px', height: '32px', color: 'white' }}
              />
            </div>
            <h2
              style={{
                marginTop: '1.5rem',
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              Login ke Sistem
            </h2>
            <p
              style={{
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgb(191, 219, 254)'
              }}
            >
              Laporan Keuangan Iuran Alumni
            </p>
          </div>

          {/* Login Form */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              {/* Error Message */}
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(248, 113, 113, 0.5)',
                    color: 'rgb(254, 226, 226)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'rgb(191, 219, 254)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Username
                </label>
                <div
                  style={{
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      paddingLeft: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <User
                      style={{
                        height: '20px',
                        width: '20px',
                        color: 'rgb(147, 197, 253)'
                      }}
                    />
                  </div>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    required
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem'
                    }}
                    autoComplete='off'
                    placeholder='Masukkan username'
                    disabled={isSubmitting}
                    onFocus={(e) => {
                      e.target.style.outline = 'none'
                      e.target.style.boxShadow = '0 0 0 2px rgb(96, 165, 250)'
                      e.target.style.borderColor = 'transparent'
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none'
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'rgb(191, 219, 254)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Password
                </label>
                <div
                  style={{
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      paddingLeft: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <Lock
                      style={{
                        height: '20px',
                        width: '20px',
                        color: 'rgb(147, 197, 253)'
                      }}
                    />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem'
                    }}
                    placeholder='Masukkan password'
                    disabled={isSubmitting}
                    autoComplete='current-password'
                    onFocus={(e) => {
                      e.target.style.outline = 'none'
                      e.target.style.boxShadow = '0 0 0 2px rgb(96, 165, 250)'
                      e.target.style.borderColor = 'transparent'
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none'
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    }}
                  />
                  <button
                    type='button'
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      paddingRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.5 : 1,
                      background: 'none',
                      border: 'none'
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff
                        style={{
                          height: '20px',
                          width: '20px',
                          color: 'rgb(147, 197, 253)'
                        }}
                      />
                    ) : (
                      <Eye
                        style={{
                          height: '20px',
                          width: '20px',
                          color: 'rgb(147, 197, 253)'
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type='submit'
                style={{
                  width: '100%',
                  backgroundImage:
                    'linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235))',
                  color: 'white',
                  fontWeight: '600',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s ease',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem'
                }}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundImage =
                      'linear-gradient(to right, rgb(37, 99, 235), rgb(29, 78, 216))'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundImage =
                      'linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235))'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                {isSubmitting ? (
                  <div
                    style={{
                      animation: 'spin 1s linear infinite',
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderBottom: '2px solid transparent',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <>
                    <LogIn style={{ width: '16px', height: '16px' }} />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                marginTop: '1.5rem'
              }}
            >
              <div
                style={{
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  <span
                    style={{
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    atau
                  </span>
                </div>
              </div>
            </div>

            {/* Guest Login */}
            <button
              type='button'
              onClick={handleGuestLogin}
              style={{
                marginTop: '1rem',
                width: '100%',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'rgb(191, 219, 254)',
                fontWeight: '500',
                transition: 'color 0.2s ease',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
                background: 'none',
                border: 'none',
                padding: '0.5rem 0'
              }}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.color = 'rgb(147, 197, 253)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.color = 'rgb(191, 219, 254)'
                }
              }}
            >
              Masuk tanpa login
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default LoginPage
