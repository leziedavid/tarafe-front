'use client';

import React from 'react';
import Image from 'next/image';
import LoginForm from '@/components/form/LoginForm';


export default function LoginPage() {

    return (


        <>

            <div className="flex min-h-full h-screen">
                <div className="flex flex-1 flex-col justify-center py-0 px-6 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="">
                            <LoginForm />
                        </div>
                    </div>
                </div>

                <div className="relative hidden w-0 flex-1 lg:block">
                    <div className="absolute inset-0 h-full w-full">
                        <Image src="/auth.jpeg" alt="" fill className="object-cover brightness-50" style={{ objectFit: 'cover' }} />
                    </div>
                </div>
            </div>
        </>

    );
}


