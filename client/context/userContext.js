import React, { useState, useEffect, createContext, useContext } from 'react'

const userContext = createContext(null);
export const useUser = () => useContext(userContext);

export function UserProvider({children}) {
  return (
    <userContext.Provider>
      {children}
    </userContext.Provider>
  )
}
