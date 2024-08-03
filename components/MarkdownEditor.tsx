// components/MarkdownEditor.js
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 支持GitHub Flavored Markdown
import remarkHtml from "remark-html";
import remarkBreaks from "remark-breaks";
import rehypePrism from "rehype-prism";
import { NextPage } from "next"; // 将Markdown转换为HTML

interface MarkdownEditorProps {
  onMarkdownChange: (data: any) => void;
  initialValue?: string;
}
const MarkdownEditor: NextPage<MarkdownEditorProps> = ({
  onMarkdownChange,
  initialValue,
}) => {
  const [markdown, setMarkdown] = useState(initialValue);

  const handleChange = (event: any) => {
    setMarkdown(event.target.value);
    onMarkdownChange(event.target.value);
  };

  return (
    <div className={"tw-flex "}>
      <textarea
        style={{
          padding: "10px",
          fontSize: "16px",
          height: "100vh",
          backgroundColor: "#f7f8f9",
        }}
        className={"tw-flex-1"}
        value={markdown}
        onChange={handleChange}
      />
      <div className={"tw-flex-1 tw-bg-white tw-p-5"}>
        <ReactMarkdown
          children={markdown}
          remarkPlugins={[remarkGfm, remarkHtml, remarkBreaks]}
          rehypePlugins={[rehypePrism]}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
