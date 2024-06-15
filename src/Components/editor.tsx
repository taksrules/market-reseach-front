// src/TiptapEditor.tsx

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = (props:any) => {
    const {notes}=props
  const editor = useEditor({
    extensions: [StarterKit],
    content: notes?`<p>${notes}</p>`:'<p>Your Notes go here!</p>',
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex mb-4 space-x-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        >
          Ordered List
        </button>
      </div>
      <EditorContent  className="p-4 border rounded-lg bg-white shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" editor={editor} />
    </div>
  );
};

export default TiptapEditor;
