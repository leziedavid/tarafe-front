"use client";


import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";
import Store from "@/components/store/Boutique";
import { getAllRealisations } from "@/service/realisationServices";
import { ApiResponse } from "@/types/interfaces";
import { useEffect, useState } from "react";

export default function Page() {

    const [response, setResponse] = useState<ApiResponse | null>(null);
    const getAllRealisation = async () => {
        const response = await getAllRealisations();
        if (response.statusCode === 200 && response.data) {
            setResponse(response.data); // 👈 DONNE DIRECTEMENT ApiResponse
        }
    };

    useEffect(() => {
        getAllRealisation();
    }, []);

    return (
        <>
            <Navbar />
            <Store />
            <Footer reglages={response?.reglages ?? []} />
        </>

    );
}
