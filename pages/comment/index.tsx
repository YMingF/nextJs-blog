import { NextPage } from "next";
import { Button, Card, Form, Input, message, Popover } from "antd";
import styles from "./styles/index.module.scss";
import React, { useCallback, useState } from "react";
import axios from "axios";
import BoringAvatars from "boring-avatars";
import { useGlobalState } from "@/context/globalStateContext";
import { KeyValMap } from "@/constants/common-type";
import { SmallDashOutlined } from "@ant-design/icons";

interface CommentProps {
  userId: number;
  postId: number;
  commentData: KeyValMap[] | null;
}
const processCommentData = (dataArr: KeyValMap[]) => {
  dataArr.forEach((data: KeyValMap) => {
    data.isVisible = false;
  });
  return dataArr;
};
const AppComment: NextPage<CommentProps> = (props) => {
  let { userId, postId, commentData: initialCommentData } = props;
  const { user } = useGlobalState();
  const [form] = Form.useForm();
  const [commentData, setCommentData] = useState<KeyValMap[]>(
    processCommentData(initialCommentData) || []
  );

  const createComment = useCallback(() => {
    const content = form.getFieldsValue().content;
    axios
      .post("/api/v1/comments/create", { content, userId, postId })
      .then(async (response) => {
        if (response.status === 200) {
          await message.success("评论成功", 0.3);
          form.resetFields();
          await reFetchComments();
        } else {
          await message.error("评论失败");
        }
      });
  }, []);

  const reFetchComments = useCallback(async () => {
    const response = await axios.get(`/api/v1/comments/fetch?postId=${postId}`);
    response.data?.forEach((item: KeyValMap) => {
      item.isVisible = false;
    });
    setCommentData(response.data);
  }, []);

  const removeComment = useCallback((comment: any) => {
    axios
      .post(`/api/v1/comments/delete`, { uuid: comment.uuid })
      .then(async (response) => {
        if (response.status === 200) {
          await message.success("删除成功", 0.5);
          await reFetchComments();
        } else {
          await message.error("删除失败");
        }
      });
  }, []);
  const updateComment = useCallback((index: number, comment: KeyValMap) => {
    axios
      .patch("/api/v1/comments/update", { comment })
      .then(async (response) => {
        if (response.status === 200) {
          updateCommentVal(index, {
            isVisible: false,
            content: comment.newContent,
          });
        }
      });
  }, []);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const updateCommentVal = (index: number, newVal: KeyValMap) => {
    const updatedComments = commentData.map((comment, i) =>
      i === index ? { ...comment, ...newVal } : comment
    );
    setCommentData(updatedComments);
  };
  return (
    <div className={`${styles.commentContainer} tw-p-2.5`}>
      <div className="commentBox tw-flex tw-flex-col tw-px-2.5">
        <div className="userInfo tw-flex tw-gap-3.5 tw-items-center">
          <div>
            <BoringAvatars
              size={20}
              name={user?.id?.toString()}
            ></BoringAvatars>
          </div>
          <p>{user?.username}</p>
        </div>
        <div className={`${styles.inputBox} tw-flex-1`}>
          <Form form={form}>
            <Form.Item name="content">
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
      <div className="commentList tw-mt-5 tw-flex tw-flex-col tw-gap-2.5">
        {commentData.map((comment, index) => {
          const content = (
            <Card className={`${styles.commentActionCard}`} bordered={false}>
              <div className={"tw-flex tw-flex-col tw-gap-2.5"}>
                <Button
                  type="text"
                  className={"tw-w-full"}
                  onClick={() => updateCommentVal(index, { isVisible: true })}
                >
                  修改
                </Button>
                <Button
                  danger
                  type="text"
                  onClick={() => removeComment(comment)}
                >
                  删除
                </Button>
              </div>
            </Card>
          );
          return (
            <div className={"inner tw-flex tw-flex-col tw-gap-2.5"} key={index}>
              <div className="userBox tw-flex tw-justify-between tw-pr-2.5">
                <div className="avatar">
                  <BoringAvatars
                    size={20}
                    name={comment?.userId}
                  ></BoringAvatars>
                </div>
                <div className={`${styles.commentAction} tw-cursor-pointer`}>
                  <Popover
                    content={content}
                    trigger="click"
                    placement={"bottom"}
                  >
                    <SmallDashOutlined />
                  </Popover>
                </div>
              </div>
              {comment.isVisible ? (
                <div className={"tw-flex tw-flex-col "}>
                  <Input
                    placeholder="Basic usage"
                    onChange={(e) =>
                      updateCommentVal(index, { newContent: e.target.value })
                    }
                  />
                  <div className={"tw-flex tw-gap-2.5 tw-justify-end"}>
                    <Button
                      type="text"
                      onClick={() =>
                        updateCommentVal(index, { isVisible: false })
                      }
                    >
                      取消
                    </Button>
                    <Button
                      type="text"
                      onClick={() => updateComment(index, comment)}
                    >
                      确定
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="comment">{comment.content}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AppComment;
