"use client";


import { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/interfaces';
import { login } from '@/service/security';
import { setTokenToLocalStorage, setUserDataToLocalStorage } from '@/app/middleware';
import { useCart } from '@/app/context/CartProvider';


const loginSchema = z.object({
    identifier: z.string().min(1, "Le login est requis"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const { countAllItems } = useCart();
    const cartItems = countAllItems();


    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), });

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await login(data.identifier, data.password); // Passer les bons arguments

            if (res.statusCode === 200 && res.data) {
                const { user, token, stores } = res.data; // Récupérer stores également
                // Sauvegarder le token
                setTokenToLocalStorage(res.data.token)
                // Sauvegarder les données utilisateur
                const userData = {
                    id: res.data.user.id,
                    name: res.data.user.name ?? '',
                    email: res.data.user.email,
                    roles: res.data.user.is_admin ?? '',
                    status: res.data.user.status,
                    stores: res.data.stores || []
                }
                setUserDataToLocalStorage(userData)
                // 🔐 Rôle utilisateur
                const role = user.is_admin;

                if (role !== Role.ADMIN && cartItems > 0) {
                    toast.success("Finalisez votre paiement 🛒");
                    router.push('/checkout');
                    return;
                }

                switch (role) {
                    case Role.ADMIN:
                    case Role.VENDOR:
                    case Role.MANAGER:
                        router.push('/dashboard');
                        break;
                    case Role.CLIENT:
                        router.push('/mon-compte');
                        break;
                    default:
                        router.push('/');
                        break;
                }

                reset(); // Réinitialisation du formulaire
            } else if (res.statusCode === 400) {
                toast.error(res.message || 'Informations incorrectes');
            } else if (res.statusCode === 500) {
                toast.error('Erreur serveur, veuillez réessayer');
            } else if (res.statusCode === 401) {
                toast.error(res.message || 'Identifiants invalides');
            } else {
                toast.error('Erreur inconnue');
            }
        } catch (error) {
            toast.error('Une erreur est survenue lors de la connexion');
        }
    };


    return (

        <div>
            <h1 className="text-3xl font-bold mb-2">SE CONNECTER</h1>
            <p className="text-gray-600 mb-8">
                Veuillez entrer vos informations de connexion pour accéder à votre compte
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        id="login"
                        type="text"
                        placeholder="Numéro de téléphone / login"
                        className="pl-10"
                        aria-invalid={!!errors.identifier}
                        aria-describedby="login-error"
                        {...register('identifier')}
                    />
                </div>
                {errors.identifier && (
                    <p id="login-error" className="text-red-600 text-sm mt-1">
                        {errors.identifier.message}
                    </p>
                )}

                {/* Password */}
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe"
                        className="pr-10"
                        aria-invalid={!!errors.password}
                        aria-describedby="password-error"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p id="password-error" className="text-red-600 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#B07B5E] hover:bg-green-900">
                    {isSubmitting ? 'Connexion...' : 'Suivant'}
                </Button>

                <Link href="/" className="inline-block w-full px-4 py-1 text-center bg-white text-green-800 border border-green-800 rounded hover:bg-[#B07B5E] hover:text-white transition-colors duration-200">
                    Accueil
                </Link>

            </form>
            <div className="flex items-center justify-between mt-4 text-sm">

                <Link href="/auth/forgot-password" className="text-[#B07B5E] hover:underline" >
                    Mot de passe oublié ?
                </Link>

                <Link href="/auth/signup" className="text-[#B07B5E] hover:underline" >
                    Créer un compte
                </Link>
            </div>

        </div>
    );
}
