// components/MarkdownEditor.js
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // 支持GitHub Flavored Markdown
import remarkHtml from "remark-html";
import remarkBreaks from "remark-breaks";
import rehypePrism from "rehype-prism"; // 将Markdown转换为HTML

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("# 标题\n\n这里是一些Markdown内容");

  const handleChange = (event: any) => {
    console.log(`markdown`, markdown);
    setMarkdown(event.target.value);
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
