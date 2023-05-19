import { useRouter } from 'next/router';
import React, { createContext, useEffect, useState } from 'react';

export type UserType = 'Adscripto' | 'Administrativo' | 'Director';

type UserContextType = {
  userType: string;
  setUserType: (type: string) => void;
  getUserType: () => string;
  userIsNormal: () => boolean;
  userIsAdmin: () => boolean;
  userIsOwner: () => boolean;
};

export const UserContext = createContext<UserContextType>({
  userType: 'Adscripto',
  setUserType: () => { },
  getUserType: () => 'Adscripto',
  userIsNormal: () => true,
  userIsAdmin: () => false,
  userIsOwner: () => false,
});

export const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [userTypeState, setUserTypeState] = useState<string>("");
  const router = useRouter()

  useEffect(() => {
    const storedUserType = localStorage.getItem('user');
    if (storedUserType) {
      setUserType(storedUserType);
    }

    const handleRouteChange = () => {
      const storedUserType = localStorage.getItem('user');
      if (storedUserType) {
        setUserType(storedUserType);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const setUserType = (type: string) => {
    setUserTypeState(type);
  };

  const getUserType = () => {
    return userTypeState;
  };

  const userIsNormal = () => {
    return userTypeState === 'Adscripto';
  };

  const userIsAdmin = () => {
    return userTypeState === 'Administrativo';
  };

  const userIsOwner = () => {
    return userTypeState === 'Director';
  };

  return (
    <UserContext.Provider
      value={{
        userType: userTypeState,
        setUserType,
        getUserType,
        userIsNormal,
        userIsAdmin,
        userIsOwner,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};