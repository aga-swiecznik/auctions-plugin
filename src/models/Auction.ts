import { AuctionType } from "./AuctionType";

export interface Auction {
  id: string;
  link: string;
  name: string;
  author: { id: string, name: string };
  notes?: string | null;
  paid: boolean;
  noOffers: boolean;
  collected: boolean;
  archived: boolean;
  endsAt: Date;
  type: AuctionType;
  createdAt: Date;
  updatedAt: Date;
  winnerAmount?: number | null;
  winnerName?: string | null;
}

export interface AuctionDTO {
  id: string;
  author: { id: string, name: string };
  link: string;
  name: string;
  notes?: string | null;
  endsAt: string;
  winnerName?: string | null;
  winnerAmount?: number | null;
  type: AuctionType;
}

export interface EditAuctionDTO {
  id: string;
  author?: string;
  link?: string;
  name?: string;
  notes?: string | null;
  endsAt?: string;
  winnerName?: string | null;
  winnerAmount?: number | null;
  type?: AuctionType;
}

export interface EditFormAuctionDTO {
  id: string;
  link: string;
  name: string;
  author: string;
  notes?: string | null;
  endsAt: string;
  winnerName?: string | null;
  winnerAmount?: number | null;
  type: AuctionType;
}

export interface CreateAuctionDTO {
  link: string;
  name: string;
  author: string;
  notes?: string | null;
  endsAt: string;
  type?: AuctionType;
  winnerAmount?: number | null;
  winnerName?: string | null;
}