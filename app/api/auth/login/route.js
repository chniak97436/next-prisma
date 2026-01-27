import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/utils/jwt';
import { validatePassword, validateEmail } from '@/lib/utils/validation';
import { success, badRequest, unauthorized, notFound, internalServerError } from '@/lib/utils/response';
import { isAdmin } from '@/lib/utils/auth';

export async function POST(req) {
    try
    {
        const body = await req.json();
        const { email, password } = body;

        // 1. validation
        if(!validateEmail(email) || !password ){
            return badRequest('Format d\'email ou mot de passe invalide.');
        }

        // 2. Check si user exists
        const existingUser = await prisma.user.findUnique({
            where: { email  },
        });

        if(!existingUser) {
            return notFound('Utilisateur non trouvé. Veuillez vérifier vos informations.');
        }
        // 3. Compare password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);
        if(!isPasswordValid) {
            return unauthorized('Mot de passe incorrect. Veuillez réessayer.');
        }

        // 4. Check if email is verified
        if (!existingUser.emailVerified) {
            return unauthorized('Votre email n\'a pas été vérifié. Veuillez vérifier votre email avant de vous connecter.');
        }

        // 5. Generate JWT
        const token = signToken({ 
            userId: existingUser.id,
            name: existingUser.username,
            email: existingUser.email,
            role: existingUser.role
        });

        const responseData = { 
            message: 'Login successful', 
            token, 
            ok: true 
        };

        if(isAdmin(existingUser.role)){
            responseData.message = 'Login successful admin';
            responseData.role = 'admin';
        }

        return success(responseData);

    }catch (error) {
        console.error('Login error:', error);
        return internalServerError('Internal Server Error');
    }
    
}