interface Postcode {
    open: () => void;
 }
 
 interface Daum {
    Postcode: new (options: { oncomplete: (data: any) => void }) => Postcode;
 }
 
 interface Window {
    daum: Daum;
 }
 