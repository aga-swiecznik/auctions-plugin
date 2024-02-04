import { AuctionType } from "~/models/AuctionType"

export const typeToString = (type?: AuctionType) => {
  if (type === AuctionType.bricks) return 'bricks';
  if (type === AuctionType.buyNow) return 'buyNow';
  return 'auction';
}