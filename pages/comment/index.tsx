import { NextPage } from "next";
import { Button, Form, Input } from "antd";
import styles from "./styles/index.module.scss";
import { useCallback } from "react";
import axios from "axios";

interface CommentProps {
  userId: number;
  postId: string;
}

const AppComment: NextPage<CommentProps> = (props) => {
  const { userId, postId } = props;
  console.log(`props`, props);
  const [form] = Form.useForm();
  const createComment = useCallback(() => {
    const content = form.getFieldsValue().content;
    axios
      .post("/api/v1/comments/create", { content, userId, postId })
      .then((response) => {
        console.log(`response`, response);
      });
  }, []);
  return (
    <div className={`${styles.commentContainer} tw-p-2.5`}>
      <div className="commentBox tw-flex tw-flex-col">
        <div className={`${styles.inputBox} tw-p-3.5 tw-flex-1`}>
          <Form form={form}>
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "please enter url description",
                },
              ]}
            >
              <Input.TextArea autoSize placeholder="说点什么" />
            </Form.Item>
          </Form>
        </div>
        <div className="actionBox tw-px-2.5 tw-flex tw-justify-end">
          <Button type={"primary"} onClick={createComment}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AppComment;
