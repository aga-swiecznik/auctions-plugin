import { TRPCLink } from "@trpc/client";
import { AppRouter } from "~/server/api/root";
import { observable } from "@trpc/server/observable";
import { useErrorStore } from "~/app/store/errorState";

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
