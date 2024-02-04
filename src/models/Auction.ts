import { AuctionType } from "./AuctionType";
import { Status } from "./Status";

export interface Auction {
  id: string;
  name: string;
  endsAt: Date;
  type: AuctionType;
  createdAt: Date;
  updatedAt: Date;
  winnerAmount: number | null;
}

export interface EditAuctionDTO {
  id: string;
  name: string;
  endsAt: Date;
  winnerAmount?: number;
  type: AuctionType;
}

export interface CreateAuctionDTO {
  name: string;
  endsAt: Date;
  type?: AuctionType;
  winnerAmount?: number;
}