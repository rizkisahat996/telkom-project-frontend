'use client'
import { useAuth } from '@/hooks/auth'
import Loading from '@/app/(app)/Loading'
import React from 'react'

const AppLayout = ({ children }) => {
  const { user } = useAuth({ middleware: 'auth' })

  if (!user) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-purple">
      <main>
        {React.Children.map(children, child =>
          React.cloneElement(child, { user })
        )}
      </main>
    </div>
  )
}

export default AppLayout