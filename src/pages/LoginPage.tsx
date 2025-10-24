import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { FormData } from '../types'
import loginBg from '../assets/image.jpeg'
import clsx from 'clsx'
import styles from './LoginPage.module.css'

const LoginPage: React.FC = () => {
  const { login, loginAsGuest, user } = useAuth()
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

  return (
    <div className={clsx(styles.root, 'overflow-hidden relative')}>
      <div
        className={clsx(styles.bg, 'absolute')}
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className={clsx(styles.overlay, 'absolute')} />
      <div
        className={clsx(
          styles.container,
          'relative flex items-center justify-center'
        )}
      >
        <div className={clsx(styles.inner, 'w-full')}>
          <div className='text-center mb-8'>
            <div
              className={clsx(styles.logo, 'flex items-center justify-center')}
            >
              <LogIn className={clsx(styles['login-icon'], 'text-white')} />
            </div>
            <h2 className='text-white font-bold text-3xl mt-6'>
              Login ke Sistem
            </h2>
            <p className={clsx(styles.subtitle, 'mt-2 text-sm')}>
              Laporan Keuangan Iuran Alumni
            </p>
          </div>
          <div className={clsx(styles.card, 'p-8')}>
            <form
              onSubmit={handleSubmit}
              className={clsx(styles.form, 'flex gap-6')}
            >
              {error && (
                <div className={clsx(styles.error, 'p-4 rounded-lg text-sm')}>
                  {error}
                </div>
              )}
              <div>
                <label
                  className={clsx(
                    styles['field-label'],
                    'block text-sm font-medium mb-2'
                  )}
                >
                  Username
                </label>
                <div className='relative'>
                  <div
                    className={clsx(
                      styles['icon-left-container'],
                      'absolute inset-y-0 left-0 flex items-center pointer-events-none'
                    )}
                  >
                    <User className={styles['input-icon']} />
                  </div>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={clsx(
                      styles.input,
                      'w-full py-3 rounded-lg text-white'
                    )}
                    autoComplete='off'
                    placeholder='Masukkan username'
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label
                  className={clsx(
                    styles['field-label'],
                    'block text-sm font-medium mb-2'
                  )}
                >
                  Password
                </label>
                <div className='relative'>
                  <div
                    className={clsx(
                      styles['icon-left-container'],
                      'absolute inset-y-0 left-0 flex items-center pointer-events-none'
                    )}
                  >
                    <Lock className={styles['input-icon']} />
                  </div>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={clsx(
                      styles.input,
                      'w-full py-3 rounded-lg text-white'
                    )}
                    placeholder='Masukkan password'
                    disabled={isSubmitting}
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    className={clsx(
                      styles['toggle-button'],
                      'absolute inset-y-0 right-0 flex items-center cursor-pointer'
                    )}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className={styles['eye-icon']} />
                    ) : (
                      <Eye className={styles['eye-icon']} />
                    )}
                  </button>
                </div>
              </div>
              <button
                type='submit'
                className={clsx(
                  styles.submit,
                  'w-full text-white py-3 rounded-lg cursor-pointer flex items-center justify-center'
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.spin} />
                ) : (
                  <>
                    <LogIn className={styles['login-icon']} />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className={styles['divider-wrap']}>
              <div className='relative'>
                <div
                  className={clsx(
                    styles['divider-line'],
                    'absolute flex items-center'
                  )}
                >
                  <div className={clsx(styles['divider-hr'], 'w-full')} />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className={clsx(styles['divider-text'], 'px-2')}>
                    atau
                  </span>
                </div>
              </div>
            </div>
            <button
              type='button'
              onClick={handleGuestLogin}
              className={clsx(
                styles['guest-button'],
                'mt-4 w-full text-center text-sm font-medium cursor-pointer'
              )}
              disabled={isSubmitting}
            >
              Masuk tanpa login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
