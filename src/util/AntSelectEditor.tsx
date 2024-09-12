import React from "react";
import { createRoot } from "react-dom/client"; // React 18에서 createRoot 사용
import { Select } from "antd";

import { SelectValue } from "antd/lib/select";

// Select Option 인터페이스 정의
interface SelectOption {
  label: string;
  value: string;
}

interface CustomAntSelectEditorProps {
  columnInfo: {
    editor: {
      options: {
        listItems: Array<SelectOption>;
        onChange?: (value: string) => void;
      };
    };
  };
  value: string;
}

class CustomAntSelectEditor {
  el: HTMLElement;
  listItems: Array<SelectOption>;
  value: string;
  onChange?: (value: string) => void;
  root: any; // createRoot로 사용될 root

  constructor(props: CustomAntSelectEditorProps) {
    this.el = document.createElement("div");
    this.el.className = "custom-ant-select-editor";
    const { columnInfo, value } = props;
    this.listItems = columnInfo.editor.options.listItems;
    this.value = value;
    this.onChange = columnInfo.editor.options.onChange;
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.value;
  }

  mounted() {
    const AntSelectComponent = () => {
      const handleChange = (value: SelectValue) => {
        this.value = value as string;
        if (this.onChange) {
          this.onChange(this.value);
        }
      };

      return (
        <Select
          showSearch // 검색 기능 활성화
          defaultValue={this.value}
          onChange={handleChange}
          style={{ width: "100%" }}
          filterOption={(input, option) =>
            typeof option?.label === "string" &&
            option.label.toLowerCase().includes(input.toLowerCase())
          } // 사용자 정의 검색 필터
          optionFilterProp="children" // 검색 대상 텍스트 지정
          optionLabelProp="children" // label을 옵션의 표시 텍스트로 설정
        >
          {this.listItems.map((item) => (
            <Select.Option key={item.value} value={item.value} label={item.label}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      );
    };

    // React 컴포넌트를 해당 DOM에 렌더링 (React 18 방식)
    this.root = createRoot(this.el);
    this.root.render(<AntSelectComponent />);
  }

  beforeDestroy() {
    if (this.root) {
      this.root.unmount(); // 컴포넌트 언마운트
    }
  }
}

export default CustomAntSelectEditor;
