const commas = (number: number) => {
   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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



export { commas, date };