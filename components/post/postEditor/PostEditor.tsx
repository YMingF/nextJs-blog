import MilkdownEditorWrapper from "@/components/markdownEditor/MilkdownEditor";
import { Input } from "antd";
import React, { useCallback, useState } from "react";
import styles from "./postEditor.module.scss";
interface PostEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = (props) => {
  const {
    onTitleChange,
    onContentChange,
    initialTitle,
    initialContent = "",
  } = props;
  const [title, setTitle] = useState(initialTitle);

  const syncMarkdown = useCallback((data: string) => {
    onContentChange?.(data);
  }, []);

  const handleTitleEnter = useCallback(() => {
    setTimeout(() => {
      const editor = document.querySelector(".milkdown .editor") as HTMLElement;
      if (editor) {
        editor.focus();
        const selection = window.getSelection();
        const range = document.createRange();
        const firstTextNode = editor.firstChild?.firstChild;
        if (firstTextNode) {
          range.setStart(firstTextNode, 0);
          range.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    }, 0);
  }, []);
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    onTitleChange?.(newTitle);
  }, []);
  return (
    <div className={styles.postEditorBox}>
      <div className={styles.postTitle}>
        <Input
          placeholder="标题"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onPressEnter={handleTitleEnter}
        />
      </div>
      <div className={`${styles.editorWrapper}`}>
        <div className={"tw-mt-2 tw-h-full tw-flex tw-flex-col"}>
          <MilkdownEditorWrapper
            defaultValue={initialContent}
            onValueChange={syncMarkdown}
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
