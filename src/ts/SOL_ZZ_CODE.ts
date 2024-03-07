import { fetchPost } from "../util/fetch"; //

export interface SOL_ZZ_CODE_REQ {
   coCd: string;
   majorCode: string;
   div: string;
}

export interface SOL_ZZ_CODE_RES {
   code: string;
   codeName: string;
   sort : number;
   value : string;
   text : string;
   label : string;
}

export const SOL_ZZ_CODE_API = async (param: SOL_ZZ_CODE_REQ) => {

   try {
      const result = await fetchPost(`SOL_ZZ_CODE`, param);
      return result;
   } catch (error) {
      console.error("SOL_ZZ_CODE:", error);
      throw error;
   }
};
