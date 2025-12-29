"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

// ✅ Importations nommées pour Tiptap v3
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  editable,
}: RichTextEditorProps) {
  const isEditable = editable ?? true;

const editor = useEditor({
  editable: isEditable,
  extensions: [
    StarterKit.configure({
      bulletList: { HTMLAttributes: { class: "list-disc ml-2" } },
      orderedList: { HTMLAttributes: { class: "list-decimal ml-2" } },
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Highlight,
    TextStyle,
    Color,
    FontFamily,
  ],
  content: content || "",
  editorProps: {
    attributes: { class: isEditable ? "min-h-[156px] border border-gray-200 hover:border-gray-300 rounded-md bg-gray-1 py-2 px-3" : "", },},
  onUpdate: ({ editor }) => {
    if (onChange) onChange(editor.getHTML());
  },
  // ✅ option essentielle pour SSR
  immediatelyRender: false,
});



  return (
    <div>
      {isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
