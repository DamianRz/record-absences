
import React from 'react'
import Drawer from './drawer'

interface LayoutProps {
  children: React.ReactChild
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="absolute block w-full h-full">
      <div className="w-full py-2 bg-teal-100 h-fit">
        <p className='mx-3 '>Logald - Inasistencias Docentes</p>
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
