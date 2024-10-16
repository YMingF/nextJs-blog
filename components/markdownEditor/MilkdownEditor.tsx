import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { NextPage } from "next";
import React from "react";
import styles from "./markdownEditor.module.scss";
interface MilkdownEditorWrapperProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
}
const MilkdownEditorWrapper: NextPage<MilkdownEditorWrapperProps> = React.memo(
  (props) => {
    const { defaultValue, onValueChange } = props;
    const MilkdownEditor: React.FC = () => {
      const { loading } = useEditor((root) =>
        Editor.make()
          .config(nord)
          .use(commonmark)
          .use(history)
          .config((ctx) => {
            ctx.set(rootCtx, root);

            // 只在初始化时设置默认值
            if (!ctx.get(defaultValueCtx)) {
              ctx.set(defaultValueCtx, defaultValue);
            }

            const listener = ctx.get(listenerCtx);
            listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
              // 只在 markdown 真正变化时触发 onValueChange
              if (markdown !== prevMarkdown && markdown !== defaultValue) {
                onValueChange(markdown);
              }
            });
          })
          .use(listener)
      );

      return <Milkdown />;
    };
    return (
      <MilkdownProvider>
        <div className={styles.milkdownEditorWrapper}>
          <MilkdownEditor />
        </div>
      </MilkdownProvider>
    );
  }
);

export default MilkdownEditorWrapper;
