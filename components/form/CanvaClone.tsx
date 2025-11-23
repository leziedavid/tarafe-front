"use client";

import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Download, Trash2, Image as ImageIcon, Plus, MessageCircle, ImagePlus, Type, Palette, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";

// Interfaces
export interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight?: string;
    isEditing?: boolean;
}

export interface LogoElement {
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const models = [
    "/canva/sac1.jpg",
    "/canva/sac2.jpg",
    "/canva/sac3.jpg",
    "/canva/sac4.jpg",
    "/canva/sac5.jpg",
];

const fonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Impact",
    "Lucida Console",
    "Poppins",
    "Roboto",
    "Montserrat",
    "Lora",
    "Open Sans",
];

// Helper to generate ids
const id = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export default function CanvaClone() {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>(models[0]);
    const [selectedColor, setSelectedColor] = useState<string>("#ff6b6b");
    const [texts, setTexts] = useState<TextElement[]>([]);
    const [logos, setLogos] = useState<LogoElement[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [width, setWidth] = useState<number>(600);
    const [height, setHeight] = useState<number>(600);
    const [scaleToExport, setScaleToExport] = useState<number>(1);
    const [blendMode, setBlendMode] = useState<string>("color");
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 600, height: 600 });

    useEffect(() => {
        const updateContainerSize = () => {
            if (typeof window === 'undefined') return;

            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                // Sur mobile, utiliser presque toute la largeur de l'écran
                const maxWidth = window.innerWidth - 40; // 20px de marge de chaque côté
                const maxHeight = window.innerHeight - 200; // Réserver de l'espace pour la toolbar

                const size = Math.min(maxWidth, maxHeight, 600);
                setContainerSize({ width: size, height: size });
                setWidth(size);
                setHeight(size);
            } else {
                // Sur desktop, taille fixe
                setContainerSize({ width: 600, height: 600 });
                setWidth(600);
                setHeight(600);
            }
        };

        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);

        return () => window.removeEventListener('resize', updateContainerSize);
    }, []);

    // Add a text element
    const addText = () => {
        const newText: TextElement = {
            id: id("text"),
            text: "Nouveau texte",
            x: width / 4,
            y: height / 4,
            fontSize: Math.max(24, width / 20),
            fontFamily: "Poppins",
            color: "#111827",
            fontWeight: "400",
            isEditing: true,
        };
        setTexts((s) => [...s, newText]);
        setActiveId(newText.id);
    };

    // Remove a text element
    const removeText = (tid: string) => {
        setTexts((s) => s.filter((t) => t.id !== tid));
        if (activeId === tid) setActiveId(null);
    };

    // Add logo from file input
    const onLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result as string;
            const logoSize = Math.max(80, width / 8);
            const logo: LogoElement = {
                id: id("logo"),
                url,
                x: width / 2 - logoSize / 2,
                y: height / 2 - logoSize / 2,
                width: logoSize,
                height: logoSize,
            };
            setLogos((s) => [...s, logo]);
            setActiveId(logo.id);
        };
        reader.readAsDataURL(f);
        e.currentTarget.value = "";
    };

    const removeLogo = (lid: string) => {
        setLogos((s) => s.filter((l) => l.id !== lid));
        if (activeId === lid) setActiveId(null);
    };

    // Update text position/size
    const updateText = (tid: string, patch: Partial<TextElement>) => {
        setTexts((s) => s.map((t) => (t.id === tid ? { ...t, ...patch } : t)));
    };

    // Update logo
    const updateLogo = (lid: string, patch: Partial<LogoElement>) => {
        setLogos((s) => s.map((l) => (l.id === lid ? { ...l, ...patch } : l)));
    };

    // Render editor to an image (offscreen canvas)
    const renderToBlob = async (): Promise<Blob | null> => {
        const exportW = Math.round(width * scaleToExport);
        const exportH = Math.round(height * scaleToExport);
        const off = document.createElement("canvas");
        off.width = exportW;
        off.height = exportH;
        const ctx = off.getContext("2d");
        if (!ctx) return null;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, exportW, exportH);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedModel;

        await new Promise<void>((res, rej) => {
            img.onload = () => res();
            img.onerror = () => res();
        });

        const ratio = Math.min(exportW / img.width, exportH / img.height);
        const iw = img.width * ratio;
        const ih = img.height * ratio;
        const ix = (exportW - iw) / 2;
        const iy = (exportH - ih) / 2;

        ctx.drawImage(img, ix, iy, iw, ih);
        applyBlendMode(ctx, selectedColor, blendMode, ix, iy, iw, ih);

        texts.forEach((t) => {
            const x = Math.round(t.x * scaleToExport);
            const y = Math.round(t.y * scaleToExport);
            const fontSize = Math.round(t.fontSize * scaleToExport);
            ctx.font = `${t.fontWeight || "400"} ${fontSize}px ${t.fontFamily}`;
            ctx.fillStyle = t.color;
            const lines = t.text.split("\n");
            lines.forEach((line, idx) => {
                ctx.fillText(line, x, y + idx * (fontSize + 4));
            });
        });

        for (const l of logos) {
            const logoImg = new Image();
            logoImg.crossOrigin = "anonymous";
            logoImg.src = l.url;
            await new Promise<void>((res) => {
                logoImg.onload = () => res();
                logoImg.onerror = () => res();
            });
            ctx.drawImage(
                logoImg,
                Math.round(l.x * scaleToExport),
                Math.round(l.y * scaleToExport),
                Math.round(l.width * scaleToExport),
                Math.round(l.height * scaleToExport)
            );
        }

        return await new Promise<Blob | null>((res) => {
            off.toBlob((b) => res(b), "image/png");
        });
    };

    // Helper function to apply blend mode
    const applyBlendMode = (
        ctx: CanvasRenderingContext2D,
        color: string,
        mode: string,
        x: number,
        y: number,
        width: number,
        height: number
    ) => {
        ctx.save();

        switch (mode) {
            case "color":
                ctx.globalCompositeOperation = "color";
                break;
            case "multiply":
                ctx.globalCompositeOperation = "multiply";
                break;
            case "overlay":
                ctx.globalCompositeOperation = "overlay";
                break;
            case "hue":
                ctx.globalCompositeOperation = "hue";
                break;
            case "saturation":
                ctx.globalCompositeOperation = "saturation";
                break;
            default:
                ctx.globalCompositeOperation = "color";
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
    };

    // Download helper
    const downloadPNG = async () => {
        const blob = await renderToBlob();
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "design.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

const SERVICE_CLIENT_NUMBER = "2250153686819"; // Numéro service client

const shareToWhatsApp = async () => {
    const blob = await renderToBlob();
    if (!blob) return;

    const file = new File([blob], "design.png", { type: "image/png" });
    const message = "Voici mon design depuis la plateforme de mode.";

    const isAndroid = /android/i.test(navigator.userAgent);

    // ---- 1) Android + WebShare API : ENVOI IMAGE + TEXTE ----
    if (
        isAndroid &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
    ) {
        try {
            await navigator.share({
                files: [file],
                text: message
            });
            return;
        } catch (e) {
            console.warn("Share failed:", e);
        }
    }

    // ---- 2) Sinon: Fallback (télécharger + WhatsApp texte) ----
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // ---- 3) Ouvrir WhatsApp avec message ----
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${SERVICE_CLIENT_NUMBER}?text=${encoded}`, "_blank");
};


    // Send to backend
    const sendToBackend = async () => {
        const blob = await renderToBlob();
        if (!blob) return;
        const fd = new FormData();
        fd.append("file", blob, "design.png");
        fd.append("meta", JSON.stringify({ source: "canva-clone" }));
        try {
            const res = await fetch("/api/upload-design", {
                method: "POST",
                body: fd,
            });
            if (!res.ok) throw new Error("upload failed");
            alert("Design envoyé au backend");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi au backend");
        }
    };

    // quick UI helpers
    const selectModel = (m: string) => {
        setSelectedModel(m);
    };

    // Mobile menu content component
    const MobileMenuContent = () => (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pb-20">
            {/* Modèles */}
            <div className="p-4 rounded-xl bg-white shadow-sm border">
                <h3 className="font-semibold text-gray-700">Modèles</h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                    {models.map((m) => (
                        <button
                            key={m}
                            onClick={() => selectModel(m)}
                            className={`border rounded-lg overflow-hidden transition ${selectedModel === m ? "ring-2 ring-indigo-400" : "hover:shadow"}`}
                        >
                            <img src={m} alt="model" className="w-full h-20 object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Couleur du produit */}
            <div className="p-4 rounded-xl bg-white shadow-sm border">
                <h3 className="font-semibold flex items-center gap-2 text-gray-700">
                    <Palette size={18} />
                    Couleur du produit
                </h3>
                <div className="mt-3 space-y-3">
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="h-10 w-full pl-4 border rounded-xl cursor-pointer"
                    />

                    {/* Mode de fusion */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Mode de fusion
                        </label>
                        <select
                            value={blendMode}
                            onChange={(e) => setBlendMode(e.target.value)}
                            className="w-full p-2 border rounded-lg text-sm"
                        >
                            <option value="color">Couleur</option>
                            <option value="multiply">Multiplier</option>
                            <option value="overlay">Superposition</option>
                            <option value="hue">Teinte</option>
                            <option value="saturation">Saturation</option>
                        </select>
                    </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    La couleur est appliquée en temps réel
                </div>
            </div>

            {/* Add */}
            <div className="p-4 rounded-xl bg-white shadow-sm border">
                <h3 className="font-semibold text-gray-700">Ajouter</h3>
                <div className="mt-3 space-y-2">
                    <button
                        onClick={() => {
                            addText();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                    >
                        <Type size={20} />
                        <span className="font-medium">Ajouter du texte</span>
                    </button>

                    <label className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer">
                        <ImagePlus size={20} />
                        <span className="font-medium">Ajouter un logo</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                onLogoUpload(e);
                                setMobileMenuOpen(false);
                            }}
                        />
                    </label>
                </div>

                {activeId && texts.some(t => t.id === activeId) && (
                    <section className="mt-4">
                        <h2 className="text-lg font-semibold mb-3 text-gray-900">Propriétés du texte</h2>
                        <div className="space-y-4">
                            {/* Police */}
                            <div>
                                <label className="block text-sm">Polices</label>
                                <div className="relative mt-1">
                                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <select
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                                        onChange={(e) => {
                                            const f = e.target.value;
                                            if (!activeId) return;
                                            updateText(activeId, { fontFamily: f });
                                        }}
                                        defaultValue={fonts[9]}
                                    >
                                        {fonts.map((f) => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Couleur */}
                            <div>
                                <label className="block text-sm">Couleur</label>
                                <div className="relative mt-1">
                                    <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="color"
                                        onChange={(e) => {
                                            if (!activeId) return;
                                            updateText(activeId, { color: e.target.value });
                                        }}
                                        className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 rounded-xl bg-white shadow-sm border space-y-2">
                <h3 className="font-semibold text-gray-700">Actions</h3>
                <div className="flex flex-col gap-2">
                    <Button onClick={downloadPNG} className="w-full gap-2">
                        <Download size={16} /> Télécharger
                    </Button>
                    <Button onClick={shareToWhatsApp} className="w-full gap-2">
                        <MessageCircle size={16} /> Partager
                    </Button>
                    <Button onClick={sendToBackend} className="w-full gap-2">
                        Envoyer
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-6">
                {/* WRAPPER FLEX ROW POUR BIEN ALIGNER SIDEBAR + CANVAS */}
                <div className="flex gap-6">
                    {/* Sidebar Desktop */}
                    <aside className="hidden md:block w-72 shrink-0">
                        <div className="sticky top-4 space-y-4">
                            <MobileMenuContent />
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 flex flex-col items-center p-0 md:p-4 overflow-hidden min-h-0">
                        {/* Mobile header */}
                        <div className="w-full md:hidden mb-2 px-2">
                            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <button
                                        className="p-2 rounded-lg bg-gray-100"
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    >
                                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                                    </button>
                                    <div className="text-sm font-semibold">Canva Clone</div>
                                </div>
                                <button onClick={downloadPNG} className="p-2 rounded-lg bg-gray-100">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Overlay */}
                        {mobileMenuOpen && (
                            <div className="md:hidden fixed inset-0 z-50 bg-white pt-16 pb-20 px-4 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                                    <h2 className="text-lg font-semibold">Propriétés</h2>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 rounded-lg bg-gray-100"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <MobileMenuContent />
                            </div>
                        )}

                        {/* Canvas wrapper - FIXE et COMPACT */}
                        <div className="w-full flex justify-center items-center overflow-hidden p-0 md:p-2">
                            <div className="bg-white p-2 md:p-3 w-full max-w-[600px] overflow-hidden">
                                <div
                                    ref={canvasRef}
                                    className="relative mx-auto rounded overflow-hidden flex items-center justify-center border border-gray-200"
                                    style={{
                                        width: containerSize.width,
                                        height: containerSize.height,
                                        background: "#ffffff",
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                    }}
                                >
                                    {/* Conteneur pour l'image avec superposition de couleur */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-full h-full max-w-full max-h-full">
                                            {/* Image originale */}
                                            <div className="absolute inset-0">
                                                <NextImage
                                                    src={selectedModel}
                                                    alt="model"
                                                    fill
                                                    priority
                                                    className="object-contain w-full h-full pointer-events-none select-none"
                                                    sizes="(max-width: 600px) 100vw, 600px"
                                                />
                                            </div>

                                            {/* Calque de couleur avec mode de fusion */}
                                            <div
                                                className="absolute inset-0 mix-blend-color"
                                                style={{
                                                    backgroundColor: selectedColor,
                                                    mixBlendMode: blendMode as any,
                                                    opacity: 0.8,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Text elements */}
                                    {texts.map((t) => (
                                        <Rnd
                                            key={t.id}
                                            size={{
                                                width: Math.min(t.text.length * (t.fontSize / 2) + 20, width - 20),
                                                height: Math.min(t.fontSize + 20, height - 20),
                                            }}
                                            position={{
                                                x: Math.max(0, Math.min(t.x, width - (t.text.length * (t.fontSize / 2) + 20))),
                                                y: Math.max(0, Math.min(t.y, height - (t.fontSize + 20)))
                                            }}
                                            bounds="parent"
                                            onDragStop={(e, d) => {
                                                const newX = Math.max(0, Math.min(d.x, width - (t.text.length * (t.fontSize / 2) + 20)));
                                                const newY = Math.max(0, Math.min(d.y, height - (t.fontSize + 20)));
                                                updateText(t.id, { x: newX, y: newY });
                                            }}
                                            onResizeStop={(e, direction, ref, delta, position) => {
                                                const newFontSize = Math.max(12, Math.min(72, Math.round(t.fontSize + delta.height / 6)));
                                                const newWidth = Math.min(t.text.length * (newFontSize / 2) + 20, width - 20);
                                                const newHeight = Math.min(newFontSize + 20, height - 20);

                                                updateText(t.id, {
                                                    x: Math.max(0, Math.min(position.x, width - newWidth)),
                                                    y: Math.max(0, Math.min(position.y, height - newHeight)),
                                                    fontSize: newFontSize,
                                                });
                                            }}
                                            onClick={() => setActiveId(t.id)}
                                            dragHandleClassName="drag-handle"
                                            style={{
                                                zIndex: activeId === t.id ? 50 : 10,
                                                maxWidth: '100%',
                                            }}
                                        >
                                            <div className="relative p-2 w-full h-full">
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <button
                                                        title="Supprimer"
                                                        onClick={() => removeText(t.id)}
                                                        className="bg-white rounded-full p-1 shadow"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div
                                                    className="drag-handle w-full h-full flex items-center justify-center"
                                                    style={{ cursor: "move", minWidth: 20 }}
                                                >
                                                    <div
                                                        contentEditable={activeId === t.id}
                                                        suppressContentEditableWarning
                                                        onBlur={(e) =>
                                                            updateText(t.id, { text: e.currentTarget.textContent || "" })
                                                        }
                                                        onInput={(e) =>
                                                            updateText(t.id, { text: e.currentTarget.textContent || "" })
                                                        }
                                                        style={{
                                                            fontSize: t.fontSize,
                                                            fontFamily: t.fontFamily,
                                                            color: t.color,
                                                            fontWeight: t.fontWeight,
                                                            outline: activeId === t.id ? "1px dashed #aaa" : "none",
                                                            whiteSpace: "pre-wrap",
                                                            wordBreak: "break-word",
                                                            maxWidth: '100%',
                                                            textAlign: 'center',
                                                        }}
                                                        className="w-full text-center"
                                                    >
                                                        {t.text}
                                                    </div>
                                                </div>
                                            </div>
                                        </Rnd>
                                    ))}

                                    {/* Logos */}
                                    {logos.map((l) => (
                                        <Rnd
                                            key={l.id}
                                            size={{
                                                width: Math.min(l.width, width - 20),
                                                height: Math.min(l.height, height - 20)
                                            }}
                                            position={{
                                                x: Math.max(0, Math.min(l.x, width - l.width)),
                                                y: Math.max(0, Math.min(l.y, height - l.height))
                                            }}
                                            bounds="parent"
                                            onDragStop={(e, d) => {
                                                const newX = Math.max(0, Math.min(d.x, width - l.width));
                                                const newY = Math.max(0, Math.min(d.y, height - l.height));
                                                updateLogo(l.id, { x: newX, y: newY });
                                            }}
                                            onResizeStop={(e, dir, ref, delta, position) => {
                                                const newWidth = Math.max(24, Math.min(ref.offsetWidth, width - 20));
                                                const newHeight = Math.max(24, Math.min(ref.offsetHeight, height - 20));

                                                updateLogo(l.id, {
                                                    width: newWidth,
                                                    height: newHeight,
                                                    x: Math.max(0, Math.min(position.x, width - newWidth)),
                                                    y: Math.max(0, Math.min(position.y, height - newHeight)),
                                                });
                                            }}
                                            onClick={() => setActiveId(l.id)}
                                            style={{
                                                zIndex: activeId === l.id ? 60 : 20,
                                                maxWidth: '100%',
                                            }}
                                        >
                                            <div className="relative w-full h-full">
                                                <div className="absolute -top-3 -right-3 z-40">
                                                    <button
                                                        onClick={() => removeLogo(l.id)}
                                                        className="bg-white rounded-full p-1 shadow"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="w-full h-full flex items-center justify-center">
                                                    <NextImage
                                                        src={l.url}
                                                        alt="logo"
                                                        width={l.width}
                                                        height={l.height}
                                                        draggable={false}
                                                        className="select-none object-contain max-w-full max-h-full"
                                                    />
                                                </div>
                                            </div>
                                        </Rnd>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Floating Toolbar */}
                        {!mobileMenuOpen && (
                            <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-4 z-40 pb-[env(safe-area-inset-bottom)]">
                                <div className="bg-white rounded-full shadow-xl px-3 py-2 flex gap-3 items-center">
                                    <button onClick={addText} className="p-3 rounded-full bg-indigo-50 shadow-sm">
                                        <Type size={18} />
                                    </button>
                                    <label className="p-3 rounded-full bg-indigo-50 shadow-sm cursor-pointer">
                                        <ImagePlus size={18} />
                                        <input type="file" accept="image/*" className="hidden" onChange={onLogoUpload} />
                                    </label>
                                    <button onClick={downloadPNG} className="p-3 rounded-full bg-indigo-50 shadow-sm">
                                        <Download size={18} />
                                    </button>
                                    <button onClick={shareToWhatsApp} className="p-3 rounded-full bg-indigo-50 shadow-sm">
                                        <MessageCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </section>
        </>
    );
}