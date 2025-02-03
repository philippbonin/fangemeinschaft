import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    if (!await isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return new Response('Match ID is required', { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const currentActive = await tx.nextMatch.findFirst({
        where: { active: true }
      });

      if (currentActive) {
        await tx.nextMatchHistory.create({
          data: {
            matchId: currentActive.matchId,
            ticketLink: currentActive.ticketLink,
            moreInfoContent: currentActive.moreInfoContent,
            activatedAt: currentActive.createdAt,
            deactivatedAt: new Date()
          }
        });

        await tx.nextMatch.update({
          where: { id: currentActive.id },
          data: { active: false }
        });
      }

      await tx.nextMatch.update({
        where: { id },
        data: { active: true }
      });
    });

    return redirect('/admin/next-match/edit');
  } catch (error) {
    console.error('Error activating next match:', error);
    return new Response('Error activating next match', { status: 500 });
  }
};