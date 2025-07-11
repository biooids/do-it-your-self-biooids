"use client";

import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
  Image as ImageIcon,
  Link,
  Paintbrush,
  Table,
  Trash2,
  Columns,
  Rows,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// --- Typed and Styled IconButton ---
interface IconButtonProps {
  onClick: () => void;
  isActive: boolean;
  Icon: React.ElementType;
  label: string;
}

function IconButton({ onClick, isActive, Icon, label }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-colors duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-transparent text-foreground"
      )}
      title={label}
      aria-label={label}
      aria-pressed={isActive}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

// --- Improved Color Picker ---
function ColorPicker({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center rounded-md p-1 hover:bg-accent">
      <label htmlFor="color-picker" className="cursor-pointer">
        <Paintbrush className="w-5 h-5 text-foreground" />
      </label>
      <input
        id="color-picker"
        type="color"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          editor.chain().focus().setColor(e.target.value).run()
        }
        value={editor.getAttributes("textStyle").color || "#ffffff"}
        className="w-6 h-6 cursor-pointer bg-transparent border-none appearance-none"
        title="Set text color"
      />
    </div>
  );
}

// --- The Main MenuBar Component ---
function MenuBar({ editor }: { editor: Editor | null }) {
  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border rounded-lg bg-card">
      {/* --- Text Style Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          Icon={Bold}
          label="Bold"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          Icon={Italic}
          label="Italic"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          Icon={Underline}
          label="Underline"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          Icon={Strikethrough}
          label="Strikethrough"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          Icon={Highlighter}
          label="Highlight"
        />
        <ColorPicker editor={editor} />
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* --- Heading Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          Icon={Heading1}
          label="Heading 1"
        />
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          Icon={Heading2}
          label="Heading 2"
        />
        <IconButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          Icon={Heading3}
          label="Heading 3"
        />
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* --- Alignment Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          Icon={AlignLeft}
          label="Align Left"
        />
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          Icon={AlignCenter}
          label="Align Center"
        />
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          Icon={AlignRight}
          label="Align Right"
        />
        <IconButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          Icon={AlignJustify}
          label="Align Justify"
        />
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* --- List Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          Icon={List}
          label="Bullet List"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          Icon={ListOrdered}
          label="Ordered List"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          Icon={ListChecks}
          label="Task List"
        />
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* --- Block Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          Icon={Quote}
          label="Blockquote"
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          Icon={Code}
          label="Code Block"
        />
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* --- Insert Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          Icon={Link}
          label="Set Link"
        />
        <IconButton
          onClick={addImage}
          isActive={false}
          Icon={ImageIcon}
          label="Add Image"
        />
        <IconButton
          onClick={insertTable}
          isActive={false}
          Icon={Table}
          label="Insert Table"
        />
        <IconButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          Icon={Minus}
          label="Horizontal Rule"
        />
        <IconButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          isActive={false}
          Icon={CornerDownLeft}
          label="Hard Break"
        />
      </div>

      {/* --- Table Actions Group (could be hidden unless a table is active) --- */}
      {editor.can().deleteTable() && (
        <>
          <Separator orientation="vertical" className="h-8 mx-1" />
          <div className="flex items-center gap-1">
            <IconButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              isActive={false}
              Icon={Trash2}
              label="Delete Table"
            />
            <IconButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              isActive={false}
              Icon={Rows}
              label="Delete Row"
            />
            <IconButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              isActive={false}
              Icon={Columns}
              label="Delete Column"
            />
          </div>
        </>
      )}

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* --- History Group --- */}
      <div className="flex items-center gap-1">
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          Icon={Undo}
          label="Undo"
        />
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          Icon={Redo}
          label="Redo"
        />
      </div>
    </div>
  );
}

export default MenuBar;
