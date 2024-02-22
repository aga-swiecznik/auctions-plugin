import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export const useAuctionMutation = (onSuccess?: () => void) => {
  const router = useRouter();
  const pathName = usePathname();
  return api.auction.update.useMutation({
    onSuccess: () => {
      const editPath = pathName.split('/');
      if(editPath.length === 2) {
        router.refresh();
      } else {
        router.push(`/${editPath[1]}?u=1`)
      }
      onSuccess && onSuccess();
    }
  });
}