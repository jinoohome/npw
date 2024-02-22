import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css'; // 스타일 추가

class CustomSelectEditor {
  constructor(props) {
    this.el = document.createElement('select');
    this.el.className = 'custom-select-editor'; // Choices.js가 타겟팅할 클래스 이름
    const { columnInfo } = props;

    columnInfo.editor.options.listItems.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.text;
      this.el.appendChild(option);
    });

    this.value = props.value;
    this.choices = null; // Choices 인스턴스를 저장할 변수
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.choices ? this.choices.getValue(true) : this.el.value;
  }

  mounted() {
    // mounted에서 Choices 인스턴스를 초기화
    this.choices = new Choices(this.el, {
      searchEnabled: true, // 검색 활성화
      itemSelectText: '', // 선택 텍스트 커스터마이징
      // 추가 Choices.js 설정...
    });

    // 초기 선택값 설정
    this.choices.setChoiceByValue(this.value);
    // 드롭다운 컨테이너에 대한 스타일 적용
  const container = this.el.closest('.choices'); // '.choices'는 Choices.js 드롭다운의 최상위 요소 클래스입니다.
  // if (container) {
  //   container.style.position = 'relative';
  //   container.style.zIndex = '30000'; // 충분히 높은 값으로 설정
  // }
  }
}

export default CustomSelectEditor;
