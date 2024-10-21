import { SmileOutlined } from "@ant-design/icons";
import { Form, Input, Popover, Space } from "antd";
import EmojiPicker from "emoji-picker-react";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./inputBox.module.scss";

interface CommentInputBoxProps {
  content: string;
  onContentChange: (content: string) => void;
}

export interface CommentInputBoxRef {
  reset: () => void;
}

const CommentInputBox: NextPage<CommentInputBoxProps> = ({
  content,
  onContentChange,
}) => {
  const [form] = Form.useForm();
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ content });
  }, [content, form]);

  const insertEmoji = useCallback(
    (emoji: string) => {
      const content = form.getFieldValue("content") || "";
      const currentCursorPosition =
        form.getFieldInstance("content").resizableTextArea.textArea
          .selectionStart;

      const newContent =
        currentCursorPosition !== null
          ? content.slice(0, currentCursorPosition) +
            emoji +
            content.slice(currentCursorPosition)
          : content + emoji;
      form.setFieldsValue({ content: newContent });
      onContentChange(newContent);
      setIsShowEmojiPicker(false);
    },
    [form]
  );
  const emojiPickerContent = (
    <EmojiPicker
      onEmojiClick={(emojiObj) => {
        insertEmoji(emojiObj.emoji);
        setIsShowEmojiPicker(false);
      }}
    ></EmojiPicker>
  );
  const toggleEmojiPicker = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsShowEmojiPicker(!isShowEmojiPicker);
    },
    [isShowEmojiPicker]
  );
  const handleFieldsChange = useCallback(
    (changedFields: any) => {
      const contentField = changedFields.find(
        (field: any) => field.name[0] === "content"
      );
      if (contentField) {
        onContentChange(contentField.value);
      }
    },
    [onContentChange]
  );
  return (
    <div className={`${styles.inputBox} tw-flex-1`}>
      <Form
        form={form}
        initialValues={{ content }}
        onFieldsChange={handleFieldsChange}
      >
        <Form.Item name="content">
          <Input.TextArea autoSize placeholder="说点什么" />
        </Form.Item>
      </Form>

      <Popover
        content={emojiPickerContent}
        trigger="click"
        open={isShowEmojiPicker}
      >
        <Space>
          <SmileOutlined onClick={toggleEmojiPicker} />
        </Space>
      </Popover>
    </div>
  );
};

export default CommentInputBox;
