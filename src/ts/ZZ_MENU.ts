import { fetchPost } from "../util/fetch"; //


export interface ZZ_MENU_REQ {
   usrId: string
   menuDiv: string,
}

export interface ZZ_MENU_RES {
   status: string;
   menuId: string;
   menuDiv: string;
   paMenuId: string | null;
   menuName: string;
   description: string;
   prgmId: string | null;
   prgmFullPath: string | null;
   prgmPath: string | null;
   prgmFileName: string | null;
   menuOrdr: string;
   remark: string | null;
   icon: string;
   useYn: string;
   lev: number;
   zMenuOrdr: string;
 }

 export const ZZ_MENU_API = async (param:ZZ_MENU_REQ) => {

   try {
     const result = await fetchPost(`ZZ_MENU`, param);
     return result; 
   } catch (error) {
     console.error("ZZ_MENU:", error);
     throw error; 
   }
 };
