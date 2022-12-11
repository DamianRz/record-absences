import type { NextPage } from 'next'
import { Login } from '../../components/login'

const LoginPage: NextPage = () => {
  return (
    <div className="flex items-center w-screen h-screen">
      <Login onError={() => {}} onSuccess={() => {}} />
    </div>
  )
}

export default LoginPage
