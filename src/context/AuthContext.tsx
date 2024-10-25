import React, { FC, useEffect, useState } from 'react';
import { getData } from '../utils/dataStore';
import { loggedInUserType } from './type';

type authContextProviderType = {
  loggedInUserData: loggedInUserType | null;
  goalsData: loggedInUserType | null;
  isLoading: boolean;
  setIsLoading: () => void;
  setLoggedInUserData: (userData: loggedInUserType | null) => void;
  setGoalsData: (userData: loggedInUserType | null) => void;
};
export const AuthContext = React.createContext<authContextProviderType>({
  isLoading: false,
  loggedInUserData: null,
  goalsData: null,
  setIsLoading: () => {
    return;
  },
  setLoggedInUserData: () => {
    return;
  },
  setGoalsData: () => {
    return;
  },
});

type authProviderProps = {
  children: JSX.Element;
};

export const AuthProvider: FC<authProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loggedInUserData, setLoggedInUserData] =
    useState<loggedInUserType | null>(null);
  const [goalsData, setGoalsData] = useState<loggedInUserType | null>(null);
  useEffect(() => {
    getData('userData').then((res) => {
      setLoggedInUserData(res);
    });
    getData('userGoalsData').then((res) => {
      setGoalsData(res);
    });
  }, []);

  const context = {
    isLoading,
    loggedInUserData,
    goalsData,
    setIsLoading: () => {
      setIsLoading((prevIsLoading) => !prevIsLoading);
    },
    setLoggedInUserData: (userData: loggedInUserType | null) => {
      setLoggedInUserData(userData);
    },
    setGoalsData: (userData: any | null) => {
      setGoalsData(userData);
    },
  };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
