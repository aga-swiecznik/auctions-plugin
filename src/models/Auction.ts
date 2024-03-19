import { User } from "@prisma/client";
import { AuctionType } from "./AuctionType";

export interface Auction {
  id: string;
  link: string;
  orderNumber: number;
  name: string;
  author: { id: string, name: string };
  notes?: string | null;
  paid: boolean;
  noOffers: boolean;
  noOffersYet: boolean;
  collected: boolean;
  archived: boolean;
  endsAt: Date;
  type: AuctionType;
  createdAt: Date;
  updatedAt: Date;
  winnerAmount?: number | null;
  winner?: { id: string, name: string } | null;
  admin: User;
}

export interface AuctionDTO {
  id: string;
  author: { id: string, name: string };
  link: string;
  name: string;
  notes?: string | null;
  endsAt: string;
  winner?: { id: string, name: string } | null;
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
  winner?: string | null;
  winnerAmount?: number | null;
  type?: AuctionType;
  noOffers?: boolean;
  noOffersYet?: boolean;
}

export interface EditFormAuctionDTO {
  id: string;
  link: string;
  name: string;
  author: string;
  notes?: string | null;
  endsAt: string;
  winner?: string | null;
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
  winner?: string | null;
}