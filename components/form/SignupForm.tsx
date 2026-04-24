"use client";

import { useState } from 'react';
import { Icon } from "@iconify/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/interfaces';
import { register as registerUser } from '@/service/security';
import { Select2 } from './Select2';

const signupSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    contact: z.string().min(1, "Le contact est requis"),
    email: z.string().email("Email invalide"),
    password: z.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .max(10, "Le mot de passe ne doit pas dépasser 10 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
    role: z.string().min(1, "Le rôle est requis"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { role: "Clients" }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const roleOptions = [
        { value: Role.VENDOR, label: "Vendeurs" },
        { value: Role.MANAGER, label: "Gestionnaire" },
        { value: Role.CLIENT, label: "Clients" },
    ];

    const onSubmit = async (data: SignupFormValues) => {
        try {
            // On mappe 'role' vers 'is_admin' pour Laravel
            const payload = {
                name: data.name,
                contact: data.contact,
                email: data.email,
                password: data.password,
                is_admin: data.role,
                status: 1 // Actif par défaut
            };

            const res = await registerUser(payload);

            if (res.statusCode === 201 || res.statusCode === 200) {
                toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
                router.push('/auth/login');
                reset();
            } else {
                toast.error(res.message || "Une erreur est survenue lors de l'inscription");
            }
        } catch (error) {
            toast.error("Erreur réseau, veuillez réessayer plus tard");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">CRÉER UN COMPTE</h1>
            <p className="text-gray-600 mb-8">
                Inscrivez-vous pour commencer à utiliser Tarafé
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Name */}
                <div className="relative">
                    <Icon icon="solar:user-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width={20} height={20} />
                    <Input id="name" type="text" placeholder="Nom complet" className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}  {...register('name')} />
                </div>
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}

                {/* Contact */}
                <div className="relative">
                    <Icon icon="solar:phone-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width={20} height={20} />
                    <Input
                        id="contact"
                        type="text"
                        placeholder="Numéro de téléphone"
                        className={`pl-10 ${errors.contact ? 'border-red-500' : ''}`}
                        {...register('contact')}
                    />
                </div>
                {errors.contact && <p className="text-red-600 text-xs mt-1">{errors.contact.message}</p>}

                {/* Email */}
                <div className="relative">
                    <Icon icon="solar:letter-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width={20} height={20} />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        {...register('email')}
                    />
                </div>
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}

                {/* Password */}
                <div className="relative">
                    <Icon icon="solar:lock-password-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width={20} height={20} />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mot de passe (6-10 caractères)"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <Icon icon="solar:eye-closed-bold" width={20} height={20} /> : <Icon icon="solar:eye-bold" width={20} height={20} />}
                    </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}

                {/* Confirm Password */}
                <div className="relative">
                    <Icon icon="solar:lock-password-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width={20} height={20} />
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmer le mot de passe"
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        {...register('confirmPassword')}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? <Icon icon="solar:eye-closed-bold" width={20} height={20} /> : <Icon icon="solar:eye-bold" width={20} height={20} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}

                {/* Role with Select2 */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Type de compte</label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select2
                                options={roleOptions}
                                labelExtractor={(opt) => opt.label}
                                valueExtractor={(opt) => opt.value}
                                placeholder="Choisir un rôle"
                                selectedItem={field.value}
                                onSelectionChange={(val) => field.onChange(val)}
                            />
                        )}
                    />
                </div>
                {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role.message}</p>}

                <div className="pt-2">
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#B07B5E] hover:bg-green-900 h-11">
                        {isSubmitting ? 'Création...' : 'S\'inscrire'}
                    </Button>
                </div>

                <Link href="/" className="inline-block w-full px-4 py-2 text-center bg-white text-green-800 border border-green-800 rounded hover:bg-[#B07B5E] hover:text-white transition-colors duration-200 text-sm">
                    Accueil
                </Link>

            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Vous avez déjà un compte ? </span>
                <Link href="/auth/login" className="text-[#B07B5E] font-bold hover:underline" >
                    Se connecter
                </Link>
            </div>
        </div>
    );
}
