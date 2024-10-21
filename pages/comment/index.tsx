import CommentInputBox from "@/components/comment/inputBox/inputBox";
import { KeyValMap } from "@/constants/common-type";
import { useGlobalState } from "@/context/globalStateContext";
import { SmallDashOutlined } from "@ant-design/icons";
import { Button, Card, Divider, message, Popover } from "antd";
import axios from "axios";
import BoringAvatars from "boring-avatars";
import { NextPage } from "next";
import { useCallback, useState } from "react";
import styles from "./styles/index.module.scss";

interface CommentProps {
  userId: number;
  postId: number;
  commentData: KeyValMap[] | null;
  syncCommentData: (data: KeyValMap[]) => void;
}
const processCommentData = (dataArr: KeyValMap[]) => {
  dataArr.sort((a, b) => a.id - b.id);
  dataArr.forEach((data: KeyValMap) => {
    data.isVisible = false;
  });
  return dataArr;
};

const AppComment: NextPage<CommentProps> = (props) => {
  let {
    userId,
    postId,
    commentData: initialCommentData,
    syncCommentData,
  } = props;
  const { user, userInfoMap } = useGlobalState();
  const [mainCommentContent, setMainCommentContent] = useState("");
  const [commentData, setCommentData] = useState<KeyValMap[]>(
    processCommentData(initialCommentData) || []
  );
  const [editCommentPopoverState, setEditCommentPopoverState] = useState<{
    [key: number]: boolean;
  }>({});

  const createComment = useCallback(
    (content: string) => {
      axios
        .post("/api/v1/comments/create", { content, userId, postId })
        .then(async (response) => {
          if (response.status === 200) {
            await message.success("评论成功", 0.3);
            setMainCommentContent("");
            await reFetchComments();
          } else if (response.status === 401) {
            await message.error("请先登录");
          } else {
            await message.error("评论失败");
          }
        });
    },
    [mainCommentContent]
  );

  const reFetchComments = useCallback(async () => {
    const response = await axios.get(`/api/v1/comments/fetch?postId=${postId}`);
    response.data?.forEach((item: KeyValMap) => {
      item.isVisible = false;
    });
    setCommentData(response.data);
    syncCommentData(response.data);
  }, []);

  const removeComment = useCallback((comment: any, index: number) => {
    axios
      .post(`/api/v1/comments/delete`, { id: comment.id })
      .then(async (response) => {
        if (response.status === 200) {
          await message.success("删除成功", 0.5);
          await reFetchComments();
        } else {
          await message.error("删除失败");
        }
      })
      .finally(() => {
        setEditCommentPopoverState({
          ...editCommentPopoverState,
          [index]: false,
        });
      });
  }, []);

  const updateComment = useCallback((comment: KeyValMap) => {
    axios
      .patch("/api/v1/comments/update", { comment })
      .then(async (response) => {
        if (response.status === 200) {
          const response = await axios.get(
            `/api/v1/comments/fetch?postId=${postId}`
          );
          setCommentData(processCommentData(response.data));
        }
      });
  }, []);

  const updateCommentVal = (index: number, newVal: KeyValMap) => {
    const updatedComments = commentData.map((comment, i) =>
      i === index ? { ...comment, ...newVal } : comment
    );
    setCommentData(updatedComments);
  };
  const openEditComment = (index: number) => {
    updateCommentVal(index, { isVisible: true });
    setEditCommentPopoverState({
      ...editCommentPopoverState,
      [index]: false,
    });
  };
  return (
    <div className={`${styles.commentContainer}`}>
      <div className="commentBox tw-flex tw-gap-2">
        <div className="userInfo tw-flex tw-gap-3.5 tw-self-start">
          <BoringAvatars size={30} name={user?.id?.toString()}></BoringAvatars>
        </div>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-2">
          <CommentInputBox
            content={mainCommentContent}
            onContentChange={setMainCommentContent}
          ></CommentInputBox>
          <div className="actionBox  tw-flex tw-justify-end">
            <Button
              type={"primary"}
              onClick={() => createComment(mainCommentContent)}
            >
              发送
            </Button>
          </div>
        </div>
      </div>
      {/* 已添加的评论 */}
      <div className="commentList tw-mt-5 tw-flex tw-flex-col tw-gap-2.5">
        {commentData.map((comment, index) => {
          const editCommentPopover = (
            <Card className={`${styles.commentActionCard}`} bordered={false}>
              <div className={"tw-flex tw-flex-col tw-gap-2.5"}>
                <Button
                  type="text"
                  className={"tw-w-full"}
                  onClick={() => openEditComment(index)}
                >
                  修改
                </Button>
                <Button
                  danger
                  type="text"
                  onClick={() => removeComment(comment, index)}
                >
                  删除
                </Button>
              </div>
            </Card>
          );
          return (
            <div className={"inner tw-flex tw-flex-col tw-gap-2.5"} key={index}>
              <div className="userBox tw-flex tw-justify-between tw-pr-2.5">
                <div className="avatar tw-flex tw-items-center tw-gap-2.5">
                  <BoringAvatars
                    size={20}
                    name={comment?.userId?.toString()}
                  ></BoringAvatars>
                  <span>{userInfoMap?.[comment?.userId]?.username}</span>
                </div>
                <div
                  className={`${styles.commentAction} tw-cursor-pointer`}
                  hidden={comment?.userId !== user?.id}
                >
                  <Popover
                    content={editCommentPopover}
                    trigger="click"
                    placement={"bottom"}
                    open={editCommentPopoverState[index]}
                    onOpenChange={(open) =>
                      setEditCommentPopoverState({
                        ...editCommentPopoverState,
                        [index]: open,
                      })
                    }
                  >
                    <SmallDashOutlined />
                  </Popover>
                </div>
              </div>
              {comment.isVisible ? (
                <div className={"tw-flex tw-flex-col "}>
                  {/* 编辑评论的输入框 */}

                  <CommentInputBox
                    content={comment.content}
                    onContentChange={(content) => {
                      updateCommentVal(index, { newContent: content });
                    }}
                  ></CommentInputBox>
                  <div className={"tw-flex tw-gap-2.5 tw-justify-end tw-mt-2"}>
                    <Button
                      type="text"
                      onClick={() =>
                        updateCommentVal(index, {
                          isVisible: false,
                          newContent: undefined,
                        })
                      }
                    >
                      取消
                    </Button>
                    <Button
                      type={"primary"}
                      onClick={() =>
                        updateComment({
                          ...comment,
                          content: comment.newContent,
                        })
                      }
                    >
                      确定
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="comment">{comment.content}</div>
              )}
              {/*  */}
              <Divider style={{ margin: "5px 0" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AppComment;
