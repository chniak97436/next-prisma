import { prisma } from '@/lib/prisma';
import { success } from '@/lib/utils/response';
import nodemailer from 'nodemailer';
import { sendEmailRegister } from '@/lib/utils/sendEmailRegister';

export async function GET(req, { params }) {

  const { id } = await params

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: parseInt(id) }
  })
  return success({ newsletter });
}



