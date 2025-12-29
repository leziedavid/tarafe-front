'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { getBaseUrlImg } from '@/servives/baseUrl';
import { Newsletter } from '@/interfaces/AdminInterface';


type MessgesProps = {
    isOpen: boolean;
    onClose: () => void;
    Data: Newsletter;
};



export default function MessgesModal({ isOpen, onClose, Data }: MessgesProps) {


    return (
        <div className={`fixed inset-0 bg-black/50 z-50 ${!isOpen && 'hidden'}`}>
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0 w-full md:w-[50vw]' : 'translate-x-full'} bg-white dark:bg-gray-800 shadow-xl duration-300 ease-in-out`}
                aria-labelledby="drawer-right-label">
                <h5 className="inline-flex items-center mb-4 text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Message envoyé par {Data?.nom_newsletters ?? ''}
                </h5>

                <Button type="button" className="text-gray-400 bg-red-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={onClose} > X
                    <span className="sr-only">Fermer</span>
                </Button>

                <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="max-w-3xl text-xl uppercase tracking-tight font-title">
                            OBJET : {Data.objets}
                        </h3>
                        <h4 className="max-w-3xl text-xl  tracking-tight font-title mb-6">
                            EMAIL : {Data.email_newsletters}
                        </h4>
                        <div className="flex flex-col gap-1 text-3xl font-bold">Message </div>
                        <p className="max-w-3xl text-muted-foreground text-base">
                            {Data.texte_newsletters}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
