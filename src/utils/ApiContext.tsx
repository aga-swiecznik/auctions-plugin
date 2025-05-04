import React, { createContext, useContext, useState, ReactNode } from "react";

interface ApiContextType {
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  setLoading: (key: string, value: boolean) => void;
  setError: (key: string, value: string | null) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoadingState] = useState<Record<string, boolean>>({});
  const [error, setErrorState] = useState<Record<string, string | null>>({});

  const setLoading = (key: string, value: boolean) => {
    setLoadingState((prev) => ({ ...prev, [key]: value }));
  };

  const setError = (key: string, value: string | null) => {
    setErrorState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ApiContext.Provider value={{ loading, error, setLoading, setError }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
