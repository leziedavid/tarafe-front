"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from 'next/image';
import { Type, Image as ImageIcon, Palette, Mail, RotateCcw, Send, Loader2, Download } from "lucide-react";
import { toast } from 'sonner';

interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    fontWeight: string;
    textAlign: string;
}

interface LogoElement {
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface EditorState {
    textElements: TextElement[];
    logoElements: LogoElement[];
    clientEmail: string;
    clientPhone: string;
    notes: string;
    newText: string;
    textColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    textAlign: string;
}

interface ClientData {
    email: string;
    phone: string;
    notes: string;
    textElements: TextElement[];
    logoElements: LogoElement[];
    originalImageUrl: string;
    createdAt: string;
}

interface FormImageDialogProps {
    imageUrl: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: number;
}

// Stockage des états par ID d'image
const editorStates = new Map<number, EditorState>();

const getDefaultState = (): EditorState => ({
    textElements: [],
    logoElements: [],
    clientEmail: "",
    clientPhone: "",
    notes: "",
    newText: "",
    textColor: "#000000",
    fontSize: 20, // Réduit de 24 à 20
    fontFamily: "Arial",
    fontWeight: "normal",
    textAlign: "left"
});

const FormImageDialog: React.FC<FormImageDialogProps> = ({ imageUrl, open, onOpenChange, id }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [textElements, setTextElements] = useState<TextElement[]>([]);
    const [logoElements, setLogoElements] = useState<LogoElement[]>([]);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Form states
    const [newText, setNewText] = useState("");
    const [textColor, setTextColor] = useState("#000000");
    const [fontSize, setFontSize] = useState(20); // Réduit
    const [fontFamily, setFontFamily] = useState("Arial");
    const [fontWeight, setFontWeight] = useState("normal");
    const [textAlign, setTextAlign] = useState("left");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [notes, setNotes] = useState("");

    const fonts = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana", "Comic Sans MS", "Impact", "Lucida Console"];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Charger l'état sauvegardé ou initialiser
    useEffect(() => {
        if (open) {
            const savedState = editorStates.get(id) || getDefaultState();
            setTextElements(savedState.textElements);
            setLogoElements(savedState.logoElements);
            setClientEmail(savedState.clientEmail);
            setClientPhone(savedState.clientPhone);
            setNotes(savedState.notes);
            setNewText(savedState.newText);
            setTextColor(savedState.textColor);
            setFontSize(savedState.fontSize);
            setFontFamily(savedState.fontFamily);
            setFontWeight(savedState.fontWeight);
            setTextAlign(savedState.textAlign);

            setIsLoading(true);
            const timeout = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [open, id]);

    // Sauvegarder l'état à chaque modification
    useEffect(() => {
        if (open) {
            const currentState: EditorState = {
                textElements,
                logoElements,
                clientEmail,
                clientPhone,
                notes,
                newText,
                textColor,
                fontSize,
                fontFamily,
                fontWeight,
                textAlign
            };
            editorStates.set(id, currentState);
        }
    }, [open, id, textElements, logoElements, clientEmail, clientPhone, notes, newText, textColor, fontSize, fontFamily, fontWeight, textAlign]);

    const handleImageLoad = () => setIsLoading(false);

    // Appliquer automatiquement les modifications de style à l'élément sélectionné
    useEffect(() => {
        if (selectedElement) {
            setTextElements(prev => prev.map(t =>
                t.id === selectedElement ? {
                    ...t,
                    fontSize,
                    fontFamily,
                    color: textColor,
                    fontWeight,
                    textAlign
                } : t
            ));
        }
    }, [selectedElement, fontSize, fontFamily, textColor, fontWeight, textAlign]);

    const addText = () => {
        if (!newText.trim()) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2 - (isMobile ? 60 : 100);
        const centerY = 50 + (textElements.length * (isMobile ? 30 : 40));
        setTextElements([...textElements, {
            id: Date.now().toString(),
            text: newText,
            x: Math.max(10, centerX),
            y: Math.max(10, centerY),
            fontSize,
            fontFamily,
            color: textColor,
            fontWeight,
            textAlign
        }]);
        setNewText("");
        toast.success("Texte ajouté");
    };

    const addLogo = () => {
        if (!logoFile) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.width / 2 - (isMobile ? 30 : 50);
            const centerY = 100 + (logoElements.length * (isMobile ? 80 : 120));
            setLogoElements([...logoElements, {
                id: Date.now().toString(),
                url: e.target?.result as string,
                x: Math.max(10, centerX),
                y: Math.max(10, centerY),
                width: isMobile ? 60 : 80, // Réduit de 80/100 à 60/80
                height: isMobile ? 60 : 80 // Réduit de 80/100 à 60/80
            }]);
            setLogoFile(null);
            toast.success("Logo ajouté");
        };
        reader.readAsDataURL(logoFile);
    };

    const getEventPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e) return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        return { clientX: e.clientX, clientY: e.clientY };
    }, []);

    const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, elementId: string, type: 'text' | 'logo') => {
        e.preventDefault();
        setSelectedElement(elementId);
        setIsDragging(true);

        // Mettre à jour les contrôles avec les propriétés de l'élément sélectionné
        if (type === 'text') {
            const element = textElements.find(t => t.id === elementId);
            if (element) {
                setFontSize(element.fontSize);
                setFontFamily(element.fontFamily);
                setTextColor(element.color);
                setFontWeight(element.fontWeight);
                setTextAlign(element.textAlign);
            }
        }

        const element = type === 'text' ? textElements.find(t => t.id === elementId) : logoElements.find(l => l.id === elementId);
        const position = getEventPosition(e);
        if (element && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setDragOffset({ x: position.clientX - rect.left - element.x, y: position.clientY - rect.top - element.y });
        }
    }, [textElements, logoElements, getEventPosition]);

    const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !selectedElement || !canvasRef.current) return;
        e.preventDefault();
        const position = getEventPosition(e);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width - 50, position.clientX - rect.left - dragOffset.x));
        const y = Math.max(0, Math.min(rect.height - 50, position.clientY - rect.top - dragOffset.y));
        setTextElements(prev => prev.map(t => t.id === selectedElement ? { ...t, x, y } : t));
        setLogoElements(prev => prev.map(l => l.id === selectedElement ? { ...l, x, y } : l));
    }, [isDragging, selectedElement, dragOffset, getEventPosition]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
        // Ne pas désélectionner l'élément pour permettre les modifications continues
    }, []);

    const deleteElement = (id: string, type: 'text' | 'logo') => {
        if (type === 'text') setTextElements(prev => prev.filter(t => t.id !== id));
        else setLogoElements(prev => prev.filter(l => l.id !== id));
        if (selectedElement === id) setSelectedElement(null);
        toast.success(type === 'text' ? "Texte supprimé" : "Logo supprimé");
    };

    const resetCanvas = () => {
        setTextElements([]);
        setLogoElements([]);
        setSelectedElement(null);
        setClientEmail("");
        setClientPhone("");
        setNotes("");
        setNewText("");
        setTextColor("#000000");
        setFontSize(20);
        setFontFamily("Arial");
        setFontWeight("normal");
        setTextAlign("left");
        // Supprimer l'état sauvegardé
        editorStates.delete(id);
        toast.success("Canvas réinitialisé");
    };

    const captureCanvasImage = async (): Promise<string> => {
        return new Promise(resolve => setTimeout(() => resolve(imageUrl), 500));
    };

    const sendToAPI = async () => {
        if (!clientEmail.trim()) { toast.error("L'email du client est requis"); return; }
        setIsSending(true);
        try {
            const finalImageDataUrl = await captureCanvasImage();
            const clientData: ClientData = {
                email: clientEmail,
                phone: clientPhone,
                notes,
                textElements,
                logoElements,
                originalImageUrl: imageUrl,
                createdAt: new Date().toISOString()
            };
            const response = await fetch('/api/image-editor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...clientData, finalImage: finalImageDataUrl, projectId: id })
            });

            if (response.ok) {
                toast.success("Image et données envoyées !");
                // Réinitialiser tout après envoi réussi
                resetCanvas();
                // Fermer le modal
                onOpenChange(false);
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'envoi.");
        } finally {
            setIsSending(false);
        }
    };

    if (!imageUrl) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${isMobile ? 'max-w-full h-full p-2 overflow-auto' : 'max-w-4xl p-4'} mx-auto bg-white rounded-lg shadow-lg`}>
                <DialogHeader>
                    <DialogTitle className={`${isMobile ? 'text-base' : 'text-2xl'} font-bold tracking-tight`}> {` Éditeur d'image avancé `}</DialogTitle>
                    <DialogDescription className={`${isMobile ? 'text-sm' : ''}`}>Personnalisez votre image avec texte, logos, etc.</DialogDescription>
                </DialogHeader>

                <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex gap-4'} mt-2`}>
                    {/* Canvas */}
                    <div className={`${isMobile ? 'order-1' : 'flex-1 order-2'}`}>
                        {isLoading ? <Skeleton height={isMobile ? 250 : 400} /> : (
                            <div
                                ref={canvasRef}
                                className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white touch-none"
                                style={{ minHeight: isMobile ? 250 : 400, maxHeight: isMobile ? '60vh' : '80vh' }}
                                onMouseMove={handleMove}
                                onMouseUp={handleEnd}
                                onMouseLeave={handleEnd}
                                onTouchMove={handleMove}
                                onTouchEnd={handleEnd}
                            >
                                <Image src={imageUrl} alt="Preview" className="object-contain w-full h-full mx-auto" width={500} height={300} onLoad={handleImageLoad} />
                                {textElements.map(t => (
                                    <div
                                        key={t.id}
                                        className="absolute cursor-move select-none border-2 border-transparent hover:border-blue-400 active:border-blue-600 p-1 rounded"
                                        style={{
                                            left: t.x,
                                            top: t.y,
                                            fontSize: isMobile ? Math.max(t.fontSize * 0.7, 12) : t.fontSize,
                                            fontFamily: t.fontFamily,
                                            color: t.color,
                                            fontWeight: t.fontWeight,
                                            textAlign: t.textAlign as any,
                                            whiteSpace: 'pre-wrap',
                                            touchAction: 'none'
                                        }}
                                        onMouseDown={e => handleStart(e, t.id, 'text')}
                                        onTouchStart={e => handleStart(e, t.id, 'text')}
                                        onDoubleClick={() => deleteElement(t.id, 'text')} >
                                        {t.text}
                                    </div>
                                ))}
                                {logoElements.map(l => (
                                    <div
                                        key={l.id}
                                        className="absolute cursor-move border-2 border-transparent hover:border-blue-400 active:border-blue-600 rounded"
                                        style={{
                                            left: l.x,
                                            top: l.y,
                                            width: isMobile ? l.width * 0.8 : l.width,
                                            height: isMobile ? l.height * 0.8 : l.height,
                                            touchAction: 'none'
                                        }}
                                        onMouseDown={e => handleStart(e, l.id, 'logo')}
                                        onTouchStart={e => handleStart(e, l.id, 'logo')}
                                        onDoubleClick={() => deleteElement(l.id, 'logo')} >
                                        <img src={l.url} alt="Logo" className="w-full h-full object-contain pointer-events-none" draggable={false} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Panel contrôle */}
                    <div className={`${isMobile ? 'order-2' : 'w-80 flex-shrink-0 order-1'}`}>
                        <Tabs defaultValue="text" className="w-full">
                            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 mb-10' : 'grid-cols-3'} bg-transparent border-none gap-1`}>
                                <TabsTrigger value="text" className="data-[state=active]:bg-gray-50 data-[state=active]:rounded-md flex items-center justify-center p-2" >
                                    <Type className="w-4 h-4" />
                                </TabsTrigger>

                                <TabsTrigger  value="logo" className="data-[state=active]:bg-gray-50 data-[state=active]:rounded-md flex items-center justify-center p-2" >
                                    <ImageIcon className="w-4 h-4" />
                                </TabsTrigger>

                                <TabsTrigger value="client" className="data-[state=active]:bg-gray-50 data-[state=active]:rounded-md flex items-center justify-center p-2" >
                                    <Mail className="w-4 h-4" />
                                </TabsTrigger>
                            </TabsList>


                            {/* Texte */}
                            <TabsContent value="text" className="space-y-2 overflow-auto">
                                <Card>
                                    <CardHeader><CardTitle className="text-sm">Ajouter du texte</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Entrez votre texte..." rows={isMobile ? 2 : 3} className="text-sm outline-none" />
                                        <div className="grid grid-cols-2 gap-1">
                                            <Input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} min={8} max={72} className="text-sm py-1" />
                                            <Input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-8 p-0" />
                                        </div>
                                        <Select value={fontFamily} onValueChange={setFontFamily}>
                                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                            <SelectContent>{fonts.map(f => <SelectItem key={f} value={f}><span style={{ fontFamily: f }}>{f}</span></SelectItem>)}</SelectContent>
                                        </Select>
                                        <div className="grid grid-cols-2 gap-1">
                                            <Select value={fontWeight} onValueChange={setFontWeight}>
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="normal">Normal</SelectItem>
                                                    <SelectItem value="bold">Gras</SelectItem>
                                                    <SelectItem value="lighter">Léger</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={textAlign} onValueChange={setTextAlign}>
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="left">Gauche</SelectItem>
                                                    <SelectItem value="center">Centre</SelectItem>
                                                    <SelectItem value="right">Droite</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button onClick={addText} className="w-full text-sm py-1">Ajouter</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Logo */}
                            <TabsContent value="logo" className="space-y-2 max-h-60 overflow-auto">
                                <Card>
                                    <CardHeader><CardTitle className="text-sm">Ajouter un logo</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="text-sm py-1" />
                                        <Button onClick={addLogo} disabled={!logoFile} className="w-full text-sm py-1">Ajouter</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Client */}
                            <TabsContent value="client" className="space-y-2  overflow-auto">
                                <Card>
                                    <CardHeader><CardTitle className="text-sm">Infos client</CardTitle></CardHeader>
                                    <CardContent className="space-y-2">
                                        <Input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" className="text-sm py-1" />
                                        <Input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+225 01 23 45 67 89" className="text-sm py-1" />
                                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes..." rows={isMobile ? 2 : 3} className="text-sm" />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Actions */}
                        {/* Actions */}
                        <div className={`${isMobile ? 'flex flex-col gap-2 mt-2' : 'absolute bottom-0 left-0 w-80 flex flex-col space-y-2 p-2 bg-white/90 border-t border-gray-200'}`}>
                            <Button onClick={sendToAPI} disabled={isSending || !clientEmail.trim()} className="w-full text-sm py-1" >
                                {isSending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
                                Envoyer
                            </Button>
                            <Button onClick={resetCanvas} className="w-full text-sm py-1">Réinitialiser</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormImageDialog;



// {
//   "email": "client@mail.com",
//   "phone": "0700000000",
//   "notes": "Urgent à livrer",
//   "originalImageUrl": "/uploads/models/img123.png",
//   "finalImage": "/uploads/models/final123.png",
//   "textElements": [
//     {
//       "id": "1",
//       "text": "Promo -50%",
//       "x": 100,
//       "y": 50
//     }
//   ],
//   "logoElements": [
//     {
//       "id": "1",
//       "url": "/uploads/logos/logo1.png",
//       "x": 200,
//       "y": 150,
//       "width": 80,
//       "height": 80
//     }
//   ],
//   "textStyles": {
//     "fontSize": 24,
//     "fontFamily": "Arial",
//     "color": "#FF0000",
//     "fontWeight": "bold"
//   }
// }
