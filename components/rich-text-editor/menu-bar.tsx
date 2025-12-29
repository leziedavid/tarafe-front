"use client";

import {AlignCenter, AlignLeft, AlignRight,Bold, Heading1, Heading2, Heading3,Highlighter, Italic, List, ListOrdered, Strikethrough} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
export default function MenuBar({ editor }: { editor: Editor | null }) {

  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Georgia");

  if (!editor) return null;

  const Options = [
    { icon: <Heading1 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), preesed: editor.isActive("heading", { level: 1 }) },
    { icon: <Heading2 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), preesed: editor.isActive("heading", { level: 2 }) },
    { icon: <Heading3 className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), preesed: editor.isActive("heading", { level: 3 }) },
    { icon: <Bold className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBold().run(), preesed: editor.isActive("bold") },
    { icon: <Italic className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleItalic().run(), preesed: editor.isActive("italic") },
    { icon: <Strikethrough className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleStrike().run(), preesed: editor.isActive("strike") },
    { icon: <AlignLeft className="w-4 h-4" />, onClick: () => editor.chain().focus().setTextAlign("left").run(), preesed: editor.isActive({ textAlign: "left" }) },
    { icon: <AlignCenter className="w-4 h-4" />, onClick: () => editor.chain().focus().setTextAlign("center").run(), preesed: editor.isActive({ textAlign: "center" }) },
    { icon: <AlignRight className="w-4 h-4" />, onClick: () => editor.chain().focus().setTextAlign("right").run(), preesed: editor.isActive({ textAlign: "right" }) },
    { icon: <List className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleBulletList().run(), preesed: editor.isActive("bulletList") },
    { icon: <ListOrdered className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleOrderedList().run(), preesed: editor.isActive("orderedList") },
    { icon: <Highlighter className="w-4 h-4" />, onClick: () => editor.chain().focus().toggleHighlight().run(), preesed: editor.isActive("highlight") },
  ];

  const handleColorChange = (value: string) => {
    setColor(value);
    editor.chain().focus().setColor(value).run();
  };

  const handleFontChange = (value: string) => {
    setFont(value);
    editor.chain().focus().setFontFamily(value).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border rounded-md  mb-2 z-50">
      {/* Buttons principales */}
      {Options.map((option, idx) => ( <Toggle key={idx} pressed={option.preesed} onPressedChange={option.onClick}> {option.icon} </Toggle> ))}
      {/* Sélecteur couleur */}
      <input type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} className="w-6 h-6  p-0 cursor-pointer" title="Couleur du texte" />
      {/* Sélecteur police avec ShadCN */}
      <Select value={font} onValueChange={handleFontChange}>
        <SelectTrigger className="w-36 border rounded-md px-2 py-1 text-sm">
          <SelectValue placeholder="Police" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-md rounded-md"> {["Georgia","Arial", "Verdana","Times New Roman", "Courier New"].map(f => (
            <SelectItem key={f} value={f} className="text-sm">{f}</SelectItem> ))}
        </SelectContent>
      </Select>
    </div>
  );
}
