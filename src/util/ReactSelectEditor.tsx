import React from "react";
import { createRoot } from "react-dom/client";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "../css/gridSelectjs.css";
import { read } from "fs";

interface SelectOption {
  text: string;
  value: string;
}

interface CustomMUISelectEditorProps {
  columnInfo: {
    editor: {
      options: {
        listItems: Array<SelectOption>; // Choices.js와 동일한 구조로 유지
        onChange?: (value: string) => void;
        readonly?: boolean;
      };
    };
  };
  value: string;
}

class CustomMUISelectEditor {
  el: HTMLElement;
  value: string;
  listItems: Array<SelectOption>;
  onChange?: (value: string, event?:any)  => void;
  root: any;
  readonly: boolean;

  constructor(props: CustomMUISelectEditorProps) {
    this.el = document.createElement("div");
    this.el.className = "custom-mui-select-editor";
    const { columnInfo, value } = props;
    this.listItems = columnInfo.editor.options.listItems;
    this.value = value;
    this.onChange = columnInfo.editor.options.onChange;
    this.root = null;
    this.readonly = columnInfo.editor.options.readonly || false;
  }

  getElement(): HTMLElement {
    return this.el;
  }

  getValue(): string {
    const selectedValue = this.el.getAttribute("data-selected-value");
    return selectedValue || this.value;
  }

  mounted() {
    const MUIAutocompleteComponent = () => {
      const [selectedOption, setSelectedOption] = React.useState<SelectOption | null>(
        this.listItems.find((option) => option.value === this.value) || null
      );

      const handleChange = (event: any, option: SelectOption | null) => {
  
        setSelectedOption(option);
        if (option) {
          this.el.setAttribute("data-selected-value", option.value);
          if (this.onChange) {
            this.onChange(option.value, event);
          }
        }
      };

      return (
        <Autocomplete
        
          value={selectedOption || null}
          onChange={handleChange}
          options={this.listItems}
          getOptionLabel={(option) => option.text} // text와 value 구조 유지
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                style: { height: "100%", padding: 0 },
                endAdornment: null,
              }}
              inputProps={{
                ...params.inputProps,
                style: { padding: "0 8px", fontSize: "12px" },
              }}
            />
          )}
          autoHighlight
          openOnFocus
          readOnly={this.readonly}
          renderOption={(props, option) => {
            const { key, ...rest } = props; // props에서 key를 제거
          
            return (
              <li key={option.value} {...rest} style={{ fontSize: "12px" }}>
                {option.text}
              </li>
            );
          }}
        />
      );
    };

    this.root = createRoot(this.el);
    this.root.render(<MUIAutocompleteComponent />);
  }

  beforeDestroy() {

    if (this.root) {
    this.root.unmount(); // Ensure the root is unmounted
    this.el.remove();    // Remove the element after unmounting
    this.root = null;
    }
  }
}


export default CustomMUISelectEditor;
