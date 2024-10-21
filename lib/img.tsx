export const sanitizeContent = (text: string) => {
  // 移除 ![](base64 图片数据) 格式的图片
  return text.replace(/!\[.*?\]\((.*?)\)/g, "[图片]");
};
