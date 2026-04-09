"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Leaf, Recycle, Trash2, Briefcase, Package, Users, CheckCircle, ArrowRight, Globe, Award, Heart, QrCode as QrIcon, ChevronDown, Info } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import Image from "next/image";

// Pre-existing components (adjust if necessary)
import Navbar from "@/components/page/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- Presentation Components ---

const Slide = ({ children, id, className = "", bgColor = "bg-background" }: {
    children: React.ReactNode,
    id: string,
    className?: string,
    bgColor?: string
}) => {
    return (
        <section id={id} className={`h-screen w-full snap-start flex flex-col items-center justify-center relative px-6 md:px-20 overflow-hidden ${bgColor} ${className}`}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full max-w-6xl mx-auto">
                {children}
            </motion.div>
        </section>
    );
};

const ProgressIndicator = ({ sections, activeIndex }: { sections: string[], activeIndex: number }) => {
    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden md:flex">
            {sections.map((section, i) => (
                <Link key={section} href={`#${section}`} title={section} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === i ? "bg-brand-primary h-8" : "bg-muted-foreground/30 hover:bg-brand-primary/50"}`} />
            ))}
        </div>
    );
};

export default function PresentationTarafe() {
    const catalogueUrl = "https://tarafe.com/catalogue/Catalogue_taraf%C3%A9_2024.pdf";
    const [activeIndex, setActiveIndex] = useState(0);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const sections = ["hero", "intro", "mission", "problem", "solution", "impact", "activities", "action", "qrcode", "conclusion"];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            const height = window.innerHeight;
            const index = Math.round(scrollPos / height);
            setActiveIndex(index);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-background selection:bg-brand-primary selection:text-white scroll-smooth hide-scrollbar">
            {/* Scroll Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-brand-primary z-[60] origin-left" style={{ scaleX }} />

            {/* Subtle Navbar */}
            <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="pointer-events-auto">
                        <div className="relative w-32 h-10">
                            <Image src="/ads/logos2.png" alt="Logo" fill className="object-contain" priority />
                        </div>
                    </Link>
                    <div className="flex gap-4 pointer-events-auto">
                        <Button variant="ghost" size="sm" className="hidden md:flex rounded-full text-xs uppercase tracking-widest font-bold" asChild>
                            <Link href="/">Quitter la présentation</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <ProgressIndicator sections={sections} activeIndex={activeIndex} />

            {/* 1. HERO SLIDE */}
            <Slide id="hero" bgColor="bg-gradient-to-br from-tarafe-mint/20 via-background to-brand-primary/5">
                <div className="text-center space-y-6">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
                        <Badge className="mb-4 bg-brand-primary text-white border-none py-1.5 px-4 rounded-full uppercase tracking-[0.2em] text-[10px] font-black">
                            Présentation Interactive
                        </Badge>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black text-tarafe-black dark:text-white leading-[1.1]">
                        🎤 <span className="text-brand-primary">TARAFÉ</span> <br />
                        <span className="text-4xl md:text-5xl font-light opacity-80">Développement Durable</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Journée de l’Éducation au Développement Durable <br />
                        <span className="text-sm opacity-60">Session 2024</span>
                    </p>

                    <div className="pt-10 flex flex-col items-center gap-6">
                        <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-full px-12 py-8 text-xl font-black shadow-2xl shadow-brand-primary/30 transition-all hover:scale-105 active:scale-95 group" asChild>
                            <Link href="#intro"> Démarrer la présentation
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-muted-foreground/40 text-sm flex flex-col items-center gap-2">
                            <span>Défilez pour voir les slides</span>
                            <ChevronDown size={20} />
                        </motion.div>
                    </div>
                </div>

                {/* Floating Icons */}
                <div className="absolute top-1/4 right-0 text-tarafe-mint/10 -z-10 rotate-12">
                    <Leaf size={400} />
                </div>
            </Slide>

            {/* 2. INTRODUCTION SLIDE */}
            <Slide id="intro" bgColor="bg-white dark:bg-zinc-950">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-5xl md:text-6xl font-black leading-tight">
                            Bonjour <span className="text-brand-primary">à toutes et à tous</span>,
                        </h2>
                        <div className="w-20 h-2 bg-brand-primary rounded-full" />
                        <p className="text-2xl text-muted-foreground leading-relaxed">
                            Nous sommes <span className="font-black text-tarafe-black dark:text-white">TARAFÉ</span>. <br />
                            Une initiative engagée pour la protection de notre environnement via la valorisation des déchets textiles.
                        </p>
                    </div>
                    <div className="relative aspect-square rounded-[60px] bg-tarafe-mint/20 overflow-hidden flex items-center justify-center border-4 border-tarafe-mint/30 shadow-2xl">
                        <div className="p-12 text-center space-y-4">
                            <Globe size={120} className="text-tarafe-mint mx-auto mb-6" />
                            <h3 className="text-3xl font-black text-tarafe-mint">Impact Local, <br /> Vision Globale</h3>
                        </div>
                        {/* Decorative Pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    </div>
                </div>
            </Slide>

            {/* 3. MISSION SLIDE */}
            <Slide id="mission" bgColor="bg-tarafe-mint/10">
                <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Notre double mission</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-2xl bg-white dark:bg-white/5 rounded-[40px] p-8 md:p-12 hover:scale-[1.02] transition-transform">
                        <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 flex items-center justify-center mb-8">
                            <Heart className="text-brand-primary w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Valorisation</h3>
                        <p className="text-xl text-muted-foreground">Donner une seconde vie aux tissus usagés et freiner le gaspillage textile.</p>
                    </Card>
                    <Card className="border-none shadow-2xl bg-white dark:bg-white/5 rounded-[40px] p-8 md:p-12 hover:scale-[1.02] transition-transform">
                        <div className="w-20 h-20 rounded-3xl bg-tarafe-mint/20 flex items-center justify-center mb-8">
                            <Award className="text-tarafe-mint w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Transformation</h3>
                        <p className="text-xl text-muted-foreground">Créer des produits utiles, durables et profondément responsables.</p>
                    </Card>
                </div>
            </Slide>

            {/* 4. PROBLEM SLIDE */}
            <Slide id="problem" bgColor="bg-tarafe-black text-white">
                <div className="space-y-16 text-center max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <Badge variant="destructive" className="bg-red-500 text-white border-none py-1 px-4 rounded-full uppercase font-black text-[10px]">Urgence</Badge>
                        <h2 className="text-5xl md:text-7xl font-black">♻️ Le <span className="text-red-500">Problème</span></h2>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { title: "2ème secteur polluant", desc: "L’industrie de la mode impacte massivement la planète", icon: <Trash2 /> },
                            { title: "Tonnes de déchets", desc: "Des milliers de tonnes de tissus finissent en décharge", icon: <Package /> },
                            { title: "Gaspillage Inutile", desc: "Beaucoup de ressources sont jetées sans être recyclées", icon: <Recycle /> }
                        ].map((item, i) => (
                            <motion.div key={i} whileHover={{ x: 20 }} className="flex items-center gap-8 bg-white/5 border border-white/10 p-8 rounded-3xl text-left">
                                <div className="p-4 bg-red-500/20 rounded-2xl text-red-500 shrink-0">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black uppercase tracking-tight text-white">{item.title}</h4>
                                    <p className="text-lg text-black">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Slide>

            {/* 5. SOLUTION SLIDE */}
            <Slide id="solution" bgColor="bg-white dark:bg-black">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <Badge className="bg-tarafe-mint/20 text-tarafe-mint border-none py-1 px-4 rounded-full font-black">Innovation</Badge>
                        <h2 className="text-5xl md:text-7xl font-black">🌱 Notre <br /><span className="text-tarafe-mint">Solution</span></h2>
                        <div className="text-3xl font-black italic border-l-8 border-tarafe-mint pl-6 py-2 text-tarafe-black dark:text-white">
                            "Upcycling"
                        </div>
                        <p className="text-xl text-muted-foreground max-w-md">
                            Le recyclage créatif pour donner plus de valeur aux matériaux existants.
                            <strong>Ne pas produire plus, mais mieux utiliser.</strong>
                        </p>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                        {[
                            { label: "Sacs", sub: "Tissus recyclés", color: "bg-orange-50" },
                            { label: "Trousses", sub: "Éco-responsables", color: "bg-blue-50" },
                            { label: "Pochettes", sub: "Durables", color: "bg-green-50" },
                            { label: "Textile", sub: "Artisanal", color: "bg-purple-50" }
                        ].map((item, i) => (
                            <div key={i} className="aspect-square bg-white dark:bg-white/5 border border-border rounded-[40px] flex flex-col items-center justify-center p-6 text-center shadow-xl hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-2xl mb-4 bg-muted/20 flex items-center justify-center">
                                    <Info size={24} className="opacity-40" />
                                </div>
                                <h4 className="text-xl font-black">{item.label}</h4>
                                <p className="text-xs uppercase tracking-widest opacity-50">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Slide>

            {/* 6. IMPACT SLIDE */}
            <Slide id="impact" bgColor="bg-brand-secondary text-white">
                <div className="text-center space-y-12">
                    <h2 className="text-5xl font-black">🤝 Engagement & Impact</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { title: "Zéro Déchet", icon: <Recycle className="w-8 h-8" />, label: "Réduction massive" },
                            { title: "Éducation", icon: <Users className="w-8 h-8" />, label: "Sensibilisation active" },
                            { title: "Qualité", icon: <CheckCircle className="w-8 h-8" />, label: "Conception éthique" }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="w-full md:w-80 bg-white/10 backdrop-blur-xl p-10 rounded-[50px] border border-white/20 text-center space-y-4 shadow-2xl"
                            >
                                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                                    {card.icon}
                                </div>
                                <h4 className="text-3xl font-black text-white">{card.title}</h4>
                                <p className="text-white/80 font-medium uppercase text-xs tracking-widest">{card.label}</p>
                            </motion.div>
                        ))}
                    </div>
                    <div className="pt-12 text-sm font-black tracking-[0.5em] opacity-30 flex justify-center gap-10">
                        <span>RSE</span>
                        <span>DURABILITÉ</span>
                        <span>ÉCORECUP</span>
                    </div>
                </div>
            </Slide>

            {/* 7. ACTIVITIES SLIDE */}
            <Slide id="activities" bgColor="bg-zinc-50 dark:bg-zinc-900">
                <div className="flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 relative order-2 md:order-1">
                        <div className="absolute -inset-10 bg-brand-primary/10 blur-[100px] rounded-full" />
                        <div className="relative border-2 border-dashed border-brand-primary/30 p-16 rounded-[60px] flex items-center justify-center transform -rotate-3 bg-white dark:bg-white/5 shadow-2xl group">
                            <div className="absolute -top-6 -left-6 bg-brand-primary text-white p-6 rounded-3xl shadow-xl font-black rotate-12">NOS ACTIONS</div>
                            <Briefcase size={180} className="text-brand-primary group-hover:scale-110 transition-all duration-500" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-8 order-1 md:order-2">
                        <h2 className="text-5xl font-black leading-tight">Ce que nous faisons <span className="text-brand-primary">concrètement</span></h2>
                        <div className="space-y-6">
                            {[
                                "Collecte de tissus post-consommation",
                                "Transformation artisanale & locale",
                                "Sensibilisation publique et scolaire",
                                "Réduction de l'empreinte carbone locale"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-4 text-xl font-bold bg-white dark:bg-white/5 p-5 rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-brand-primary/20">
                                    <span className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-sm shrink-0">{i + 1}</span>
                                    {text}
                                </div>
                            ))}
                        </div>
                        <div className="bg-tarafe-mint/10 border-2 border-tarafe-mint/30 p-8 rounded-[40px] flex items-center gap-6 shadow-xl">
                            <div className="w-16 h-16 rounded-3xl bg-tarafe-mint/40 flex items-center justify-center text-tarafe-mint shrink-0">
                                <Package size={32} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-tarafe-mint">Projet : Bac de collecte 💚</p>
                                <p className="text-sm opacity-60">Installation prochaine sur sites éco-responsables</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Slide>

            {/* 8. ACTION SLIDE */}
            <Slide id="action" bgColor="bg-brand-primary text-white">
                <div className="text-center space-y-16 max-w-5xl mx-auto">
                    <h2 className="text-5xl md:text-8xl font-black leading-tight">Agissons <span className="text-brand-secondary italic">Maintenant</span></h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { label: "Réduire le gaspillage", icon: <Trash2 size={40} />, desc: "Moins d'achats neufs" },
                            { label: "Donner une 2e vie", icon: <Recycle size={40} />, desc: "Upcycling créatif" },
                            { label: "Adopter des gestes", icon: <CheckCircle size={40} />, desc: "Simple et efficace" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="space-y-6"
                            >
                                <div className="bg-white text-brand-primary w-24 h-24 rounded-[30%] flex items-center justify-center mx-auto shadow-2xl rotate-12">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white">{item.label}</h4>
                                    <p className="text-white/80 font-medium uppercase text-xs tracking-[0.2em] mt-2">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Slide>

            {/* 9. QR CODE SLIDE */}
            <Slide id="qrcode" bgColor="bg-zinc-950">
                <div className="max-w-6xl w-full bg-white dark:bg-white/5 rounded-[60px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center border border-white/10">
                    <div className="flex-1 p-16 space-y-8">
                        <div className="inline-flex items-center gap-2 text-brand-primary font-black uppercase text-sm tracking-[0.3em]">
                            <QrIcon className="animate-pulse" />
                            Accès Digital
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white">
                            Découvrez notre <br /><span className="text-brand-primary">Catalogue 2024</span>
                        </h2>
                        <p className="text-xl text-white/80 max-w-md">
                            Scannez pour explorer notre nouvelle collection éthique et responsable directement sur votre mobile.
                        </p>
                        <div className="pt-4">
                            <Button size="lg" className="bg-brand-primary text-white rounded-full px-12 py-8 text-xl font-black shadow-2xl shadow-brand-primary/20 hover:scale-105 transition-all" asChild>
                                <a href={catalogueUrl} target="_blank" rel="noopener noreferrer">
                                    Chargement PDF Instantané
                                </a>
                            </Button>
                        </div>
                    </div>
                    <div className="shrink-0 bg-white p-20 hidden md:flex items-center justify-center m-8 rounded-[50px] shadow-2xl relative group">
                        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <QRCodeCanvas
                            value={catalogueUrl}
                            size={300}
                            level={"H"}
                            includeMargin={false}
                            imageSettings={{
                                src: "/logos2.png",
                                x: undefined,
                                y: undefined,
                                height: 60,
                                width: 60,
                                excavate: true,
                            }}
                        />
                    </div>
                </div>
            </Slide>

            {/* 10. CONCLUSION SLIDE */}
            <Slide id="conclusion" bgColor="bg-white dark:bg-zinc-950">
                <div className="text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-32 h-32 rounded-[40%] bg-brand-primary/10 flex items-center justify-center mx-auto mb-10 text-brand-primary"
                    >
                        <CheckCircle size={64} />
                    </motion.div>

                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
                        Merci pour votre <br /><span className="text-brand-primary">Attention</span>
                    </h2>

                    <div className="h-1 w-40 bg-brand-primary mx-auto rounded-full" />

                    <p className="text-2xl text-muted-foreground md:text-3xl font-medium max-w-3xl mx-auto italic">
                        "Avec TARAFÉ, un déchet peut devenir une ressource. <br />
                        Et chacun peut agir à son niveau."
                    </p>

                    <div className="pt-10 flex gap-4 justify-center">
                        <Button variant="outline" size="lg" className="rounded-full px-10 py-7 font-black text-lg border-2 hover:bg-brand-primary hover:text-white transition-all" asChild>
                            <Link href="/">Retour à l'accueil</Link>
                        </Button>
                        <Button size="lg" className="bg-brand-primary text-white rounded-full px-10 py-7 font-black text-lg shadow-xl shadow-brand-primary/20 hover:scale-105" asChild>
                            <Link href="https://tarafe.com/boutique">Boutique en ligne</Link>
                        </Button>
                    </div>

                    <p className="text-brand-primary font-black uppercase tracking-[0.4em] pt-20">Venez nous voir sur notre stand ! 🙏</p>
                </div>
            </Slide>

        </div>
    );
}
