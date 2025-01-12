import React, { createContext, useState, ReactNode } from 'react'
import { UserInfo } from '../types'

type UserContextType = {
  user: UserInfo | null
  setUser: (info: UserInfo | null) => void
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
})

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserInfo | null>(null)

  const setUser = (info: UserInfo | null) => {
    setUserState(info)
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
