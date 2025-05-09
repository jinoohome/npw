import { React, useEffect, useState, fetchPost } from "../../comp/Import";
import { useNavigate, useParams } from "react-router-dom";

interface SurveyData {
   code: string;
   question: string;
   answer: string | null;
}

interface Props {
   setSoNo: (value: string) => void;
}

const Survey = ({ setSoNo }: Props) => {
   const navigate = useNavigate();
   const { soNo } = useParams<{ soNo: string }>();
   const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
   const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
   const [isLoading, setIsLoading] = useState(true);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [isCompleted, setIsCompleted] = useState(false);

   useEffect(() => {
      const fetchSurveyData = async () => {
         try {
            const result = await fetchPost('ZZ_SURVEY', {});
            
            if (Array.isArray(result)) {
               setSurveyData(result);
            }
         } catch (error: any) {
         } finally {
            setIsLoading(false);
         }
      };

      fetchSurveyData();
   }, []);

   const handleAnswerChange = (question: string, value: string, isMultiple: boolean = false) => {
      // 답변에서 점수만 추출하는 함수
      const getScore = (answerText: string) => {
         const scoreMatch = answerText.match(/(\d+)점/);
         return scoreMatch ? scoreMatch[1] : answerText;
      };

      if (isMultiple) {
         setAnswers(prev => {
            const currentAnswers = Array.isArray(prev[question]) ? prev[question] as string[] : [];
            const newAnswers = currentAnswers.includes(value)
               ? currentAnswers.filter(ans => ans !== value)
               : [...currentAnswers, value];
            return {
               ...prev,
               [question]: newAnswers.map(getScore)
            };
         });
      } else {
         const score = getScore(value);
         setAnswers(prev => ({
            ...prev,
            [question]: score
         }));
      }
   };

   const handleSubmit = async () => {
      try {
         // 설문 데이터 구조화
         const surveyResult = {
            soNo: soNo,
            responses: surveyData.map((question, index) => {
               let answer = answers[question.question] || '';
               // 두 번째 질문(a2)의 경우 배열을 문자열로 변환
               if (index === 1 && Array.isArray(answer)) {
                  answer = answer.join(', ');
               }
               return {
                  [`q${index + 1}`]: question.question,
                  [`a${index + 1}`]: answer
               };
            })
         };

         // API 호출을 위한 파라미터 구성
         const param = {
            soNo: soNo,
            q1: surveyResult.responses[0].q1,
            a1: surveyResult.responses[0].a1,
            q2: surveyResult.responses[1].q2,
            a2: surveyResult.responses[1].a2,
            q3: surveyResult.responses[2].q3,
            a3: surveyResult.responses[2].a3,
            q4: surveyResult.responses[3].q4,
            a4: surveyResult.responses[3].a4,
            q5: surveyResult.responses[4].q5,
            a5: surveyResult.responses[4].a5,
            q6: surveyResult.responses[5].q6,
            a6: surveyResult.responses[5].a6,
            q7: surveyResult.responses[6].q7,
            a7: surveyResult.responses[6].a7,
            q8: surveyResult.responses[7].q8,
            a8: surveyResult.responses[7].a8
         };

         // API 호출 데이터 구성
         const data = {
            data: JSON.stringify(param),
            menuId: "SURVEY",
            insrtUserId: soNo
         };

         // API 호출
         const result = await fetchPost('ZZ_SURVEY_U01', data);
         
         if (!result) {
            throw new Error('API 응답이 없습니다.');
         }

         if (result.msgStatus === 'E') {
            throw new Error(`API 오류: ${result.msgText}`);
         }
         
         // 설문 완료 처리
         setIsCompleted(true);
         
         // 완료 알림
         const completionAlert = document.createElement('div');
         completionAlert.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
         completionAlert.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-500 scale-100 opacity-100">
               <div class="text-center">
                  <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                     </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 mb-2">설문 완료!</h3>
                  <p class="text-gray-600 mb-4">소중한 의견 감사합니다.</p>
                  <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                          class="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-200">
                     확인
                  </button>
               </div>
            </div>
         `;
         document.body.appendChild(completionAlert);
         
      } catch (error: any) {
         alert(`설문 제출 중 오류가 발생했습니다.\n오류 내용: ${error?.message || '알 수 없는 오류'}`);
      }
   };

   const handleNext = () => {
      if (currentQuestionIndex < surveyData.length - 1) {
         setCurrentQuestionIndex(prev => prev + 1);
      }
   };

   const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
         setCurrentQuestionIndex(prev => prev - 1);
      }
   };

   const calculateProgress = () => {
      return ((currentQuestionIndex + 1) / surveyData.length) * 100;
   };

   const isCurrentQuestionAnswered = () => {
      const currentQuestion = surveyData[currentQuestionIndex];
      const answer = answers[currentQuestion.question];
      
      if (currentQuestion.answer) {
         // 객관식 질문인 경우
         if (Array.isArray(answer)) {
            return answer.length > 0;
         }
         return answer !== undefined && answer !== '';
      } else {
         // 주관식 질문인 경우 - 항상 true 반환하여 다음 버튼 활성화
         return true;
      }
   };

   if (isCompleted) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
               <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
               </div>
               <h2 className="text-2xl font-bold text-gray-800 mb-4">설문이 완료되었습니다!</h2>
               <p className="text-gray-600 mb-6">소중한 의견 감사합니다.</p>
               <div className="space-y-4">
                  <p className="text-sm text-gray-500">주문번호: {soNo}</p>
                  <button 
                     onClick={() => {
                        setIsCompleted(false);
                        setCurrentQuestionIndex(0);
                        setAnswers({});
                     }}
                     className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-200"
                  >
                     설문 다시하기
                  </button>
                  <button 
                     onClick={() => {
                        const exitAlert = document.createElement('div');
                        exitAlert.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
                        exitAlert.innerHTML = `
                           <div class="bg-white rounded-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-500 scale-100 opacity-100">
                              <div class="text-center">
                                 <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                 </div>
                                 <h3 class="text-xl font-bold text-gray-800 mb-2">설문 완료</h3>
                                 <p class="text-gray-600 mb-4">설문이 완료되었습니다.<br>창을 닫아주세요.</p>
                                 <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                         class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200">
                                    확인
                                 </button>
                              </div>
                           </div>
                        `;
                        document.body.appendChild(exitAlert);
                     }}
                     className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                     나가기
                  </button>
               </div>
            </div>
         </div>
      );
   }

   if (isLoading) {
      return (
         <div className="flex justify-center items-center h-screen bg-gradient-to-b from-yellow-50 to-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
         </div>
      );
   }

   const currentQuestion = surveyData[currentQuestionIndex];
   const isMultipleChoice = currentQuestion.code === 'FU0151';

   return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col">
         <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
            {/* 로고 */}
            <div className="flex items-center justify-center py-3">
               <div className="flex items-center space-x-2">
                  <svg width="20" height="26" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M8.93719 0.499962L6.00684 1.98478L3.0769 0.499962L6.00684 6.12256L8.93719 0.499962Z" fill="#FAC000"/>
                     <path d="M9.9623 4.84571L9.91819 4.80636L12.0077 3.91907V0.952124L8.37473 2.51544C8.37473 2.51544 6.40879 6.27751 6.36241 6.36346C7.90423 6.54987 9.0611 7.85491 9.0611 9.42506C9.0611 11.1274 7.69103 12.5123 6.00661 12.5123C4.32116 12.5123 2.95028 11.1274 2.95028 9.42506C2.95028 7.85491 4.10653 6.54987 5.64752 6.36346C5.6032 6.27751 3.63808 2.51544 3.63808 2.51544L0.00946262 0.952124V3.91907L2.09955 4.80636L2.0542 4.84571C0.744255 6.00204 -0.00756836 7.6712 -0.00756836 9.42506C-0.00756836 12.7746 2.68927 15.5 6.00661 15.5C9.32272 15.5 12.0224 12.7746 12.0224 9.42506C12.0224 7.67285 11.2716 6.00329 9.9623 4.84571Z" fill="#FAC000"/>
                  </svg>
                  <span className="text-xl text-[#00A950] font-[농협체M]">농협파트너스</span>
               </div>
            </div>

            {/* 스크롤 가능한 컨텐츠 영역 */}
            <div className="flex-1 overflow-y-auto px-4 pb-20">
               {/* 헤더 */}
               <div className="text-center mb-4">
                  <h1 className="text-xl font-bold text-gray-800">설문조사</h1>
                  <p className="text-xs text-gray-600 mt-1">고객님의 소중한 의견을 들려주세요</p>
               </div>
               
               {/* 진행률 표시 */}
               <div className="mb-4 bg-white p-3 rounded-xl shadow-sm">
                  <div className="flex justify-between mb-1">
                     <span className="text-xs font-medium text-gray-600">
                        {currentQuestionIndex + 1} / {surveyData.length}
                     </span>
                     <span className="text-xs font-medium text-yellow-600">
                        {Math.round(calculateProgress())}%
                     </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                     <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${calculateProgress()}%` }}
                     ></div>
                  </div>
               </div>

               {surveyData.length > 0 ? (
                  <div className="space-y-3">
                     {/* 질문 카드 */}
                     <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center mb-4">
                           <div className="bg-yellow-100 text-yellow-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-3">
                              {currentQuestionIndex + 1}
                           </div>
                           <h3 className="text-base font-semibold text-gray-800 leading-relaxed">{currentQuestion.question}</h3>
                        </div>
                        <div className="space-y-2">
                           {currentQuestion.answer ? (
                              currentQuestion.answer.split('|').map((option, optionIndex) => {
                                 const trimmedOption = option.trim();
                                 const scoreMatch = trimmedOption.match(/(\d+)점/);
                                 const score = scoreMatch ? scoreMatch[1] : trimmedOption;
                                 
                                 const isSelected = isMultipleChoice 
                                    ? Array.isArray(answers[currentQuestion.question]) 
                                       ? (answers[currentQuestion.question] as string[]).includes(score)
                                       : false
                                    : answers[currentQuestion.question] === score;
                                 
                                 return (
                                    <label 
                                       key={optionIndex} 
                                       className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                                          isSelected 
                                             ? 'border-yellow-500 bg-yellow-50' 
                                             : 'border-gray-200 hover:border-yellow-300'
                                       }`}
                                    >
                                       <input
                                          type={isMultipleChoice ? "checkbox" : "radio"}
                                          name={`question-${currentQuestionIndex}`}
                                          value={trimmedOption}
                                          checked={isSelected}
                                          onChange={(e) => handleAnswerChange(currentQuestion.question, e.target.value, isMultipleChoice)}
                                          className={`${isMultipleChoice ? 'form-checkbox' : 'form-radio'} h-4 w-4 ${
                                             isMultipleChoice ? 'text-yellow-600' : 'text-yellow-500'
                                          }`}
                                       />
                                       <span className="ml-2 text-gray-700 text-sm">{trimmedOption}</span>
                                    </label>
                                 );
                              })
                           ) : (
                              <textarea
                                 className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition duration-200 text-sm"
                                 rows={3}
                                 placeholder="의견을 입력해주세요"
                                 value={answers[currentQuestion.question] as string || ''}
                                 onChange={(e) => handleAnswerChange(currentQuestion.question, e.target.value)}
                              />
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="text-center text-gray-500 bg-white p-4 rounded-xl shadow-sm text-sm">
                     설문 데이터가 없습니다.
                  </div>
               )}
            </div>
         </div>

         {/* 고정된 네비게이션 버튼 */}
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
            <div className="max-w-md mx-auto flex justify-between">
               <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 text-sm ${
                     currentQuestionIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
               >
                  이전
               </button>
               
               {currentQuestionIndex === surveyData.length - 1 ? (
                  <button
                     onClick={handleSubmit}
                     disabled={!isCurrentQuestionAnswered()}
                     className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 text-sm ${
                        !isCurrentQuestionAnswered() ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                  >
                     제출하기
                  </button>
               ) : (
                  <button
                     onClick={handleNext}
                     disabled={!isCurrentQuestionAnswered()}
                     className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 text-sm ${
                        !isCurrentQuestionAnswered() ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                  >
                     다음
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

export default Survey; 