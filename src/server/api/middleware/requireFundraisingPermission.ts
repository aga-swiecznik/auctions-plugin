import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  protectedProcedure,
} from "~/server/api/trpc";

export const fundraisingProcedure = protectedProcedure
    .input(z.object({ 
      fundraisingId: z.string(),
    }))
    .use(async ({ctx, input, next}) => {
    // fundraisingId can be in input or nested in input
    const fundraisingId = input.fundraisingId;
    if (!fundraisingId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing fundraisingId' });
    }

    const hasPermission = await ctx.db.fundraisingPermissions.findFirst({
        where: {
            fundraisingId,
            userId: ctx.session.user.id,
        },
    });

    if (!hasPermission) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have access to this fundraising.' });
    }

    return next();
});

export const adminProcedure = protectedProcedure.input(z.object({ 
    fundraisingId: z.string(),
  }))
  .use(async ({ctx, input, next}) => {
  // fundraisingId can be in input or nested in input
  const fundraisingId = input.fundraisingId;
  if (!fundraisingId) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing fundraisingId' });
  }

  // Example: check if user has access to this fundraising
  // Replace this with your actual permission logic
  const hasPermission = await ctx.db.fundraisingPermissions.findFirst({
      where: {
          fundraisingId,
          userId: ctx.session.user.id,
      },
  });

  if (!hasPermission) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have access to this fundraising.' });
  }

  if (!hasPermission.role || hasPermission.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have admin access to this fundraising.' });
  }

  return next();
});