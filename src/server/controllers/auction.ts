import dayjs from "dayjs";
import { Auction } from "~/models/Auction";
import { AuctionType } from "~/models/AuctionType";
import { Status } from "~/models/Status";

const auctions = [
  {
    "id": "65b56a2611cd145932b6f702",
    "name": "irure voluptate commodo nulla magna",
    "endsAt": "2024-02-23T22:29:52.173Z",
    "createdAt": "2014-11-18T10:12:25.763Z",
    "updatedAt": "2014-11-19T10:12:25.763Z"
  },
  {
    "id": "65b56a2614e50dc6184fc76a",
    "name": "deserunt in velit elit aliqua",
    "endsAt": "2024-02-16T07:36:44.025Z",
    "createdAt": "2012-03-23T08:07:29.380Z",
    "updatedAt": "2012-03-24T08:07:29.380Z"
  },
  {
    "id": "65b56a269715d961f9c46761",
    "name": "proident irure ea esse sit",
    "endsAt": "2024-02-06T15:36:56.107Z",
    "createdAt": "2014-06-19T18:53:21.560Z",
    "updatedAt": "2014-06-20T18:53:21.560Z"
  },
  {
    "id": "65b56a2691025664d9944839",
    "name": "velit officia cillum voluptate sint",
    "endsAt": "2024-02-03T22:35:21.732Z",
    "createdAt": "2014-01-17T20:12:36.683Z",
    "updatedAt": "2014-01-18T20:12:36.683Z"
  },
  {
    "id": "65b56a269f7d84b2a148c07d",
    "name": "anim quis proident irure anim",
    "endsAt": "2024-02-25T01:16:19.239Z",
    "createdAt": "2014-12-17T11:00:54.403Z",
    "updatedAt": "2014-12-18T11:00:54.403Z"
  },
  {
    "id": "65b56a26e1e494ed0f16a4de",
    "name": "pariatur occaecat Lorem nulla tempor",
    "endsAt": "2024-02-08T06:09:26.348Z",
    "createdAt": "2014-09-05T02:27:21.356Z",
    "updatedAt": "2014-09-06T02:27:21.356Z"
  },
  {
    "id": "65b56a26e574d5dc765aa191",
    "name": "quis consectetur dolore nulla eu",
    "endsAt": "2024-02-17T14:53:38.437Z",
    "createdAt": "2012-06-17T12:20:22.498Z",
    "updatedAt": "2012-06-18T12:20:22.498Z"
  },
  {
    "id": "65b56a265201511b1c0b9156",
    "name": "exercitation occaecat Lorem sint mollit",
    "endsAt": "2024-02-07T03:06:01.339Z",
    "createdAt": "2014-01-12T19:46:36.115Z",
    "updatedAt": "2014-01-13T19:46:36.115Z"
  },
  {
    "id": "65b56a2612a6da89814ed25e",
    "name": "cillum culpa veniam sint labore",
    "endsAt": "2024-02-26T13:45:48.481Z",
    "createdAt": "2011-02-10T03:27:31.523Z",
    "updatedAt": "2011-02-11T03:27:31.523Z"
  },
  {
    "id": "65b56a26ddc1e7875a3282ef",
    "name": "dolor aute cupidatat exercitation labore",
    "endsAt": "2024-02-07T14:16:18.342Z",
    "createdAt": "2014-11-13T04:16:28.271Z",
    "updatedAt": "2014-11-14T04:16:28.271Z"
  },
  {
    "id": "65b56a2646b506606c3b39d4",
    "name": "laborum tempor ea labore do",
    "endsAt": "2024-02-22T20:23:19.267Z",
    "createdAt": "2013-06-12T19:19:02.887Z",
    "updatedAt": "2013-06-13T19:19:02.887Z"
  },
  {
    "id": "65b56a26f603d979d71f6c65",
    "name": "eu id ea esse ut",
    "endsAt": "2024-02-08T06:18:46.414Z",
    "createdAt": "2012-03-13T15:19:43.928Z",
    "updatedAt": "2012-03-14T15:19:43.928Z"
  }
];

export const list = (groupId: string): Auction[] => {
  return auctions.map(auction => ({
    ...auction,
    status: Status.new,
    createdAt: auction.createdAt,
    updatedAt: auction.updatedAt,
    endsAt: auction.endsAt,
    type: AuctionType.auction
  }))
}

export const get = (postId: string): Auction | undefined => {
  return auctions.map(auction => ({
    ...auction,
    status: Status.new,
    createdAt: auction.createdAt,
    updatedAt: auction.updatedAt,
    endsAt: auction.endsAt,
    type: AuctionType.auction
  }))[0]
}