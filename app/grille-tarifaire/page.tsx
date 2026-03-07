"use client";

import React, { useEffect, useState } from "react";
import PricingSection from "@/components/home/PricingSection";
import { Pricing, Reglage } from "@/types/interfaces";
import { getAllPricing } from "@/service/managementServices";
import Navbar from "@/components/page/Navbar";


const GrilleTarifaire = () => {
    const [pricingList, setPricingList] = useState<Pricing[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [reglages, setReglages] = useState<Reglage[]>([]);

    // getAllPricing

    useEffect(() => {
        getAllPricing().then((response) => {
            if (response.statusCode === 200 && response.data) {
                setPricingList(response.data.data);
                setLoading(false);
            }
        });
    }, []);

    return (
        <>
            <Navbar />
            {/* <pre>{JSON.stringify(pricingList, null, 2)}</pre> */}
            <PricingSection pricing={pricingList} isLoading={loading} />

        </>
    );
};

export default GrilleTarifaire;