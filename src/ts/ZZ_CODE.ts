import { fetchPost } from "../util/fetch"; //

export interface ZZ_CODE_REQ {
   coCd: string;
   majorCode: string;
   div: string;
}

export interface ZZ_CODE_RES {
   code: string;
   codeName: string;
   sort : number;
   value : string;
   text : string;
   label : string;
}

export const ZZ_CODE_API = async (param: ZZ_CODE_REQ) => {

   try {
      const result = await fetchPost(`ZZ_CODE`, param);
      return result;
   } catch (error) {
      console.error("ZZ_CODE:", error);
      throw error;
   }
};
