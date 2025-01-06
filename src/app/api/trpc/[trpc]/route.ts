import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "~/env.mjs";;
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const corsAllowed = ['common.amounts'];

const handler = async (req: NextRequest) => {
  if (corsAllowed.filter(url => req.url.includes(url)).length && req.method === "OPTIONS") {
    return new NextResponse("Cors Verified", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "Access-Control-Allow-Headers": "*"
      },
      status: 200
    });
  }
  const reqRes = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  })
  
  if (corsAllowed.filter(url => req.url.includes(url)).length) {
    reqRes.headers.set("Access-Control-Allow-Origin", "*");
    reqRes.headers.set("Access-Control-Request-Method", "*");
    reqRes.headers.set("Access-Control-Allow-Methods", "OPTIONS,GET");
    reqRes.headers.set("Access-Control-Allow-Headers", "*");
  };

  return reqRes;
}

export { handler as GET, handler as POST, handler as OPTIONS };
