import { AuctionType } from "./AuctionType";
import { Status } from "./Status";

export interface Auction {
  id: string;
  name: string;
  endsAt: string;
  status: Status;
  type: AuctionType;
  createdAt: string;
  updatedAt: string;
}