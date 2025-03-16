import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { FundraisingWithRole } from "~/models/Fundraising";
import { useEffect } from "react";

export const useFundraising = (): FundraisingWithRole | undefined => {
  const { fundraisingId } = useParams<{fundraisingId: string}>();
  const router = useRouter();
  const path = usePathname();

  const { data } = api.fundraisings.get.useQuery({ fundraisingId }, { enabled: !!fundraisingId });

  return data;
}