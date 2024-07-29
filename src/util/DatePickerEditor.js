import { format, parseISO } from 'date-fns';
import '../css/dateFns.css';

class DatePickerEditor {
  constructor(props) {
 this.props = props;
    this.el = document.createElement('input');
    this.el.type = 'date';
    this.el.value = props.value ? format(parseISO(props.value), 'yyyy-MM-dd') : '';
    this.el.className = 'custom-date-picker'; // 클래스를 추가합니다.

    this.el.addEventListener('change', this.handleChange.bind(this));
  }

  getElement() {
    return this.el;
  }

  getValue() {
    return this.el.value;
  }

  mounted() {
    this.el.focus();
  }

  handleChange(event) {
    if (this.props.onBlur) {
      this.props.onBlur(); // Notify the grid that editing is complete
    }
  }

  beforeDestroy() {
    this.el.removeEventListener('change', this.handleChange);
  }
}

export default DatePickerEditor;
