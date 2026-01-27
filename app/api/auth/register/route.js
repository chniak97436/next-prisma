import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signVerificationToken } from '@/lib/utils/jwt';
import { validatePassword, validateEmail } from '@/lib/utils/validation';
import { success, badRequest, conflict, internalServerError } from '@/lib/utils/response';
import { sendEmailRegister } from '@/lib/utils/sendEmailRegister';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 1. validation
    if (!username || !email || !password) {
      return badRequest('Tous les champs sont requis.');
    }
    if (!validateEmail(email)) {
      return badRequest('Format d\'email invalide.');
    }
    if (!validatePassword(password)) {
      return badRequest('Le mot de passe ne respecte pas les critères de sécurité.');
    }

    // 2. Check si user exists deja
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return conflict('Un utilisateur avec cet email existe déjà.');
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword
      },
    });

    // 5. Generer lle JWT for email verification
    const verificationToken = signVerificationToken({
      userId: newUser.id,
      name: newUser.username,
      email: newUser.email,
      role: newUser.role
    });

    // verification email (simulation)
    const verificationUrl = `http://localhost:3001/api/auth/verify-email?token=${verificationToken}`;
    console.log(` Lien de vérification (pour le dev): ${verificationUrl}`);
    // Optionally send email
    await sendEmailRegister(
      newUser.email,
      'Confirmation de votre inscription',
      'Merci de vous être inscrit! Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email:',
      verificationUrl
    );
    // 7. Return a success response
    return success({
      success: true,
      message: 'Inscription réussie. Veuillez consulter votre console pour le lien de vérification.'
    }, 201);

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return internalServerError('Une erreur est survenue sur le serveur.');
  }
}
