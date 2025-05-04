import { TRPCLink } from "@trpc/client";
import { useApiContext } from "./ApiContext";
import { AppRouter } from "~/server/api/root";
import { observable } from "@trpc/server/observable";
import { useErrorStore } from "~/app/store/errorState";

interface ApiQueryResult<T, TProcedure> {
  data: T;
  error: { message: string} | null;
  isLoading: boolean;
}

export const useApiQuery = <T, TProcedure>(key: string, result: ApiQueryResult<T, TProcedure>) => {
  const { setError, setLoading } = useApiContext();  
  const { data, error, isLoading } = result;
    
  console.log("API Query Result:", { data, error, isLoading });
  if (error) { 
    setError(key, error.message);
    return { data: null };
  }

  if (isLoading) {
    setLoading(key, isLoading);
    return { data: null };
  }
  
  setError(key, null);
  setLoading(key, false);
  return { data };
}

const { setError } = useErrorStore.getState();

export const errorHandlingLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {

      const unsubscribe = next(op).subscribe({
        next(value) {
          setError(op.path, null);
          observer.next(value);
        },
        error(err) {
          setError(op.path, err.message ?? 'Wystąpił nieznany błąd');
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};