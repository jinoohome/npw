import React from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import "../css/gridChoicejs.css";

interface CustomSelectEditorProps {
   columnInfo: {
      editor: {
         options: {
            listItems: Array<{ text: string; value: string }>;
         };
      };
   };
   value: string;
}

class CustomSelectEditor {
   el: HTMLSelectElement;
   value: string;
   choices: Choices | null;
   listItems: Array<{ text: string; value: string }>;

   constructor(props: CustomSelectEditorProps) {
      this.el = document.createElement("select");
      this.el.className = "custom-select-editor";
      const { columnInfo, value } = props;
      this.listItems = columnInfo.editor.options.listItems;
      this.value = value;
      this.choices = null;
   }

   getElement(): HTMLElement {
      return this.el;
   }
   getValue(): string {
      const value = this.choices ? this.choices.getValue() : this.el.value;
      if (Array.isArray(value)) {
         return value.map((item) => (typeof item === "object" && item !== null ? item.value : item)).join(",");
      } else if (typeof value === "object" && value !== null) {
         return value.value;
      } else {
         return value;
      }
   }

   mounted() {
      this.choices = new Choices(this.el, {
         removeItemButton: false,
         shouldSort: false,
         itemSelectText: "",
      });

      this.choices.setChoices(
         this.listItems.map((item) => ({
            value: item.value,
            label: item.text,
         })),
         "value",
         "label",
         false
      );

      if (this.value) {
         this.choices.setChoiceByValue(this.value); // 선택된 값을 설정
      }
      this.choices.containerOuter.element.addEventListener(
         "mousedown",
         (event) => {
            event.stopPropagation();
         },
         true
      );
   }
}

export default CustomSelectEditor;
