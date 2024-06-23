import { filterAuction } from '../filterAuctions'
import { AuctionType } from '../../../models/AuctionType'
import dayjs from "dayjs";
 
describe('filterAuctions', () => {
  const today = dayjs();
  const baseAuction = {
    id: '1', 
    link: 'https://link.com/1',
    orderNumber: 1,
    name: 'Auction Name',
    author: { id: '1', name: '1' },
    paid: false,
    noOffers: false,
    noOffersYet: false,
    collected: false,
    archived: false,
    endsAt: today.add(1, 'day').toDate(),
    type: AuctionType.auction,
    createdAt: new Date(2024, 3, 1),
    updatedAt: new Date(2024, 3, 1),
    admin: {id: '1', name: '1', email: '1', password: 'password'}
  }

  test('should filter by search term', () => {
    const filters = { search: 'test' };
    const auction = { ...baseAuction, name: 'Test Auction' };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, name: 'Different Auction' };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
  });

  test('should filter by status "to-end"', () => {
    const filters = { status: 'to-end' };
    const auction = { ...baseAuction, endsAt: today.subtract(1, 'day').toDate() };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, endsAt: today.add(1, 'day').toDate() };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
  });

  test('should filter by status "ended"', () => {
    const filters = { status: 'ended' };
    const auction = { ...baseAuction, noOffers: true };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionWithWinner = { ...baseAuction, winnerAmount: 100 };
    expect(filterAuction(filters, auctionWithWinner)).toBe(true);

    const auctionNoMatch = { ...baseAuction, noOffers: false, winnerAmount: 0 };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);

    const auctionNoMatch2 = { ...baseAuction, noOffers: false, winnerAmount: null };
    expect(filterAuction(filters, auctionNoMatch2)).toBe(false);
  });

  test('should filter by status "no-offers"', () => {
    const filters = { status: 'no-offers' };
    const auction = { ...baseAuction, noOffers: true };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, noOffers: false };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
  });

  test('should filter by status "paid"', () => {
    const filters = { status: 'paid' };
    const auction = { ...baseAuction, paid: true };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, paid: false };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
  });

  test('should filter by status "not-paid"', () => {
    const filters = { status: 'not-paid' };
    const auction = { ...baseAuction, paid: false, winnerAmount: 100 };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, paid: true, winnerAmount: 100 };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);

    const auctionNoMatch2 = { ...baseAuction, paid: false, winnerAmount: null };
    expect(filterAuction(filters, auctionNoMatch2)).toBe(false);

  });

  test('should filter by status "overdue"', () => {
    const filters = { status: 'overdue' };
    const auction = { ...baseAuction, endsAt: today.subtract(3, 'days').toDate(), winnerAmount: 100, paid: false };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, endsAt: today.subtract(1, 'day').toDate(), winnerAmount: 100, paid: false };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
    
    const auctionNoMatch2 = { ...baseAuction, endsAt: today.subtract(1, 'day').toDate(), winnerAmount: null, paid: false };
    expect(filterAuction(filters, auctionNoMatch2)).toBe(false);
  });

  test('should filter by status "to-delete"', () => {
    const filters = { status: 'to-delete' };
    const auction = { ...baseAuction, paid: true, endsAt: today.subtract(15, 'days').toDate() };
    expect(filterAuction(filters, auction)).toBe(true);

    const auction2 = { ...baseAuction, noOffers: true, endsAt: today.subtract(3, 'days').toDate() };
    expect(filterAuction(filters, auction2)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, paid: true, endsAt: today.subtract(13, 'days').toDate() };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
    
    const auctionNoMatch2 = { ...baseAuction, noOffers: true, endsAt: today.subtract(1, 'days').toDate() };
    expect(filterAuction(filters, auctionNoMatch2)).toBe(false);
  });

  test('should filter by status "archived"', () => {
    const filters = { status: 'archived' };
    const auction = { ...baseAuction, archived: true };
    expect(filterAuction(filters, auction)).toBe(true);
    
    const auctionNoMatch = { ...baseAuction, archived: false };
    expect(filterAuction(filters, auctionNoMatch)).toBe(false);
  });

  test('should return true if no filters are applied', () => {
    const filters = {};
    const auction = { ...baseAuction };
    expect(filterAuction(filters, auction)).toBe(true);
  });

  test('should return false if search term does not match and no other filters are applied', () => {
    const filters = { search: 'nonexistent' };
    const auction = { ...baseAuction };
    expect(filterAuction(filters, auction)).toBe(false);
  });

  test('should return false if none of the status filters match', () => {
    const filters = { status: 'ended' };
    const auction = { ...baseAuction, noOffers: false, winnerAmount: 0 };
    expect(filterAuction(filters, auction)).toBe(false);
  });
});