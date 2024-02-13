import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export const useAuctionMutation = (onSuccess?: () => void) => {
  const router = useRouter();
  return api.auction.update.useMutation({
    onSuccess: () => {
      router.refresh();
      onSuccess && onSuccess();
    }
  });
}