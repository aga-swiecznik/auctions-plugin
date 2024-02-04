import { AuctionType } from "~/models/AuctionType"

export const stringToType = (stringType: string) => {
  if (stringType === 'bricks') return AuctionType.bricks;
  if (stringType === 'buyNow') return AuctionType.buyNow;
  return AuctionType.auction;
}