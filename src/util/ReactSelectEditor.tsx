import React, { useState } from "react";
import ReactDOM from "react-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "../css/gridSelectjs.css";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomMUISelectEditorProps {
  columnInfo: {
    editor: {
      options: {
        listItems: Array<{ text: string; value: string }>;
        onChange?: (value: string) => void;
      };
    };
  };
  value: string;
}

class CustomMUISelectEditor {
  el: HTMLElement;
  value: string;
  listItems: Array<SelectOption>;
  onChange?: (value: string) => void;

  constructor(props: CustomMUISelectEditorProps) {
    this.el = document.createElement("div");
    this.el.className = "custom-mui-select-editor";
    const { columnInfo, value } = props;
    this.listItems = columnInfo.editor.options.listItems.map((item) => ({
      value: item.value,
      label: item.text,
    }));
    this.value = value;
    this.onChange = columnInfo.editor.options.onChange;
  }

  getElement(): HTMLElement {
    return this.el;
  }

  getValue(): string {
    const selectedValue = this.el.getAttribute("data-selected-value");
    return selectedValue || this.value;
  }

  mounted() {
    // 함수형 컴포넌트 내부에서 상태를 관리
    const MUIAutocompleteComponent = () => {
      const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
        this.listItems.find((option) => option.value === this.value) || null
      );

      const handleChange = (event: any, option: SelectOption | null) => {
        setSelectedOption(option);
        if (option) {
          this.el.setAttribute("data-selected-value", option.value);
          if (this.onChange) {
            this.onChange(option.value);
          }
        }
      };

      return (
        <Autocomplete
          value={selectedOption || null}
          onChange={handleChange}
          options={this.listItems}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                style: { height: "100%", padding: 0 }, // 입력창 높이를 그리드 셀에 맞춤
                endAdornment: null, // X 아이콘을 없앰
              }}
              inputProps={{
                ...params.inputProps,
                style: { padding: "0 8px", fontSize: "12px" }, // 입력창 패딩 및 폰트 크기 조정
              }}
              
            />
          )}
          autoHighlight
          openOnFocus // 포커스를 얻었을 때 자동으로 드롭다운 열림

          renderOption={(props, option) => (
            <li {...props} style={{ fontSize: '12px' }}> {/* 드롭다운 항목 글자 크기 설정 */}
              {option.label}
            </li>
          )}
        />
      );
    };

    // React 컴포넌트를 DOM에 렌더링
    ReactDOM.render(<MUIAutocompleteComponent />, this.el);
  }

  beforeDestroy() {
    if (this.el && this.el.parentNode) {
      ReactDOM.unmountComponentAtNode(this.el);
    }
  }
}

export default CustomMUISelectEditor;
