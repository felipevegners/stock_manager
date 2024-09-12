/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, Input, message, Tag, theme, Tooltip } from "antd";
import { CategoriesContext } from "../pages/Categories/CategoriesContext";
const tagInputStyle = {
  width: 84,
  fontSize: 16,
  padding: "6px 10px",
  marginInlineEnd: 8,
  verticalAlign: "top"
};
const CategoriesTags = ({ tagsData }) => {
  const { updateCategories } = useContext(CategoriesContext);

  const { token } = theme.useToken();
  const [tags, setTags] = useState(tagsData.content);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const handleUpdateCategory = async (newCatData) => {
    const { id } = tagsData;
    await updateCategories(id, { content: newCatData }).then((result) => {
      if (result?.response?.status === 400) {
        message.error("Erro ao atualizar dados da categoria. Tente novamente.");
      } else {
        message.success(result.message);
        // setTimeout(() => {}, 1000);
      }
    });
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    handleUpdateCategory(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      handleUpdateCategory([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    console.log("Handle Edit Input Confirm -> ", newTags);
    setEditInputIndex(-1);
    setEditInputValue("");
  };
  const tagPlusStyle = {
    padding: "6px 10px",
    background: token.colorBgContainer,
    borderStyle: "dashed"
  };
  return (
    <Flex gap="4px 0" wrap>
      {tags?.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="large"
              style={tagInputStyle}
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable={true}
            style={{
              userSelect: "none",
              backgroundColor: "#ccc",
              borderColor: "#001529",
              padding: "6px 10px"
            }}
            closeIcon={<CloseOutlined style={{ color: "#001529" }} />}
            onClose={() => handleClose(tag)}
          >
            <span
              style={{ fontSize: 16 }}
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          Adicionar
        </Tag>
      )}
    </Flex>
  );
};
export default CategoriesTags;
