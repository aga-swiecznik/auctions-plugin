import { AuctionType } from "~/models/AuctionType"

export const stringToType = (stringType: string) => {
  if (stringType === 'bricks') return AuctionType.bricks;
  if (stringType === 'buyNow') return AuctionType.buyNow;
  if (stringType === 'likes') return AuctionType.likes;
  return AuctionType.auction;
}