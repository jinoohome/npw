import React, { useEffect, useState, useRef } from "react";
import Left from "./Left";
import Top from "./Top";
import Tab from "./Tab";
import Work from "./Work";
import Footer from "./Footer";
import { fetchPost } from "../util/fetch";
import { useNavigate, useLocation } from "react-router-dom";
import { ZZ_MENU_RES, ZZ_MENU_API } from "../ts/ZZ_MENU";
import loadable from "@loadable/component";
import { motion } from "framer-motion";

function Main() {
   const navigate = useNavigate();
   const { state } = useLocation();
   const tabRef = useRef<HTMLDivElement>(null);


   const [allMenus, setAllMenus] = useState<ZZ_MENU_RES[]>([]);
   const [topMenus, setTopMenus] = useState<ZZ_MENU_RES[]>([]);
   const [leftMenus, setLeftMenus] = useState<ZZ_MENU_RES[]>([]);
   const [activeMenu, setActiveMenu] = useState<string>("");
   const [components, setComponents] = useState<any[]>([]);
   const [activeComp, setActiveComp] = useState<any>("");
   const [prevComps, setPrevComps] = useState<any[]>([]);
   const [loginInfo, setLoginInfo] = useState<any>();
   const [userInfo, setUserInfor] = useState<any>();
   const [leftMode, setLeftMode] = useState<string>("large");
   const [isInitialLoad, setIsInitialLoad] = useState(true);
   const [loading, setLoading] = useState(false); // 로딩 상태 추가
   const [searchMenus, setSearchMenus] = useState<ZZ_MENU_RES[]>([]);

   //--------------- change --------------------------
   useEffect(() => {
      const loginId = JSON.parse(sessionStorage.getItem("loginInfo") || "{}")?.usrId;
       init(loginId);
   }, []);



   useEffect(() => {
      const isReloaded = sessionStorage.getItem("isReloaded");

      if (isReloaded) {
         navigate("/Main");
      } else {
         sessionStorage.setItem("isReloaded", "true");
      }

      return () => {
         sessionStorage.removeItem("isReloaded");
      };
   }, [navigate]);

   useEffect(() => {
      console.log(topMenus.length)
      if (topMenus.length > 0) {
         handleTopMenuClick(topMenus[0]);
      }
   }, [topMenus]);

   useEffect(() => {
      if (leftMenus.length > 0 && isInitialLoad) {
         let firstMenu = leftMenus.filter((menu: any) => menu.lev === 2);
         if (firstMenu.length > 0) {
            handleLeftMenuClick(firstMenu[0]);
            setIsInitialLoad(false);
         }
      }
   }, [leftMenus, isInitialLoad]);

   useEffect(() => {
      activeControllTab();
   }, [prevComps]);


   useEffect(() => {
      if(userInfo) {
         let loginId = JSON.parse(sessionStorage.getItem("loginInfo") || "{}")?.usrId;
         if(loginId === userInfo.usrId) {
            setLoginInfo(userInfo);
         }
         
      }
   }, [userInfo]);


   const init = async (usrId:string) => {
 
      if (usrId) {
         try {
            let result = await Promise.all([ZZ_USER_INFO(usrId), ZZ_MENU(usrId)]);
            setLoading(true);
         } catch (error) { 
            setLoading(true); 
         }
      }
    };

   //--------------- click --------------------------
   const handleLefMode = (mode: string) => {
      setLeftMode(mode);
   };

   const handleUserChange = (usrId: string) => {
      setAllMenus([]);
      setSearchMenus([]);
      setTopMenus([]);
      setLeftMenus([]);
      setActiveMenu("");
      setComponents([]);
      setActiveComp("");
      setPrevComps([]);
      setUserInfor({});
      setLoading(false);
      init(usrId);
   };

   const handleTopMenuClick = (topMenuItem: ZZ_MENU_RES) => {
      const selctMenus = allMenus.filter((menu: any) => menu.menuOrdr.includes(topMenuItem.menuOrdr));
      setLeftMenus(selctMenus);
      setActiveMenu(topMenuItem.menuOrdr);
      
   };

   const handleLeftMenuClick = (menuItem: ZZ_MENU_RES) => {
      addComponent(menuItem);
      if (tabRef.current) {
         setTimeout(() => {
            const maxScrollLeft = tabRef.current!.scrollWidth - tabRef.current!.clientWidth;
            tabRef.current!.scrollLeft = maxScrollLeft;
         }, 100); // 100ms 지연
      }
   };

   const handleTabClick = (item: any) => {
      setPrevComps((prev) => prev.filter((tabItem) => tabItem.id !== item.id));
      setPrevComps((prev) => [...prev, item]);
      setActiveComp(item);
   };

   const handleTabCloseClick = (item: any) => {
      removeComponent(item.id);
   };

   const handleAllTabCloseClick = () => {
      setComponents([]);
      setPrevComps([]);
      setActiveComp("");
   };

   //-------------util-------------------------
   const addComponent = (menuItem: ZZ_MENU_RES) => {
      const [folder, fileName] = (menuItem.prgmFullPath ?? "").split('/');
      const componentName = capitalizeFirstLetter(fileName ?? "");
      const Component = loadable(() => import(`../work/${folder}/${componentName}`), {
         fallback: <div>Loading...</div>,
      });
      const newComponent = {
         id: `menu${components.length + 1}`,
         name: menuItem.menuName,
         menuId: menuItem.menuId,
         paMenuId: menuItem.paMenuId,
         Component,
      };
      setComponents((prev) => [...prev, newComponent]);
      setPrevComps((prev) => [...prev, newComponent]);
      setActiveComp(newComponent);
   };

   const removeComponent = (componentId: string) => {
      setComponents((prevComponents) => prevComponents.filter((component) => component.id !== componentId));
      setPrevComps((prev) => prev.filter((item) => item.id !== componentId));
   };

   const activeControllTab = () => {
      if (prevComps.length > 0) {
         const lastComp = prevComps[prevComps.length - 1];
         setActiveComp(lastComp);
      } else {
         setActiveComp("");
      }
   };

   const capitalizeFirstLetter = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
   };

   //--------------- api --------------------------
   const ZZ_MENU = async (usrId: string) => {
      let param = {
         usrId: usrId,
         menuDiv: "",
      };

      let result = await ZZ_MENU_API(param);

    
      setAllMenus(result);
      let filterTopMenus = result.filter((x: any) => x.lev === 0);
      setTopMenus(filterTopMenus);
     
      let filterSearchMenus = result.filter((x: any) => x.lev === 0 || x.lev === 2);
      setSearchMenus(filterSearchMenus);
   };

   const ZZ_USER_INFO = async (usrId: string) => {
      if (usrId) {
         let param = {
            usrId: usrId,
         };

         try {
            const data = JSON.stringify(param);
            let result = await fetchPost(`ZZ_USER_INFO`, { data });
            setUserInfor(result);
         } catch (error) {
            console.error("ZZ_USER_INFO Error:", error);
            throw error;
         }
      }
   };

   return (
      <div className="w-full h-full ">
         {loading && (
         <div className="flex w-full h-full ">
            <motion.div animate={{ width: leftMode === "large" || leftMode === "over" ? "13%" : "3%", minWidth: leftMode === "large" || leftMode === "over" ? 230 : 50 }} transition={{ duration: 0.1, ease: "easeInOut" }} className={`h-full`}>
               <Left leftMenus={leftMenus} activeComp={activeComp} leftMode={leftMode} onLeftMenuClick={handleLeftMenuClick} onLeftMode={handleLefMode}></Left>
            </motion.div>

            <motion.div animate={{ width: leftMode === "large" || leftMode === "over" ? "87%" : "97%" }} transition={{ duration: 0.1, ease: "easeInOut" }} className="w-full h-full">
               <Top loginInfo={loginInfo} userInfo={userInfo} topMenus={topMenus}  searchMenus={searchMenus} onTopMenuClick={handleTopMenuClick} activeMenu={activeMenu} leftMode={leftMode} onLeftMode={handleLefMode} onUserChange={handleUserChange} onSearchMenuClick={handleLeftMenuClick} ></Top>
               <Tab components={components} onTabMenuClick={handleTabClick} onTabCloseClick={handleTabCloseClick} activeComp={activeComp} onAllTabCloseClick={handleAllTabCloseClick} tabRef={tabRef}></Tab>
               <Work components={components} activeComp={activeComp} leftMode={leftMode} userInfo={userInfo}></Work>
            </motion.div>
         </div>
         )}
         <Footer></Footer>
      </div>
   );
}

export default Main;
