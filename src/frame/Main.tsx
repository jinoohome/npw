import React, { useEffect, useState, useRef, Suspense, lazy, ReactElement } from "react";
import Left from "./Left";
import Top from "./Top";
import Tab from "./Tab";
import Work from "./Work";
import Footer from "./Footer";
import { fetchPost } from "../util/fetch";
import { useNavigate } from "react-router-dom";
import { SOL_ZZ_MENU_RES, SOL_ZZ_MENU_API } from "../ts/SOL_ZZ_MENU";
import loadable from '@loadable/component';

const Main = () => {
   const navigate = useNavigate();
   const tabRef = useRef<HTMLDivElement>(null);

   const [allMenus, setAllMenus] = useState<SOL_ZZ_MENU_RES[]>([]);
   const [topMenus, setTopMenus] = useState<SOL_ZZ_MENU_RES[]>([]);
   const [leftMenus, setLeftMenus] = useState<SOL_ZZ_MENU_RES[]>([]);
   const [activeMenu, setActiveMenu] = useState<string>("");
   const [components, setComponents] = useState<any[]>([]);
   const [activeComp, setActiveComp] = useState<any>("");
   const [prevComps, setPrevComps] = useState<any[]>([]);
   const [leftMode, setLeftMode] = useState<string>("large");

   //--------------- change --------------------------
   useEffect(() => {
      SOL_ZZ_MENU();
   }, []);

   useEffect(() => {
      const isReloaded = sessionStorage.getItem("isReloaded");

      if (isReloaded) {
         navigate("/");
      } else {
         sessionStorage.setItem("isReloaded", "true");
      }

      return () => {
         sessionStorage.removeItem("isReloaded");
      };
   }, [navigate]);

   useEffect(() => {
      if (topMenus.length > 0) {
         handleTopMenuClick(topMenus[0]);
      }
   }, [topMenus]);

   useEffect(() => {
      activeControllTab();
   }, [prevComps]);



   //--------------- click --------------------------
   const handleLefMode = (mode: string) => {
      setLeftMode(mode);
   };

   const handleTopMenuClick = (topMenuItem: SOL_ZZ_MENU_RES) => {
      const selctMenus = allMenus.filter((menu: any) => menu.menuOrdr.includes(topMenuItem.menuOrdr));
      setLeftMenus(selctMenus);
      setActiveMenu(topMenuItem.menuOrdr);
   };

   const handleLeftMenuClick = (menuItem: SOL_ZZ_MENU_RES) => {
      addComponent(menuItem);
      if (tabRef.current) {
         setTimeout(() => {
            // Non-null assertion operator 사용
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
      setActiveComp('');
   };


   //-------------util-------------------------

   const addComponent = (menuItem: SOL_ZZ_MENU_RES) => {
      const componentName = capitalizeFirstLetter(menuItem.prgmId ?? "");
      const Component = loadable(() => import(`../work/${componentName}`), {
         // fallback: 옵션으로 로딩 중 표시할 컴포넌트를 지정할 수 있습니다.
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
   const SOL_ZZ_MENU = async () => {
      const param = {
         usrId: "sckcs",
         menuDiv: "",
      };

      const result = await SOL_ZZ_MENU_API(param);

      setAllMenus(result);
      const filterTopMenus = result.filter((x: any) => x.lev === 0);
      setTopMenus(filterTopMenus);
   };

   return (
      <div className="w-full h-full " >
         <div className="flex w-full h-full ">
            <div
               className={`h-full
                           ${leftMode === 'large' || leftMode === 'over' ? 'min-w-[230px] w-[13%] ' :'min-w-[50px] w-[3%]'}
            `}
            >
               <Left leftMenus={leftMenus} activeComp={activeComp} leftMode={leftMode} onLeftMenuClick={handleLeftMenuClick} onLeftMode={handleLefMode}></Left>
            </div>

            <div className="w-full h-full">
               <Top topMenus={topMenus} onTopMenuClick={handleTopMenuClick} activeMenu={activeMenu} leftMode={leftMode} onLeftMode={handleLefMode}></Top>
               <Tab components={components} onTabMenuClick={handleTabClick} onTabCloseClick={handleTabCloseClick} activeComp={activeComp} onAllTabCloseClick={handleAllTabCloseClick} tabRef={tabRef}></Tab>
               <Work components={components} activeComp={activeComp} ></Work>
            </div>
         </div>
         <Footer></Footer>
      </div>
   );
};

export default Main;
