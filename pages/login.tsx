import React from 'react'
import Login from '../components/login'
import styles from './login.module.scss'

const LoginPage: React.FC<undefined> = () => {
  return (
        <div className={styles['login-page']}>
            {/* <Login
                onSuccess={()=> {}}
                onError={()=> {}}
            /> */}
        </div>
  )
}

export default LoginPage
