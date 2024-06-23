import { Auction } from "~/models/Auction"
import dayjs from "dayjs";

export const filterAuction = (filters: {
    status?: string | undefined,
    search?: string | undefined,
  }, auction: Omit<Auction, 'type'>) => {
    const today = dayjs();
    return (
      (!filters.search || auction.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.status ||
        (filters.status === "to-end" &&
          new Date() > auction.endsAt &&
          !auction.noOffers &&
          !((auction.winnerAmount ?? 0) > 0)) ||
        (filters.status === "ended" &&
          (auction.noOffers || (auction.winnerAmount ?? 0) > 0)) ||
        (filters.status === "no-offers" && auction.noOffers) ||
        (filters.status === "paid" && auction.paid) ||
        (filters.status === "not-paid" &&
          !auction.paid &&
          (auction.winnerAmount ?? 0) > 0) ||
        (filters.status === "overdue" &&
          !auction.paid &&
          (auction.winnerAmount ?? 0) > 0 &&
          today.diff(auction.endsAt, "day") > 2) ||
        (filters.status === "to-delete" &&
          ((auction.paid && today.diff(auction.endsAt, "day") > 14) ||
            (auction.noOffers && today.diff(auction.endsAt, "day") > 2))) ||
            filters.status === "archived") &&
      (filters.status === "archived" ? auction.archived : auction.archived === false)
  )}