const commas = (input: string | number | null | undefined) => {
  // 입력값이 null 또는 undefined인 경우 빈 문자열 반환
  if (input === null || input === undefined) {
      return '';
  }

  // 입력값이 문자열인 경우 숫자로 변환
  const numberValue = typeof input === 'string' ? parseFloat(input) : input;

  // 숫자가 아니라면 0으로 처리
  if (isNaN(numberValue)) {
    return '0';
  }

  // 음수와 양수 모두에 쉼표 추가
  return numberValue.toLocaleString('en', { maximumFractionDigits: 0 });
}


const date = (offset = 0, unit = 'day', format = 'YYYY-MM-DD') => {
   const currentDate = new Date();
 
   switch (unit) {
     case 'day':
       currentDate.setDate(currentDate.getDate() + offset);
       break;
     case 'month':
       currentDate.setMonth(currentDate.getMonth() + offset);
       break;
     case 'year':
       currentDate.setFullYear(currentDate.getFullYear() + offset);
       break;
     default:
       throw new Error('Unsupported unit. Use "day", "month", or "year".');
   }
 
   return formatDate(currentDate, format);
 };
 
 const formatDate = (date:any, format:any) => {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
 
   const hours = String(date.getHours()).padStart(2, '0');
   const minutes = String(date.getMinutes()).padStart(2, '0');
   const seconds = String(date.getSeconds()).padStart(2, '0');
 
   return format
     .replace('YYYY', year)
     .replace('MM', month)
     .replace('DD', day)
     .replace('HH', hours)
     .replace('mm', minutes)
     .replace('ss', seconds);
 };

 const formatCardNumber = (value: string) => {
  // 숫자만 남기기
  const cleanValue = value.replace(/\D/g, '');

  // 12자리까지만 유지
  const limitedValue = cleanValue.slice(0, 16);

  // 4자리마다 '-' 추가
  const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, '$1-');

  return formattedValue;  
};

const formatExpiryDate = (value: string) => {
  // 숫자만 남기기
  const cleanValue = value.replace(/\D/g, '');

  // 4자리까지만 유지 (MMYY)
  const limitedValue = cleanValue.slice(0, 4);

  // 2자리마다 '/' 추가
  const formattedValue = limitedValue.replace(/(\d{2})(?=\d)/g, '$1/');

  return formattedValue;
};


export { commas, date, formatCardNumber, formatExpiryDate };