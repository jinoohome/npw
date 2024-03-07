import { fetchPost } from "../util/fetch"; //


export interface SOL_ZZ_MENU_REQ {
   usrId: string
   menuDiv: string,
}

export interface SOL_ZZ_MENU_RES {
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

 export const SOL_ZZ_MENU_API = async (param:SOL_ZZ_MENU_REQ) => {

   try {
     const result = await fetchPost(`SOL_ZZ_MENU`, param);
     return result; 
   } catch (error) {
     console.error("SOL_ZZ_MENU:", error);
     throw error; 
   }
 };
