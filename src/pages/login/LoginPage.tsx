import React from 'react'
import styles from './LoginPage.module.css'
import { useTitle } from 'core/hooks'
import { LoginForm } from 'pages/login/LoginForm'

export const LoginPage: React.FC = () => {
  useTitle('Login')

  return (
    <div className={styles.pageContainer}>
      <LoginForm />
      <p className={styles.version}>v{process.env.REACT_APP_VERSION}</p>
    </div>
  )
}
