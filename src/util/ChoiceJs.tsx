import Choices from 'choices.js';
import "../css/inputChoicejs.css";
import "../css/gridChoicejs.css";
import "choices.js/public/assets/styles/choices.min.css";


interface ChoiceOption {
  value: string;
  label: string;
  selected?: boolean;
}

const initChoice = (
  inputRef: React.RefObject<HTMLElement>,
  setChoice: (choice: Choices) => void,
  initialChoices?: ChoiceOption[]
): void => {
  if (inputRef.current) {
    let newChoices = new Choices(inputRef.current, {
      removeItemButton: false,
      shouldSort: false,
      itemSelectText: "",
      allowHTML: true,
    });

    setChoice(newChoices);

    if (initialChoices && initialChoices.length > 0) {
      newChoices.setChoices(initialChoices, "value", "label", false);
    }
  } else {
    console.error("DOM 요소가 없습니다.", inputRef);
  }
};


const updateChoices = (choiceInstance: any, originalData: any, valueKey: any, labelKey: any, defaultValue = "999") => {
  let data = Array.isArray(originalData) ? [...originalData] : [];

  if (defaultValue === "") {
     data.unshift({ [valueKey]: "", [labelKey]: "" }); // data 배열을 직접 수정하지 않고, 새로운 요소를 앞에 추가
  }

  if (choiceInstance && data.length > 0) {
     let currentValue = choiceInstance.getValue(true) || defaultValue;
     choiceInstance.clearChoices();
     choiceInstance.setChoices(() => [
        ...data.map((item: any) => ({
           value: item[valueKey],
           label: item[labelKey],
           selected: item[valueKey] === currentValue,
        })),
     ]);
  }
};
export { initChoice, updateChoices };