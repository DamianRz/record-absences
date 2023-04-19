import { Box, LinearProgress } from '@mui/material'
import React, { createContext, useState } from 'react'

export const LoaderContext = createContext({
  isLoading: false,
  setLoading: (value: boolean) => { }
})

interface LoaderProviderProps {
  value: boolean
  children: React.ReactChild
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ value, children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const setLoading = (value: boolean) => {
    setIsLoading(value)
  }

  const context = { isLoading, setLoading }

  return (
    <LoaderContext.Provider value={context}>
      {children}
      {
        isLoading && (
          <Box sx={{ width: '100%', position: "absolute", bottom: "1px" }}>
            <LinearProgress />
          </Box>
        )
      }
    </LoaderContext.Provider>
  )
}
