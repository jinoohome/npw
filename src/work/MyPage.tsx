import { React, useEffect, useState, Breadcrumb, CommonModal, alertSwal, InputComp2, SelectSearch, fetchPost } from "../comp/Import";
import { UserIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, KeyIcon, 
         ClockIcon, DocumentTextIcon, ChartBarIcon, Cog6ToothIcon, 
         BellIcon, ShieldCheckIcon, CalendarIcon, ArrowRightOnRectangleIcon,
         LockClosedIcon, SwatchIcon, UserCircleIcon, IdentificationIcon, ServerIcon } from "@heroicons/react/24/outline";
import { ZZ_MENU_RES } from "../ts/ZZ_MENU";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
   item: any;
   activeComp: any;
   leftMode: any;
   userInfo: any;
   handleAddMenuClick: (menuItem: ZZ_MENU_RES) => void;
   setSoNo: (value: string) => void;
}

const MyPage = ({ item, activeComp, leftMode, userInfo }: Props) => {
   const navigate = useNavigate();
   const breadcrumbItem = [{ name: "공통" }, { name: "마이페이지" }];
   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
   });

   // 사용자 정보 입력 필드 refs
   const refs = {
      usrId: useRef<any>(null),
      usrNm: useRef<any>(null),
      pwd: useRef<any>(null),
      usrDiv: useRef<any>(null),
      usrDivNm: useRef<any>(null),
      bpCd: useRef<any>(null),
      hp: useRef<any>(null),
      email: useRef<any>(null),
      useYn: useRef<any>(null),
      coCd: useRef<any>(null),
      usrStatus: useRef<any>(null),
   };

   // 사용자 정보 상태
   const [inputValues, setInputValues] = useState<{ [key: string]: any }>({
      coCd: '',
      usrId: '',
      usrNm: '',
      usrDiv: '',
      usrDivNm: '',
      bpCd: '',
      bpNm: '',
      email: '',
      hp: '',
      useYn: '',
      usrStatus: '',
   });

   // ZZ0301_S01 API 호출 함수
   const fetchUserData = async () => {
      try {
         const param = {
            coCd: userInfo.coCd,
            usrId: userInfo.usrId,
            usrNm: "999",
            usrDiv: "999",
            sysDiv: "999",
            bpNm: "999",
            useYn: "999"
         };

         const data = JSON.stringify(param);
         const result = await fetchPost(`ZZ0301_S01`, { data });

         if (result && result.length > 0) {
            const userData = result[0];
            setInputValues({
               coCd: userData.coCd || '',
               usrId: userData.usrId || '',
               usrNm: userData.usrNm || '',
               usrDiv: userData.usrDiv || '',
               usrDivNm: userData.usrDivNm || '',
               bpCd: userData.bpCd || '',
               bpNm: userData.bpNm || '',
               email: userData.email || '',
               hp: userData.hp || '',
               useYn: userData.useYn || '',
               usrStatus: userData.usrStatus || '',
            });

            // refs 업데이트
            Object.entries(userData).forEach(([key, value]) => {
               const ref = refs[key as keyof typeof refs];
               if (ref && ref.current) {
                  ref.current.value = value;
               }
            });
         }
      } catch (error) {
         console.error("Error fetching user data:", error);
      }
   };

   // 컴포넌트 마운트 시 사용자 데이터 가져오기
   useEffect(() => {
      fetchUserData();
   }, []);

   // 입력 필드 변경 핸들러
   const onInputChange = (name: string, value: any) => {
      setInputValues((prevValues) => {
         const currentValue = prevValues[name] ?? "";
         const newValue = value ?? "";

         if (currentValue === newValue) {
            return prevValues;
         }

         return {
            ...prevValues,
            [name]: newValue,
         };
      });
   };

   const handleLogout = () => {
      // 로그아웃 처리
      localStorage.removeItem('token');
      navigate('/');
   };

   const handlePasswordChange = async () => {
      // 비밀번호 변경 처리
      if (passwordData.newPassword !== passwordData.confirmPassword) {
         alertSwal('비밀번호가 일치하지 않습니다.', 'E', 'warning');
         return;
      }

      try {
         const param = {
            menuId: 'ZZ_PW_U01',
            insrtUserId: userInfo.usrId,
            data: JSON.stringify({
               usrId: userInfo.usrId,
               pwd: passwordData.currentPassword,
               newPwd: passwordData.newPassword
            })
         };

         const result = await fetchPost(`ZZ_PW_U01`, param);

         if (result && result.msgCd === '1') {
            alertSwal('비밀번호가 성공적으로 변경되었습니다.', result.msgCd, result.msgStatus);
            setIsPasswordModalOpen(false);
            setPasswordData({
               currentPassword: '',
               newPassword: '',
               confirmPassword: ''
            });
         } else {
            alertSwal('비밀번호 변경에 실패했습니다.', result.msgCd, result.msgStatus);
         }
      } catch (error) {
         console.error("Error changing password:", error);
         alertSwal('비밀번호 변경 중 오류가 발생했습니다.', 'E', 'warning');
      }
   };

   const buttonDiv = () => {
      return (
         <div className="flex space-x-2">
            <button 
               onClick={() => setIsPasswordModalOpen(true)}
               className="bg-yellow-500 text-white rounded-lg px-2 py-1 flex items-center shadow hover:bg-orange-600 transition-colors"
            >
               <LockClosedIcon className="w-5 h-5 mr-1" />
               <span>비밀번호 변경</span>
            </button>
            <button 
               onClick={handleLogout}
               className="bg-red-500 text-white rounded-lg px-2 py-1 flex items-center shadow hover:bg-red-600 transition-colors"
            >
               <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
               <span>로그아웃</span>
            </button>
         </div>
      );
   };

   // 사용자 정보 입력 폼
   const inputDiv = () => {
      // 부서명 결정 함수
      const getDepartmentName = (coCd: string) => {
         if (coCd === '100') return '장례지원단';
         if (coCd === '200') return '미래사업부';
         return '공통';
      };

      return (
         <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
               <div className="bg-blue-50 p-2 rounded-lg">
                  <SwatchIcon className="w-5 h-5 text-blue-500"></SwatchIcon>
               </div>
               <div className="font-medium text-gray-700 text-lg">사용자 정보</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <UserCircleIcon className="w-5 h-5 text-blue-500" />
                        <div>
                           <p className="text-xs text-gray-500">사용자 ID</p>
                           <p className="font-medium text-gray-800">{inputValues.usrId}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                        <BuildingOfficeIcon className="w-5 h-5 text-indigo-500" />
                        <div>
                           <p className="text-xs text-gray-500">사업부서</p>
                           <p className="font-medium text-gray-800">{getDepartmentName(inputValues.coCd)}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                        <IdentificationIcon className="w-5 h-5 text-purple-500" />
                        <div>
                           <p className="text-xs text-gray-500">사용자 구분</p>
                           <p className="font-medium text-gray-800">{inputValues.usrDivNm}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                        <BuildingOfficeIcon className="w-5 h-5 text-amber-500" />
                        <div>
                           <p className="text-xs text-gray-500">소속</p>
                           <p className="font-medium text-gray-800">{inputValues.bpNm || inputValues.bpCd || '정보 없음'}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                        <div>
                           <p className="text-xs text-gray-500">이메일</p>
                           <p className="font-medium text-gray-800">{inputValues.email || '정보 없음'}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <PhoneIcon className="w-5 h-5 text-green-500" />
                        <div>
                           <p className="text-xs text-gray-500">연락처</p>
                           <p className="font-medium text-gray-800">{inputValues.hp || '정보 없음'}</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-6 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-2">
                     <BellIcon className="w-5 h-5 text-gray-500" />
                     <span className="text-sm text-gray-700">계정 상태</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${inputValues.useYn === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {inputValues.useYn === 'Y' ? '활성' : '비활성'}
                  </div>
               </div>
            </div>
         </div>
      );
   };

   const renderProfile = () => {
      // 부서명 결정 함수
      const getDepartmentName = (coCd: string) => {
         if (coCd === '100') return '장례지원단';
         if (coCd === '200') return '미래사업부';
         return '공통';
      };

      return (
         <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-full">
                     <UserCircleIcon className="w-12 h-12 text-blue-500" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-bold text-gray-800">{inputValues.usrNm}</h3>
                        <span className="text-gray-500">({inputValues.usrId})</span>
                     </div>
                     <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                           <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
                           <span className="text-gray-700">{getDepartmentName(inputValues.coCd)  || '정보 없음'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <IdentificationIcon className="w-5 h-5 text-purple-500" />
                           <span className="text-gray-700">{inputValues.usrDivNm || '정보 없음'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <BuildingOfficeIcon className="w-5 h-5 text-amber-500" />
                           <span className="text-gray-700">{inputValues.bpNm || inputValues.bpCd || '정보 없음'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <EnvelopeIcon className="w-5 h-5 text-indigo-500" />
                           <span className="text-gray-700">{inputValues.email || '정보 없음'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <PhoneIcon className="w-5 h-5 text-green-500" />
                           <span className="text-gray-700">{inputValues.hp || '정보 없음'}</span>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${inputValues.useYn === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           <BellIcon className="w-4 h-4" />
                           <span>{inputValues.useYn === 'Y' ? '활성' : '비활성'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 사용자 정보 입력 폼 */}
            {inputDiv()}
         </div>
      );
   };

   const passwordModal = () => {
      return (
         <CommonModal
            isOpen={isPasswordModalOpen}
            size="md"
            onClose={() => setIsPasswordModalOpen(false)}
            title="비밀번호 변경"
         >
            <div className="space-y-5 p-5">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                  <input
                     type="password"
                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     value={passwordData.currentPassword}
                     onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                  <input
                     type="password"
                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     value={passwordData.newPassword}
                     onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                  <input
                     type="password"
                     className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     value={passwordData.confirmPassword}
                     onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
               </div>
               <div className="flex justify-end space-x-3 mt-6">
                  <button
                     className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                     onClick={() => setIsPasswordModalOpen(false)}
                  >
                     취소
                  </button>
                  <button
                     className="bg-blue-500 text-white rounded-lg px-3 py-1.5 flex items-center shadow hover:bg-blue-600 transition-colors"
                     onClick={handlePasswordChange}
                  >
                     <ServerIcon className="w-5 h-5 mr-1" />
                     변경
                  </button>
               </div>
            </div>
         </CommonModal>
      );
   };

   return (
      <div className={`space-y-6 overflow-y-auto`}>
         <div className="space-y-2">
            <div className="flex justify-between">
               <Breadcrumb items={breadcrumbItem} />
               {buttonDiv()}
            </div>
         </div>
         <div className="w-full h-full p-2">
            {renderProfile()}
         </div>
         {passwordModal()}
      </div>
   );
};

export default MyPage; 