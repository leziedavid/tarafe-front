"use client";

import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Download, Trash2, Image as ImageIcon, Plus, MessageCircle, ImagePlus, Type, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const [bgColor, setBgColor] = useState<string>("#ffffff");
    const [texts, setTexts] = useState<TextElement[]>([]);
    const [logos, setLogos] = useState<LogoElement[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [width, setWidth] = useState<number>(800);
    const [height, setHeight] = useState<number>(800);
    const [scaleToExport, setScaleToExport] = useState<number>(1);

    useEffect(() => {
        // keep aspect ratio square; you can adapt
        const w = 800;
        setWidth(w);
        setHeight(w);
    }, []);

    // Add a text element
    const addText = () => {
        const newText: TextElement = {
            id: id("text"),
            text: "Nouveau texte",
            x: width / 4,
            y: height / 4,
            fontSize: 36,
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
            const logo: LogoElement = {
                id: id("logo"),
                url,
                x: width / 2 - 80,
                y: height / 2 - 80,
                width: 160,
                height: 160,
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
        // create canvas with desired pixel size
        const exportW = Math.round(width * scaleToExport);
        const exportH = Math.round(height * scaleToExport);
        const off = document.createElement("canvas");
        off.width = exportW;
        off.height = exportH;
        const ctx = off.getContext("2d");
        if (!ctx) return null;

        // fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, exportW, exportH);

        // draw model image centered and fitted
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedModel;

        await new Promise<void>((res, rej) => {
            img.onload = () => res();
            img.onerror = () => res();
        });

        // Fit image inside canvas while keeping aspect ratio
        const ratio = Math.min(exportW / img.width, exportH / img.height);
        const iw = img.width * ratio;
        const ih = img.height * ratio;
        const ix = (exportW - iw) / 2;
        const iy = (exportH - ih) / 2;
        ctx.drawImage(img, ix, iy, iw, ih);

        // Draw texts
        texts.forEach((t) => {
            const x = Math.round(t.x * scaleToExport);
            const y = Math.round(t.y * scaleToExport);
            const fontSize = Math.round(t.fontSize * scaleToExport);
            ctx.font = `${t.fontWeight || "400"} ${fontSize}px ${t.fontFamily}`;
            ctx.fillStyle = t.color;
            // support simple multi-line
            const lines = t.text.split("\n");
            lines.forEach((line, idx) => {
                ctx.fillText(line, x, y + idx * (fontSize + 4));
            });
        });

        // Draw logos
        for (const l of logos) {
            const logoImg = new Image();
            logoImg.crossOrigin = "anonymous";
            logoImg.src = l.url;
            // eslint-disable-next-line no-await-in-loop
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

    // Share via Web Share API or fallback to opening WhatsApp Web with message + download
    const shareToWhatsApp = async () => {
        const blob = await renderToBlob();
        if (!blob) return;

        // create file
        const file = new File([blob], "design.png", { type: "image/png" });

        // Prefer native share if available and accepts files
        // @ts-ignore
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                // @ts-ignore
                await navigator.share({ files: [file], text: "Voici mon design depuis la plateforme de mode" });
                return;
            } catch (err) {
                // fallback
            }
        }

        // Fallback: Download and open WhatsApp web with a prefilled message
        const url = URL.createObjectURL(blob);
        // download temporarily so user can attach
        const a = document.createElement("a");
        a.href = url;
        a.download = "design.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        const text = encodeURIComponent("Voici mon design depuis la plateforme de mode.");
        // open whatsapp web (user must attach the downloaded image manually)
        window.open(`https://wa.me/?text=${text}`, "_blank");
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

    return (
        <div className="flex gap-6 p-6">
            {/* Sidebar controls */}
            <div className="w-80 flex-shrink-0 space-y-4">
                <div className="p-4 rounded-lg shadow bg-white">
                    <h3 className="font-semibold">Modèles</h3>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        {models.map((m) => (
                            <button key={m} onClick={() => selectModel(m)} className={`border rounded overflow-hidden ${selectedModel === m ? "ring-2 ring-offset-2" : ""}`} >
                                <img src={m} alt="model" className="w-full h-20 object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 rounded-lg shadow bg-white">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Palette size={18} className="text-gray-700" />
                        Arrière-plan
                    </h3>

                    <div className="mt-3 w-full relative">
                        <Palette
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                            size={18}
                        />

                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="h-10 w-full pl-12 pr-3 border border-gray-300 rounded-lg cursor-pointer"
                        />
                    </div>
                </div>

                <section>
                    <h2 className="text-lg font-semibold mb-3 text-gray-900">Ajouter</h2>
                    <div className="space-y-2">
                        <button onClick={addText} className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" >
                            <Type size={20} />
                            <span className="font-medium">Ajouter du texte</span>
                        </button>

                        <label className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                            <ImagePlus size={20} />
                            <span className="font-medium">Ajouter un logo</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onLogoUpload}
                                className="hidden"
                            />
                        </label>

                    </div>
                </section>

                <section>
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


                <div className="p-4 rounded-lg shadow bg-white space-y-2">
                    <h3 className="font-semibold">Actions</h3>
                    <div className="flex flex-col gap-2">
                        <Button onClick={downloadPNG}>
                            <Download size={16} /> Télécharger
                        </Button>
                        <Button onClick={shareToWhatsApp}>
                            <MessageCircle size={16} /> Partager sur WhatsApp
                        </Button>
                        <Button onClick={sendToBackend}>Envoyer au backend</Button>
                    </div>
                </div>
            </div>

            {/* Canvas area */}
            <div className="flex-1">
                <div
                    ref={canvasRef}
                    className="relative mx-auto rounded shadow"
                    style={{ width, height, background: bgColor }}
                >
                    {/* Base image */}
                    <img
                        src={selectedModel}
                        alt="model"
                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                        style={{ userSelect: "none" }}
                    />

                    {/* Text elements */}
                    {texts.map((t) => (
                        <Rnd
                            key={t.id}
                            size={{ width: t.text.length * (t.fontSize / 2) + 20, height: t.fontSize + 20 }}
                            position={{ x: t.x, y: t.y }}
                            bounds="parent"
                            onDragStop={(e, d) => updateText(t.id, { x: d.x, y: d.y })}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                const newFontSize = Math.max(12, Math.round(t.fontSize + delta.height / 6));
                                updateText(t.id, { x: position.x, y: position.y, fontSize: newFontSize });
                            }}
                            onClick={() => setActiveId(t.id)}
                            style={{ zIndex: activeId === t.id ? 50 : 10 }}
                            dragHandleClassName="drag-handle"
                        >
                            <div className={`relative p-2`}>
                                <div className="absolute -top-2 -right-2">
                                    <button
                                        title="Supprimer"
                                        onClick={() => removeText(t.id)}
                                        className="bg-white rounded-full p-1 shadow"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div
                                    className="drag-handle"
                                    style={{ cursor: "move", minWidth: 20 }}
                                >
                                    <div
                                        contentEditable={activeId === t.id}
                                        suppressContentEditableWarning
                                        onBlur={(e) => updateText(t.id, { text: e.currentTarget.textContent || "" })}
                                        onInput={(e) => updateText(t.id, { text: e.currentTarget.textContent || "" })}
                                        style={{
                                            fontSize: t.fontSize,
                                            fontFamily: t.fontFamily,
                                            color: t.color,
                                            fontWeight: t.fontWeight,
                                            outline: activeId === t.id ? "1px dashed #aaa" : "none",
                                            whiteSpace: "pre-wrap",
                                        }}
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
                            size={{ width: l.width, height: l.height }}
                            position={{ x: l.x, y: l.y }}
                            bounds="parent"
                            onDragStop={(e, d) => updateLogo(l.id, { x: d.x, y: d.y })}
                            onResizeStop={(e, dir, ref, delta, position) => {
                                updateLogo(l.id, { width: Math.max(24, ref.offsetWidth), height: Math.max(24, ref.offsetHeight), x: position.x, y: position.y });
                            }}
                            onClick={() => setActiveId(l.id)}
                            style={{ zIndex: activeId === l.id ? 60 : 20 }}
                        >
                            <div className="relative">
                                <div className="absolute -top-3 -right-3 z-40">
                                    <button onClick={() => removeLogo(l.id)} className="bg-white rounded-full p-1 shadow">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <img src={l.url} alt="logo" draggable={false} style={{ width: l.width, height: l.height }} />
                            </div>
                        </Rnd>
                    ))}
                </div>

                {/* Quick inspector for active element */}
                <div className="mt-4 bg-white rounded-lg p-4 shadow">
                    <h4 className="font-semibold">Inspecteur</h4>
                    {activeId ? (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            {/* If active is text */}
                            {texts.find((t) => t.id === activeId) ? (
                                (() => {
                                    const t = texts.find((x) => x.id === activeId)!;
                                    return (
                                        <>
                                            <label className="col-span-2">Texte</label>
                                            <textarea
                                                className="col-span-2 border rounded p-2 h-24"
                                                value={t.text}
                                                onChange={(e) => updateText(t.id, { text: e.target.value })}
                                            />
                                            <label>Font size</label>
                                            <input
                                                type="number"
                                                value={t.fontSize}
                                                onChange={(e) => updateText(t.id, { fontSize: Number(e.target.value) })}
                                                className="border rounded px-2 py-1"
                                            />
                                            <label>Font family</label>
                                            <select
                                                value={t.fontFamily}
                                                onChange={(e) => updateText(t.id, { fontFamily: e.target.value })}
                                                className="border rounded px-2 py-1"
                                            >
                                                {fonts.map((f) => (
                                                    <option key={f} value={f}>
                                                        {f}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    );
                                })()
                            ) : logos.find((l) => l.id === activeId) ? (
                                (() => {
                                    const l = logos.find((x) => x.id === activeId)!;
                                    return (
                                        <>
                                            <label className="col-span-2">Logo sélectionné</label>
                                            <label>Width</label>
                                            <input
                                                type="number"
                                                value={l.width}
                                                onChange={(e) => updateLogo(l.id, { width: Number(e.target.value) })}
                                                className="border rounded px-2 py-1"
                                            />
                                            <label>Height</label>
                                            <input
                                                type="number"
                                                value={l.height}
                                                onChange={(e) => updateLogo(l.id, { height: Number(e.target.value) })}
                                                className="border rounded px-2 py-1"
                                            />
                                        </>
                                    );
                                })()
                            ) : (
                                <div>Sélectionnez un élément (texte ou logo)</div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Aucun élément sélectionné</div>
                    )}
                </div>
            </div>
        </div>
    );
}
