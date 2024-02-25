import { withTRPC } from "@trpc/next";
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export const useAuctionMutation = (onSuccess?: () => void) => {
  const router = useRouter();
  const pathName = usePathname();
  const utils = api.useUtils();
  return api.auction.update.useMutation({
    onSuccess: () => {
      const editPath = pathName.split('/');
      utils.auction.invalidate();
      if(editPath.length !== 2) {
        router.push(`/${editPath[1]}?u=${(new Date()).getTime()}`)
      }
      onSuccess && onSuccess();
    }
  });
}