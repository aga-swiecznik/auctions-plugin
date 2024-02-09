import { AuctionType } from "./AuctionType";
import { Status } from "./Status";

export interface Auction {
  id: string;
  name: string;
  notes?: string | null;
  endsAt: Date;
  type: AuctionType;
  createdAt: Date;
  updatedAt: Date;
  winnerAmount?: number | null;
  winnerName?: string | null;
}

export interface EditAuctionDTO {
  id: string;
  name: string;
  notes?: string | null;
  endsAt: string;
  winnerName?: string | null;
  winnerAmount?: number | null;
  type: AuctionType;
}

export interface CreateAuctionDTO {
  name: string;
  notes?: string | null;
  endsAt: string;
  type?: AuctionType;
  winnerAmount?: number | null;
  winnerName?: string | null;
}