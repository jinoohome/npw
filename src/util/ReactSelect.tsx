import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { createRoot } from "react-dom/client";

interface CustomSelectEditorProps {
  columnInfo: {
    editor: {
      options: {
        listItems: Array<{ text: string; value: string }>; // text와 value를 사용
        onChange?: (value: string) => void;
      };
    };
  };
  value: string;
}

class CustomSelectEditor {
  el: HTMLElement;
  listItems: Array<{ text: string; value: string }>;
  initialValue: string;
  onChange?: (value: string) => void;
  root: any;
  setSelectedValue: any;

  constructor(props: CustomSelectEditorProps) {
    const { columnInfo, value } = props;

    this.el = document.createElement("div");
    this.listItems = columnInfo.editor.options.listItems || [];
    this.initialValue = value || ""; // 기본값 설정
    this.onChange = columnInfo.editor.options.onChange;
    this.root = null;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    const selectedElement = this.el.querySelector(".custom-select-editor");
    if (selectedElement) {
      const selectedOption = selectedElement.getAttribute("data-value");
      return selectedOption || this.initialValue;
    }
    return this.initialValue;
  }

  mounted() {
    const listItems = this.listItems;
    const onChange = this.onChange;

    const CustomSelectComponent = () => {
      const [selectedValue, setSelectedValue] = useState(this.initialValue);

      useEffect(() => {
        // 초기값을 설정
        setSelectedValue(this.initialValue);
      }, [this.initialValue]);

      // listItems를 React-Select에 맞는 형식으로 변환
      const options = listItems.map((item) => ({
        value: item.value,
        label: item.text, // text를 label로 매핑
      }));

      return (
        <Select
          value={options.find((option) => option.value === selectedValue) || null} // 선택된 값
          options={options} // 변환된 옵션 배열 전달
          onChange={(selected: SingleValue<{ value: string; label: string }>) => {
            if (selected) {
              setSelectedValue(selected.value); // 선택된 값을 상태로 설정
              if (onChange) {
                onChange(selected.value); // 선택된 값 콜백
              }
            }
          }}
          classNamePrefix="custom-select"
          isClearable
          menuPlacement="auto"
          placeholder="Select an option"
          noOptionsMessage={() => "No options available"}
        />
      );
    };

    // React 컴포넌트 렌더링
    this.root = createRoot(this.el);
    this.root.render(<CustomSelectComponent />);
  }

  beforeDestroy() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

export default CustomSelectEditor;
