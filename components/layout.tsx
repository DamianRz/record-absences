
import React, { useContext, useEffect } from 'react'
import Drawer from './drawer'
import { UserContext } from '../contexts/userContext'

interface LayoutProps {
  children: React.ReactChild
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { getUserType } = useContext(UserContext)

  return (
    <div className="absolute block w-full h-full">
      <div className="w-full py-2 bg-teal-100 h-fit">
        <p className='mx-3 '>{`Logald - Inasistencias Docentes ${getUserType() !== "undefined" ? `- ${getUserType()}` : ''}`}</p>
      </div>
      <div className="flex w-full h-fit">
        <Drawer isAdmin={false} />
        <div className="w-full px-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
