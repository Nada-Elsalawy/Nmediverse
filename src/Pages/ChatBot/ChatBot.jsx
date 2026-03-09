

// import React, { useState } from 'react';
// import { FaSlidersH } from "react-icons/fa";
// import { Select, SelectItem } from "@heroui/react";
// import { Input, Button } from '@heroui/react';
// import { sendConsultation, prepareConsultationData } from '../../APi/ChatBotApi';
// import { joinQueue } from '../../QueueApi';
// import { getPatientId } from '../../getPatientId';
// import { useNavigate } from 'react-router-dom';
// import doctorAPI from '../../Dr/Services/DoctorServices';

// export default function ChatBot() {
//   const [content, setContent] = useState("");
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [showSelect, setShowSelect] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("Gpt-4oMini🚀 ");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCheckingDoctor, setIsCheckingDoctor] = useState(false);
  
//   // ✅ إضافة state لحفظ الأعراض
//   const [currentSymptoms, setCurrentSymptoms] = useState("");
//   const [lastAIResponse, setLastAIResponse] = useState(null);
  
//   const patientId = getPatientId() || '124';
//   const patientData = JSON.parse(localStorage.getItem("patient") || "{}");
//   const navigate = useNavigate();

//   const Models = [
//     { key: "Gpt-4o🧠 " },
//     { key: "Gpt-4oMini🚀 " },
//     { key: "Gemini Pro 1.5 💎 " },
//     { key: "Claude 3 Haiku💫 " },
//     { key: "Claude 3.5 Sonnet 🤖 " },
//     { key: "Laama 3.1 70B🐂 " },
//     { key: "Mixtral 8x7B💥 " }
//   ];

  
//   const handleBookDoctor = async (doctor) => {
//     if (isCheckingDoctor) return;
    
//     try {
//       setIsCheckingDoctor(true);
//       console.log('🏥 Starting booking process for doctor:', doctor);
      
//       // 1. التحقق من وجود patient ID
//       if (!patientId) {
//         alert('❌ لم يتم العثور على معرف المريض. يرجى تسجيل الدخول مرة أخرى.');
//         return;
//       }

//       //  2. تحضير بيانات المريض مع الأعراض والـ AI Response
//       const patientFullData = {
//         id: patientId,
//         name: patientData.name || patientData.full_name || 'Patient',
//         age: patientData.age || patientData.patient_age,
//         gender: patientData.gender || patientData.patient_gender,
//         weight: patientData.weight || patientData.patient_weight,
//         height: patientData.height || patientData.patient_height,
        
//         //  إضافة البيانات المفقودة
//         national_id: patientData.national_id || patientData.nationalId || patientData.ssn,
//         blood_type: patientData.blood_type || patientData.bloodType,
//         bmi: patientData.bmi || patientData.BMI,
        
//         chronic_diseases: patientData.chronic_diseases || [],
//         allergies: patientData.allergies || [],
//         current_medications: patientData.medications || patientData.current_medications || [],
//         phone: patientData.phone || patientData.phone_number,
//         email: patientData.email,
        
//         //  إضافة الأعراض والـ AI Analysis
//         symptoms: currentSymptoms, // الأعراض اللي كتبها المريض
//         ai_analysis: lastAIResponse?.assessment ? {
//           diagnosis: lastAIResponse.assessment.preliminary_diagnosis || '',
//           confidence: lastAIResponse.assessment.severity?.level 
//             ? (lastAIResponse.assessment.severity.level * 10) 
//             : 0,
//           recommended_department: lastAIResponse.assessment.specialty_required || '',
//           severity: lastAIResponse.assessment.severity?.level || 5,
//           summary: lastAIResponse.assessment.preliminary_diagnosis || ''
//         } : null
//       };

//       //
//       console.log('📤 ChatBot sending patient data:', patientFullData);
//       console.log('💬 Current Symptoms:', currentSymptoms);
//       console.log('🤖 Last AI Response:', lastAIResponse);
//       console.log('🔍 AI Analysis being sent:', patientFullData.ai_analysis);

//       const doctorFullData = {
//         id: doctor.id,
//         name: doctor.name,
//         specialty: doctor.specialty || doctor.specialty_ar,
//         specialty_ar: doctor.specialty_ar,
//         rating: doctor.rating || 4.5,
//         floor: doctor.floor,
//         room: doctor.room,
//         current_patients: doctor.current_patients || 0
//       };

//       // 3. فحص حالة الدكتور
//       console.log('🔍 Doctor data from API:', doctor);
      
//       const isDoctorAvailable = doctor.current_patients === 0 || 
//                                 doctor.status === 'available' ||
//                                 !doctor.current_patients;

//       //  حفظ البيانات في localStorage مع الأعراض
//       console.log('💾 Saving to localStorage...');
//       console.log('   Doctor:', doctorFullData);
//       console.log('   Patient:', patientFullData);
//       console.log('   Patient ai_analysis:', patientFullData.ai_analysis);
      
//       localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
//       localStorage.setItem('currentPatient', JSON.stringify(patientFullData));
      
//       console.log('✅ Saved! Verifying...');
//       const saved = JSON.parse(localStorage.getItem('currentPatient'));
//       console.log('   Verified ai_analysis from localStorage:', saved?.ai_analysis);
      
//       console.log('💾 Saved patient data with symptoms:', patientFullData);

//       // 4. التوجيه بناء على حالة الدكتور
//       if (isDoctorAvailable) {
//         //  الطبيب متاح - توجيه مباشر لصفحة الطبيب
//         console.log(' Doctor is AVAILABLE - Redirecting to /dr');
        
//         alert(` الدكتور ${doctor.name} متاح الآن!\nسيتم توجيهك لغرفة الكشف...`);
        
//         setTimeout(() => {
//           navigate('/dr');
//         }, 500);

//       } else {
//         //  الانضمام للـ Queue
//         console.log('⏱️ Doctor is BUSY - Joining queue...');
        
//         const queueData = {
//           doctor_id: doctor.id,
//           patient_id: patientId,
//           patient_name: patientFullData.name,
//           reason: currentSymptoms || 'Consultation from ChatBot' // ✅ إضافة الأعراض للـ queue
//         };

//         console.log('📤 Sending queue request:', queueData);
//         const queueResponse = await joinQueue(queueData);
        
//         console.log('✅ Queue response:', queueResponse);

//         // حفظ بيانات القائمة
//         localStorage.setItem('queueData', JSON.stringify({
//           queue_id: queueResponse.queue_id || queueResponse.id,
//           doctor: doctorFullData,
//           patient: patientFullData,
//           position: queueResponse.position || 1,
//           estimated_wait_minutes: queueResponse.estimated_wait_minutes || doctor.estimated_wait_minutes || 15,
//           status: queueResponse.status || 'waiting'
//         }));

//         alert(`⏱️ الدكتور ${doctor.name} مشغول حالياً\nدورك في القائمة: ${queueResponse.position || 1}\nالوقت المتوقع: ${queueResponse.estimated_wait_minutes || doctor.estimated_wait_minutes || 15} دقيقة`);

//         setTimeout(() => {
//           navigate('/wating');
//         }, 500);
//       }

//     } catch (error) {
//       console.error('❌ Booking error:', error);
      
//       // رسائل خطأ واضحة للمستخدم
//       if (error.message.includes('active queue') || error.message.includes('قائمة انتظار نشطة')) {
//         alert('⚠️ لديك قائمة انتظار نشطة بالفعل.\nيرجى إنهاؤها أو إلغاؤها من صفحة الانتظار أولاً.');
//         navigate('/wating');
//       } else if (error.message.includes('not found') || error.message.includes('404')) {
//         alert('❌ الطبيب غير موجود. يرجى اختيار طبيب آخر.');
//       } else {
//         alert(`❌ حدث خطأ أثناء الحجز:\n${error.message || 'خطأ غير معروف'}\n\nيرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.`);
//       }
//     } finally {
//       setIsCheckingDoctor(false);
//     }
//   };

  
//   const sendMessage = async () => {
//     if (content.trim() === "" || isLoading) return;

//     const userMessage = content.trim();
    
//     //  حفظ الأعراض
//     setCurrentSymptoms(userMessage);
    
//     setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
//     setContent("");
//     setIsLoading(true);

//     try {
//       console.log('🔄 Sending request with model:', selectedModel);
      
//       const requestData = prepareConsultationData(
//         userMessage,
//         patientData,
//         selectedModel
//       );

//       console.log('📤 Request data:', requestData);

//       const response = await sendConsultation(requestData);
      
//       console.log('✅ AI Response:', response);

//       if (response?.assessment) {
//         //  حفظ الـ AI Response
//         setLastAIResponse(response);
        
//         setMessages((prev) => [...prev, { sender: "bot", data: response }]);
//       } else if (response?.error) {
//         setMessages((prev) => [...prev, { 
//           sender: "bot", 
//           text: `⚠️ ${response.error}`,
//           isError: true 
//         }]);
//       } else {
//         setMessages((prev) => [...prev, { 
//           sender: "bot", 
//           text: response?.message || "عذراً، حدث خطأ في معالجة طلبك.",
//           isError: true 
//         }]);
//       }
//     } catch (error) {
//       console.error('❌ Send message error:', error);
//       setMessages((prev) => [...prev, { 
//         sender: "bot", 
//         text: `❌ خطأ في الاتصال: ${error.message || 'يرجى المحاولة مرة أخرى'}`,
//         isError: true 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   const renderBotResponse = (data) => {
//     const { assessment, recommended_doctors } = data;

//     return (
//       <div className="my-4 max-w-[85%]">
//         <div className="flex gap-3 items-start">
//           <div className="w-full bg-azraq-50 p-4 rounded-lg border border-azraq-200">
            
//             {/* التشخيص الأولي */}
//             {assessment?.preliminary_diagnosis && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">📋 التشخيص الأولي:</p>
//                 <p className="text-sm">{assessment.preliminary_diagnosis}</p>
//               </div>
//             )}

//             {/* الأعراض المحتملة */}
//             {assessment?.symptoms_analysis && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">🔍 تحليل الأعراض:</p>
//                 <p className="text-sm">{assessment.symptoms_analysis}</p>
//               </div>
//             )}

//             {/* مستوى الخطورة */}
//             {assessment?.severity && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">⚠️ مستوى الخطورة:</p>
//                 <div className="flex items-center gap-2">
//                   <div className="flex-1 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         assessment.severity.level >= 7 ? 'bg-red-500' :
//                         assessment.severity.level >= 4 ? 'bg-yellow-500' :
//                         'bg-green-500'
//                       }`}
//                       style={{ width: `${assessment.severity.level * 10}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-semibold">{assessment.severity.level}/10</span>
//                 </div>
//                 <p className="text-xs mt-1 text-gray-600">{assessment.severity.description}</p>
//               </div>
//             )}

//             {/* التخصص المطلوب */}
//             {assessment?.specialty_required && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">🏥 التخصص المطلوب:</p>
//                 <p className="text-sm bg-white px-3 py-1 rounded-md inline-block">
//                   {assessment.specialty_required}
//                 </p>
//               </div>
//             )}

//             {/* النصائح العامة */}
//             {assessment?.general_advice && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">💡 نصائح عامة:</p>
//                 <ul className="text-sm list-disc list-inside space-y-1">
//                   {assessment.general_advice.map((advice, idx) => (
//                     <li key={idx}>{advice}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* الأطباء الموصى بهم */}
//             {recommended_doctors && recommended_doctors.length > 0 && (
//               <>
//                 <div className="border-t pt-3 mt-3">
//                   <p className="font-bold text-azraq-600 mb-3">👨‍⚕️ الأطباء المتاحون:</p>
//                 </div>
//                 <div className="grid gap-3 max-sm:grid-cols-1 md:grid-cols-2">
//                   {recommended_doctors.map((doctor, idx) => {
//                     const isAvailable = doctor.current_patients === 0 || 
//                                        doctor.status === 'available' ||
//                                        !doctor.current_patients;
                    
//                     return (
//                       <div key={idx} className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
//                         <p className='font-bold text-azraq-600'>Dr. {doctor.name}</p>
//                         <p className='text-sm my-1'>متخصص في {doctor.specialty_ar || doctor.specialty}</p>
//                         <p className='text-sm'>⭐ التقييم: {doctor.rating}/5</p>
//                         <p className='text-sm my-1'>
//                           {isAvailable ? (
//                             <span className='text-green-600 font-semibold'>✅ متاح الآن</span>
//                           ) : (
//                             <span className='text-orange-600'>
//                               🕐 الدور {doctor.current_patients} – حوالي {doctor.estimated_wait_minutes || 15} دقيقة
//                             </span>
//                           )}
//                         </p>
//                         <p className='text-sm'>📍 الطابق: {doctor.floor} - الغرفة: {doctor.room}</p>
//                         <Button 
//                           className="w-full mt-3 bg-azraq-500 text-white hover:bg-azraq-600 disabled:bg-gray-400"
//                           onClick={() => handleBookDoctor(doctor)}
//                           isDisabled={isCheckingDoctor}
//                         >
//                           {isCheckingDoctor ? (
//                             <span className="flex items-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               جاري الحجز...
//                             </span>
//                           ) : (
//                             isAvailable ? '✅ توجه للطبيب الآن' : `📋 احجز مع Dr. ${doctor.name}`
//                           )}
//                         </Button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </div>

//           <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//             <div className="rounded-full bg-gray-100 border p-1">
//               <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" 
//                    height={20} width={20} xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" 
//                       d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
//               </svg>
//             </div>
//           </span>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className='bg-[#eff6fc] h-[680px] max-sm:h-screen flex flex-col justify-center max-sm:justify-start'>
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-4 right-4 flex items-center justify-center w-16 h-16 bg-azraq-400 hover:bg-gray-700 rounded-full cursor-pointer shadow-lg transition-all z-50"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} viewBox="0 0 24 24" 
//              fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
//         </svg>
//       </button>

//       {open && (
//         <div className="bg-white mx-auto shadow-2xl p-6 max-sm:p-0 rounded-lg max-sm:rounded-none border border-[#e5e7eb] max-sm:border-none w-[1100px] max-sm:w-full h-[634px] max-sm:h-screen max-sm:fixed max-sm:inset-0 max-sm:z-40 max-sm:flex max-sm:flex-col">
//           <div className="flex flex-col space-y-1.5 pb-6 max-sm:p-4 max-sm:pb-3 max-sm:border-b max-sm:border-gray-200">
//             <h2 className="font-semibold text-2xl max-sm:text-xl tracking-tight text-azraq-400">مساعد طبي ذكي 🤖</h2>
//             <p className="text-sm max-sm:text-xs text-[#6b7280] leading-3">مدعوم بالذكاء الاصطناعي</p>
//           </div>

//           <div className="pr-4 max-sm:px-2 h-[474px] max-sm:h-auto max-sm:flex-1 overflow-y-auto max-sm:py-4">
//             {messages.length === 0 && (
//               <div className="flex justify-center items-center h-full text-gray-400 text-lg max-sm:text-base max-sm:text-center max-sm:px-4">
//                 كيف يمكنني مساعدتك اليوم؟ 💬
//               </div>
//             )}

//             {messages.map((msg, index) => (
//               <div key={index}>
//                 {msg.sender === "user" ? (
//                   <div className="flex my-4 max-sm:my-3 text-sm max-sm:text-xs gap-3 max-sm:gap-2">
//                     <span className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-blue-100 border flex items-center justify-center shrink-0">
//                       👤
//                     </span>
//                     <p className="p-3 max-sm:p-2 rounded-2xl bg-gray-100 text-[#42739E] max-w-[70%]">
//                       {msg.text}
//                     </p>
//                   </div>
//                 ) : msg.data ? (
//                   renderBotResponse(msg.data)
//                 ) : (
//                   <div className={`flex my-4 max-sm:my-3 text-sm max-sm:text-xs gap-3 max-sm:gap-2 justify-end ${msg.isError ? 'items-start' : ''}`}>
//                     <p className={`p-3 max-sm:p-2 rounded-2xl max-w-[70%] ${
//                       msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-azraq-400 text-white'
//                     }`}>
//                       {msg.text}
//                     </p>
//                     <span className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-gray-100 border flex items-center justify-center shrink-0">
//                       {msg.isError ? '⚠️' : '🤖'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-end items-center my-4 max-sm:my-3 gap-3 max-sm:gap-2">
//                 <div className="bg-azraq-100 p-3 max-sm:p-2 rounded-2xl">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 bg-azraq-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                     <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                   </div>
//                 </div>
//                 <span className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-gray-100 border flex items-center justify-center">
//                   🤖
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center relative mt-3 max-sm:mt-0 max-sm:p-3 max-sm:border-t max-sm:border-gray-200 max-sm:bg-white">
//             {showSelect && (
//               <div className="absolute bottom-14 max-sm:bottom-12 right-10 max-sm:right-2 bg-white shadow-xl p-3 max-sm:p-2 rounded-lg z-50 w-60 max-sm:w-[90%] border">
//                 <p className="text-xs max-sm:text-[10px] text-gray-500 mb-2">اختر نموذج الذكاء الاصطناعي:</p>
//                 <Select
//                   className="w-full"
//                   selectedKeys={[selectedModel]}
//                   onSelectionChange={(keys) => {
//                     const selected = Array.from(keys)[0];
//                     setSelectedModel(selected);
//                     console.log('✅ Model selected:', selected);
//                   }}
//                 >
//                   {Models.map(model => (
//                     <SelectItem key={model.key}>{model.key}</SelectItem>
//                   ))}
//                 </Select>
//               </div>
//             )}

//             <Input
//               className="max-h-20 overflow-y-auto text-sm max-sm:text-xs flex-1"
//               placeholder="اكتب الأعراض التي تشعر بها..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               disabled={isLoading}
//               endContent={
//                 <FaSlidersH 
//                   size={20} 
//                   className="cursor-pointer hover:opacity-70 transition max-sm:w-4 max-sm:h-4" 
//                   color="#224D7F" 
//                   onClick={() => setShowSelect(!showSelect)} 
//                 />
//               }
//             />

//             <Button 
//               onPress={sendMessage} 
//               isDisabled={isLoading || content.trim() === ""}
//               className="mr-2 max-sm:mr-1 rounded-md text-sm max-sm:text-xs font-medium text-white bg-azraq-400 hover:bg-azraq-500 px-6 max-sm:px-4 py-2 max-sm:py-3"
//             >
//               {isLoading ? '⏳ جاري المعالجة...' : 'إرسال 📤'}
//               <span className="max-sm:hidden">{isLoading ? '' : ''}</span>
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import React, { useState } from 'react';
// import { FaSlidersH } from "react-icons/fa";
// import { Select, SelectItem } from "@heroui/react";
// import { Input, Button } from '@heroui/react';
// import { sendConsultation, prepareConsultationData } from '../../APi/ChatBotApi';
// import { joinQueue } from '../../QueueApi';
// import { getPatientId } from '../../getPatientId';
// import { useNavigate } from 'react-router-dom';

// export default function ChatBot() {
//   const [content, setContent] = useState("");
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [showSelect, setShowSelect] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("Gpt-4oMini🚀 ");
//   const [isLoading, setIsLoading] = useState(false);
  
//   // ✅ إضافة states للحجز
//   const [isCheckingDoctor, setIsCheckingDoctor] = useState(false);
//   const [lastAIResponse, setLastAIResponse] = useState(null);
//   const [lastUserMessage, setLastUserMessage] = useState("");
  
//   const patientId = getPatientId();
//   const patientData = JSON.parse(localStorage.getItem("patient") || "{}");
//   const navigate = useNavigate();

//   const Models = [
//     { key: "Gpt-4o🧠 " },
//     { key: "Gpt-4oMini🚀 " },
//     { key: "Gemini Pro 1.5 💎 " },
//     { key: "Claude 3 Haiku💫 " },
//     { key: "Claude 3.5 Sonnet 🤖 " },
//     { key: "Laama 3.1 70B🐂 " },
//     { key: "Mixtral 8x7B💥 " }
//   ];

//   // ✅ دالة الحجز
//   const handleBookDoctor = async (doctor) => {
//     if (isCheckingDoctor) return;
    
//     try {
//       setIsCheckingDoctor(true);
//       console.log('🏥 Starting booking for:', doctor);
      
//       if (!patientId) {
//         alert('❌ لم يتم العثور على معرف المريض');
//         return;
//       }

//       // تحضير بيانات المريض مع الـ assessment
//       const patientFullData = {
//         id: patientId,
//         name: patientData.name || patientData.full_name || 'Patient',
//         age: patientData.age || patientData.patient_age,
//         gender: patientData.gender || patientData.patient_gender,
//         weight: patientData.weight || patientData.patient_weight,
//         height: patientData.height || patientData.patient_height,
//         chronic_diseases: patientData.chronic_diseases || [],
//         allergies: patientData.allergies || [],
//         current_medications: patientData.medications || patientData.current_medications || [],
//         phone: patientData.phone || patientData.phone_number,
//         email: patientData.email,
        
//         // ⭐ حفظ الأعراض والـ assessment
//         symptoms: lastUserMessage,
//         assessment: lastAIResponse?.assessment
//       };

//       const doctorFullData = {
//         id: doctor.id,
//         name: doctor.name,
//         specialty: doctor.specialty || doctor.specialty_ar,
//         specialty_ar: doctor.specialty_ar,
//         rating: doctor.rating || 4.5,
//         floor: doctor.floor,
//         room: doctor.room,
//         current_patients: doctor.current_patients || 0
//       };

//       // فحص حالة الدكتور
//       const isDoctorAvailable = doctor.current_patients === 0 || 
//                                 doctor.status === 'available' ||
//                                 !doctor.current_patients;

//       // حفظ في localStorage
//       localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
//       localStorage.setItem('currentPatient', JSON.stringify(patientFullData));
      
//       console.log('💾 Saved data:', patientFullData);

//       if (isDoctorAvailable) {
//         alert(`✅ الدكتور ${doctor.name} متاح الآن!`);
//         setTimeout(() => navigate('/dr'), 500);
//       } else {
//         // الدكتور مشغول - انضم للقائمة
//         const queueData = {
//           doctor_id: doctor.id,
//           patient_id: patientId,
//           patient_name: patientFullData.name,
//           reason: lastUserMessage || 'Consultation'
//         };
        
//         const queueResponse = await joinQueue(queueData);
        
//         localStorage.setItem('queueData', JSON.stringify({
//           queue_id: queueResponse.queue_id || queueResponse.id,
//           doctor: doctorFullData,
//           patient: patientFullData,
//           position: queueResponse.position || 1,
//           estimated_wait_minutes: queueResponse.estimated_wait_minutes || 15,
//           status: 'waiting'
//         }));

//         alert(`⏱️ الدكتور ${doctor.name} مشغول\nدورك: ${queueResponse.position || 1}`);
//         setTimeout(() => navigate('/wating'), 500);
//       }

//     } catch (error) {
//       console.error('❌ Error:', error);
//       alert(`❌ خطأ في الحجز: ${error.message}`);
//     } finally {
//       setIsCheckingDoctor(false);
//     }
//   };

//   async function sendMessage() {
//     if (content.trim() === "") return;
    
//     const userMessage = content;
//     setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    
//     // ✅ حفظ آخر رسالة من المستخدم
//     setLastUserMessage(userMessage);
    
//     setContent("");
//     setIsLoading(true);

//     try {
//       const consultationData = prepareConsultationData(content, {
//         model: selectedModel,
//         patient_age: patientData?.age,
//         patient_gender: "male",
//         patient_weight: patientData?.weight,
//         patient_height: patientData?.height,
//         chronic_diseases: patientData?.chronic_diseases || [],
//         allergies: patientData?.allergies || [],
//         current_medications: patientData?.medications || patientData?.current_medications || [],
//         use_rag: true,
//         top_k: 5,
//         ...(patientId && { patient_id: patientId })
//       });

//       console.log('📤 Sending consultation:', consultationData);
//       const response = await sendConsultation(consultationData);
      
//       console.log('✅ Received response:', response);
      
//       // ✅ حفظ آخر response من AI
//       setLastAIResponse(response);
      
//       setMessages(prev => [...prev, { 
//         sender: "bot", 
//         data: response 
//       }]);

//     } catch (error) {
//       console.error('❌ Error:', error);
//       setMessages(prev => [...prev, { 
//         sender: "bot", 
//         text: `عذراً، حدث خطأ: ${error.message}`,
//         isError: true
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const renderBotResponse = (data) => {
//     if (!data || !data.assessment) {
//       return (
//         <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
//           عذراً، لم نتمكن من معالجة الاستجابة بشكل صحيح
//         </div>
//       );
//     }

//     const { assessment, available_doctors } = data;

//     return (
//       <div className="flex my-4 text-azraq-400 text-sm justify-end gap-3 rounded-3xl flex-1">
//         <div className="flex flex-col gap-2 flex-1 text-right bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-bold text-azraq-500">التقييم الطبي الأولي 📜</h3>
          
//           {assessment.preliminary_diagnosis && (
//             <div className="my-2" dir='rtl'>
//               <strong>التشخيص المبدئي:</strong>
//               <p className="text-gray-700 mt-1">{assessment.preliminary_diagnosis}</p>
//             </div>
//           )}

//           {assessment.severity && (
//             <div className="my-2" dir='rtl'>
//               <strong>مستوى الخطورة: {assessment.severity.level}/10 
//                 {assessment.severity.emergency_required && ' ⚠️'}
//               </strong>
//               <p className="text-gray-700 mt-1">السبب: {assessment.severity.reasoning}</p>
//             </div>
//           )}

//           {assessment.first_aid && assessment.first_aid.length > 0 && (
//             <div className="my-2" dir='rtl'>
//               <strong>🎣 الإسعافات الأولية:</strong>
//               <ul className="list-disc list-inside mt-1 text-gray-700">
//                 {assessment.first_aid.map((aid, idx) => (
//                   <li key={idx}>{aid}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {assessment.warnings && assessment.warnings.length > 0 && (
//             <div className="my-2 bg-yellow-50 p-2 rounded border border-yellow-200" dir='rtl'>
//               <strong>⚠️ تحذيرات خاصة بحالتك:</strong>
//               <ul className="list-disc list-inside mt-1 text-gray-700">
//                 {assessment.warnings.map((warning, idx) => (
//                   <li key={idx}>{warning}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {assessment.specialty_required && (
//             <p className="my-2" dir='rtl'>
//               <strong>🏥 التخصص الطبي المطلوب:</strong> {assessment.specialty_required}
//             </p>
//           )}

//           <hr className='my-3 border-gray-300' />
//           <p className="text-xs text-gray-500">
//             ⚠️ ملاحظة مهمة: هذا تقييم أولي من نظام ذكاء اصطناعي، ويجب استشارة الطبيب المختص للتشخيص النهائي.
//           </p>

//           {available_doctors && available_doctors.length > 0 && (
//             <>
//               <hr className='my-3 border-gray-300'/>
//               <h3 className='text-azraq-500 font-bold mb-3'>👩🏻‍🔬 الأطباء المتاحون</h3>
//               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
//                 {available_doctors.map((doctor, idx) => (
//                   <div key={idx} className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
//                     <p className='font-bold text-azraq-600'>Dr. {doctor.name}</p>
//                     <p className='text-sm my-1'>متخصص في {doctor.specialty_ar || doctor.specialty}</p>
//                     <p className='text-sm'>⭐ التقييم: {doctor.rating}/5</p>
//                     <p className='text-sm my-1'>
//                       🕐 الدور {doctor.current_patients} – حوالي {doctor.estimated_wait_minutes} دقيقة
//                     </p>
//                     <p className='text-sm'>📍 الطابق: {doctor.floor} - الغرفة: {doctor.room}</p>
//                     <Button 
//                       className="w-full mt-3 bg-azraq-500 text-white hover:bg-azraq-600"
//                       onClick={() => handleBookDoctor(doctor)}
//                       isDisabled={isCheckingDoctor}
//                     >
//                       {isCheckingDoctor ? 'جاري الحجز...' : `احجز مع Dr. ${doctor.name}`}
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//           <div className="rounded-full bg-gray-100 border p-1">
//             <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" 
//                  height={20} width={20} xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" 
//                     d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
//             </svg>
//           </div>
//         </span>
//       </div>
//     );
//   };

//   return (
//     <div className='bg-[#eff6fc] h-[680px] flex flex-col justify-center'>
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-4 right-4 flex items-center justify-center w-16 h-16 bg-azraq-400 hover:bg-gray-700 rounded-full cursor-pointer shadow-lg transition-all z-50"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} viewBox="0 0 24 24" 
//              fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
//         </svg>
//       </button>

//       {open && (
//         <div className="bg-white mx-auto shadow-2xl p-6 rounded-lg border border-[#e5e7eb] w-[1100px] h-[634px]">
//           <div className="flex flex-col space-y-1.5 pb-6">
//             <h2 className="font-semibold text-2xl tracking-tight text-azraq-400">مساعد طبي ذكي 🤖</h2>
//             <p className="text-sm text-[#6b7280] leading-3">مدعوم بالذكاء الاصطناعي</p>
//           </div>

//           <div className="pr-4 h-[474px] overflow-y-auto">
//             {messages.length === 0 && (
//               <div className="flex justify-center items-center h-full text-gray-400 text-lg">
//                 كيف يمكنني مساعدتك اليوم؟ 💬
//               </div>
//             )}

//             {messages.map((msg, index) => (
//               <div key={index}>
//                 {msg.sender === "user" ? (
//                   <div className="flex my-4 text-sm gap-3">
//                     <span className="w-8 h-8 rounded-full bg-blue-100 border flex items-center justify-center">
//                       👤
//                     </span>
//                     <p className="p-3 rounded-2xl bg-gray-100 text-[#42739E] max-w-[70%]">
//                       {msg.text}
//                     </p>
//                   </div>
//                 ) : msg.data ? (
//                   renderBotResponse(msg.data)
//                 ) : (
//                   <div className={`flex my-4 text-sm gap-3 justify-end ${msg.isError ? 'items-start' : ''}`}>
//                     <p className={`p-3 rounded-2xl max-w-[70%] ${
//                       msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-azraq-400 text-white'
//                     }`}>
//                       {msg.text}
//                     </p>
//                     <span className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center">
//                       {msg.isError ? '⚠️' : '🤖'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-end items-center my-4 gap-3">
//                 <div className="bg-azraq-100 p-3 rounded-2xl">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                     <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                   </div>
//                 </div>
//                 <span className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center">
//                   🤖
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center relative mt-3">
//             {showSelect && (
//               <div className="absolute bottom-14 right-10 bg-white shadow-xl p-3 rounded-lg z-50 w-60 border">
//                 <p className="text-xs text-gray-500 mb-2">اختر نموذج الذكاء الاصطناعي:</p>
//                 <Select
//                   className="w-full"
//                   selectedKeys={[selectedModel]}
//                   onSelectionChange={(keys) => {
//                     const selected = Array.from(keys)[0];
//                     setSelectedModel(selected);
//                     console.log('✅ Model selected:', selected);
//                   }}
//                 >
//                   {Models.map(model => (
//                     <SelectItem key={model.key}>{model.key}</SelectItem>
//                   ))}
//                 </Select>
//               </div>
//             )}

//             <Input
//               className="max-h-20 overflow-y-auto text-sm flex-1"
//               placeholder="اكتب الأعراض التي تشعر بها..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               disabled={isLoading}
//               endContent={
//                 <FaSlidersH 
//                   size={20} 
//                   className="cursor-pointer hover:opacity-70 transition" 
//                   color="#224D7F" 
//                   onClick={() => setShowSelect(!showSelect)} 
//                 />
//               }
//             />

//             <Button 
//               onPress={sendMessage} 
//               isDisabled={isLoading || content.trim() === ""}
//               className="mr-2 rounded-md text-sm font-medium text-white bg-azraq-400 hover:bg-azraq-500 px-6 py-2"
//             >
//               {isLoading ? '⏳ جاري المعالجة...' : 'إرسال 📤'}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { FaSlidersH } from "react-icons/fa";
// import { Select, SelectItem } from "@heroui/react";
// import { Input, Button } from '@heroui/react';
// import { sendConsultation, prepareConsultationData } from '../../APi/ChatBotApi';
// import { joinQueue } from '../../QueueApi';
// import { getPatientId } from '../../getPatientId';
// import { useNavigate } from 'react-router-dom';
// import doctorAPI from '../../Dr/Services/DoctorServices';
// export default function ChatBot() {
//   const [content, setContent] = useState("");
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [showSelect, setShowSelect] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("Gpt-4oMini🚀 ");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCheckingDoctor, setIsCheckingDoctor] = useState(false);
  
//   // ✅ إضافة state لحفظ الأعراض
//   const [currentSymptoms, setCurrentSymptoms] = useState("");
//   const [lastAIResponse, setLastAIResponse] = useState(null);
  
//   const patientId = getPatientId() || '124';
//   const patientData = JSON.parse(localStorage.getItem("patient") || "{}");
//   const navigate = useNavigate();

//   const Models = [
//     { key: "Gpt-4o🧠 " },
//     { key: "Gpt-4oMini🚀 " },
//     { key: "Gemini Pro 1.5 💎 " },
//     { key: "Claude 3 Haiku💫 " },
//     { key: "Claude 3.5 Sonnet 🤖 " },
//     { key: "Laama 3.1 70B🐂 " },
//     { key: "Mixtral 8x7B💥 " }
//   ];

//   /**
//    * 🎯 معالجة الحجز مع الطبيب - محدث لإرسال الأعراض
//    */
//   const handleBookDoctor = async (doctor) => {
//     if (isCheckingDoctor) return;
    
//     try {
//       setIsCheckingDoctor(true);
//       console.log('🏥 Starting booking process for doctor:', doctor);
      
//       // 1. التحقق من وجود patient ID
//       if (!patientId) {
//         alert('❌ لم يتم العثور على معرف المريض. يرجى تسجيل الدخول مرة أخرى.');
//         return;
//       }

//       // ✅ 2. تحضير بيانات المريض مع الأعراض والـ AI Response
//       const patientFullData = {
//         id: patientId,
//         name: patientData.name || patientData.full_name || 'Patient',
//         age: patientData.age || patientData.patient_age,
//         gender: patientData.gender || patientData.patient_gender,
//         weight: patientData.weight || patientData.patient_weight,
//         height: patientData.height || patientData.patient_height,
        
//         // ✅ إضافة البيانات المفقودة
//         national_id: patientData.national_id || patientData.nationalId || patientData.ssn,
//         blood_type: patientData.blood_type || patientData.bloodType,
//         bmi: patientData.bmi || patientData.BMI,
        
//         chronic_diseases: patientData.chronic_diseases || [],
//         allergies: patientData.allergies || [],
//         current_medications: patientData.medications || patientData.current_medications || [],
//         phone: patientData.phone || patientData.phone_number,
//         email: patientData.email,
        
//         // ✅ إضافة الأعراض والـ AI Analysis
//         symptoms: currentSymptoms, // الأعراض اللي كتبها المريض
//         ai_analysis: lastAIResponse?.assessment ? {
//           diagnosis: lastAIResponse.assessment.preliminary_diagnosis || '',
//           confidence: lastAIResponse.assessment.severity?.level 
//             ? (lastAIResponse.assessment.severity.level * 10) 
//             : 0,
//           recommended_department: lastAIResponse.assessment.specialty_required || '',
//           severity: lastAIResponse.assessment.severity?.level || 5,
//           summary: lastAIResponse.assessment.preliminary_diagnosis || ''
//         } : null
//       };

//       // ✅ Debugging - عشان نشوف البيانات
//       console.log('📤 ChatBot sending patient data:', patientFullData);
//       console.log('💬 Current Symptoms:', currentSymptoms);
//       console.log('🤖 Last AI Response:', lastAIResponse);
//       console.log('🔍 AI Analysis being sent:', patientFullData.ai_analysis);

//       const doctorFullData = {
//         id: doctor.id,
//         name: doctor.name,
//         specialty: doctor.specialty || doctor.specialty_ar,
//         specialty_ar: doctor.specialty_ar,
//         rating: doctor.rating || 4.5,
//         floor: doctor.floor,
//         room: doctor.room,
//         current_patients: doctor.current_patients || 0
//       };

//       // 3. فحص حالة الدكتور
//       console.log('🔍 Doctor data from API:', doctor);
      
//       const isDoctorAvailable = doctor.current_patients === 0 || 
//                                 doctor.status === 'available' ||
//                                 !doctor.current_patients;

//       // ✅ حفظ البيانات في localStorage مع الأعراض
//       console.log('💾 Saving to localStorage...');
//       console.log('   Doctor:', doctorFullData);
//       console.log('   Patient:', patientFullData);
//       console.log('   Patient ai_analysis:', patientFullData.ai_analysis);
      
//       localStorage.setItem('selectedDoctor', JSON.stringify(doctorFullData));
//       localStorage.setItem('currentPatient', JSON.stringify(patientFullData));
      
//       console.log('✅ Saved! Verifying...');
//       const saved = JSON.parse(localStorage.getItem('currentPatient'));
//       console.log('   Verified ai_analysis from localStorage:', saved?.ai_analysis);
      
//       console.log('💾 Saved patient data with symptoms:', patientFullData);

//       // 4. انضم للـ Queue دايماً بغض النظر عن حالة الدكتور
//       const queueData = {
//         doctor_id: doctor.id,
//         patient_id: patientId,
//         patient_name: patientFullData.name,
//         reason: currentSymptoms || 'Consultation from ChatBot',
//         severity_level: patientFullData.ai_analysis?.severity || 5,
//       };

//       const queueResponse = await joinQueue(queueData);

//       localStorage.setItem('queueData', JSON.stringify({
//         queue_id: queueResponse.queue_id || queueResponse.id,
//         doctor: doctorFullData,
//         patient: patientFullData,
//         position: queueResponse.position || (queueResponse.people_ahead + 1) || 1,
//         estimated_wait_minutes: queueResponse.estimated_wait_minutes || doctor.estimated_wait_minutes || 0,
//         status: queueResponse.status || 'waiting'
//       }));

//       const ahead = queueResponse.people_ahead || 0;
//       const wait = queueResponse.estimated_wait_minutes || 0;
//       if (ahead === 0) {
//         alert(`✅ تم الحجز مع ${doctor.name}! استنى الدكتور يعمل Call`);
//       } else {
//         alert(`📋 ترتيبك #${queueResponse.position || 1} — قبلك ${ahead} — ≈${wait} دقيقة`);
//       }

//       setTimeout(() => {
//         navigate('/wating');
//       }, 500);

//     } catch (error) {
//       console.error('❌ Booking error:', error);
      
//       // رسائل خطأ واضحة للمستخدم
//       if (error.message.includes('active queue') || error.message.includes('قائمة انتظار نشطة')) {
//         alert('⚠️ لديك قائمة انتظار نشطة بالفعل.\nيرجى إنهاؤها أو إلغاؤها من صفحة الانتظار أولاً.');
//         navigate('/wating');
//       } else if (error.message.includes('not found') || error.message.includes('404')) {
//         alert('❌ الطبيب غير موجود. يرجى اختيار طبيب آخر.');
//       } else {
//         alert(`❌ حدث خطأ أثناء الحجز:\n${error.message || 'خطأ غير معروف'}\n\nيرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.`);
//       }
//     } finally {
//       setIsCheckingDoctor(false);
//     }
//   };

//   /**
//    * 📤 إرسال رسالة للـ AI
//    */
//   const sendMessage = async () => {
//     if (content.trim() === "" || isLoading) return;

//     const userMessage = content.trim();
    
//     // ✅ حفظ الأعراض
//     setCurrentSymptoms(userMessage);
    
//     setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
//     setContent("");
//     setIsLoading(true);

//     try {
//       console.log('🔄 Sending request with model:', selectedModel);
      
//       const requestData = prepareConsultationData(
//         userMessage,
//         patientData,
//         selectedModel
//       );

//       console.log('📤 Request data:', requestData);

//       const response = await sendConsultation(requestData);
      
//       console.log('✅ AI Response:', response);

//       if (response?.assessment) {
//         // ✅ حفظ الـ AI Response
//         setLastAIResponse(response);
        
//         setMessages((prev) => [...prev, { sender: "bot", data: response }]);
//       } else if (response?.error) {
//         setMessages((prev) => [...prev, { 
//           sender: "bot", 
//           text: `⚠️ ${response.error}`,
//           isError: true 
//         }]);
//       } else {
//         setMessages((prev) => [...prev, { 
//           sender: "bot", 
//           text: response?.message || "عذراً، حدث خطأ في معالجة طلبك.",
//           isError: true 
//         }]);
//       }
//     } catch (error) {
//       console.error('❌ Send message error:', error);
//       setMessages((prev) => [...prev, { 
//         sender: "bot", 
//         text: `❌ خطأ في الاتصال: ${error.message || 'يرجى المحاولة مرة أخرى'}`,
//         isError: true 
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * 🎨 عرض رد الـ AI بشكل منسق
//    */
//   const renderBotResponse = (data) => {
//     const { assessment, recommended_doctors } = data;

//     return (
//       <div className="my-4 max-w-[85%]">
//         <div className="flex gap-3 items-start">
//           <div className="w-full bg-azraq-50 p-4 rounded-lg border border-azraq-200">
            
//             {/* التشخيص الأولي */}
//             {assessment?.preliminary_diagnosis && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">📋 التشخيص الأولي:</p>
//                 <p className="text-sm">{assessment.preliminary_diagnosis}</p>
//               </div>
//             )}

//             {/* الأعراض المحتملة */}
//             {assessment?.symptoms_analysis && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">🔍 تحليل الأعراض:</p>
//                 <p className="text-sm">{assessment.symptoms_analysis}</p>
//               </div>
//             )}

//             {/* مستوى الخطورة */}
//             {assessment?.severity && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">⚠️ مستوى الخطورة:</p>
//                 <div className="flex items-center gap-2">
//                   <div className="flex-1 bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${
//                         assessment.severity.level >= 7 ? 'bg-red-500' :
//                         assessment.severity.level >= 4 ? 'bg-yellow-500' :
//                         'bg-green-500'
//                       }`}
//                       style={{ width: `${assessment.severity.level * 10}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-sm font-semibold">{assessment.severity.level}/10</span>
//                 </div>
//                 <p className="text-xs mt-1 text-gray-600">{assessment.severity.description}</p>
//               </div>
//             )}

//             {/* التخصص المطلوب */}
//             {assessment?.specialty_required && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">🏥 التخصص المطلوب:</p>
//                 <p className="text-sm bg-white px-3 py-1 rounded-md inline-block">
//                   {assessment.specialty_required}
//                 </p>
//               </div>
//             )}

//             {/* النصائح العامة */}
//             {assessment?.general_advice && (
//               <div className="mb-3">
//                 <p className="font-bold text-azraq-600 mb-1">💡 نصائح عامة:</p>
//                 <ul className="text-sm list-disc list-inside space-y-1">
//                   {assessment.general_advice.map((advice, idx) => (
//                     <li key={idx}>{advice}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* الأطباء الموصى بهم */}
//             {recommended_doctors && recommended_doctors.length > 0 && (
//               <>
//                 <div className="border-t pt-3 mt-3">
//                   <p className="font-bold text-azraq-600 mb-3">👨‍⚕️ الأطباء المتاحون:</p>
//                 </div>
//                 <div className="grid gap-3 max-sm:grid-cols-1 md:grid-cols-2">
//                   {recommended_doctors.map((doctor, idx) => {
//                     const isAvailable = doctor.current_patients === 0 || 
//                                        doctor.status === 'available' ||
//                                        !doctor.current_patients;
                    
//                     return (
//                       <div key={idx} className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
//                         <p className='font-bold text-azraq-600'>Dr. {doctor.name}</p>
//                         <p className='text-sm my-1'>متخصص في {doctor.specialty_ar || doctor.specialty}</p>
//                         <p className='text-sm'>⭐ التقييم: {doctor.rating}/5</p>
//                         <p className='text-sm my-1'>
//                           {isAvailable ? (
//                             <span className='text-green-600 font-semibold'>✅ متاح الآن</span>
//                           ) : (
//                             <span className='text-orange-600'>
//                               🕐 الدور {doctor.current_patients} – حوالي {doctor.estimated_wait_minutes || 15} دقيقة
//                             </span>
//                           )}
//                         </p>
//                         <p className='text-sm'>📍 الطابق: {doctor.floor} - الغرفة: {doctor.room}</p>
//                         <Button 
//                           className="w-full mt-3 bg-azraq-500 text-white hover:bg-azraq-600 disabled:bg-gray-400"
//                           onClick={() => handleBookDoctor(doctor)}
//                           isDisabled={isCheckingDoctor}
//                         >
//                           {isCheckingDoctor ? (
//                             <span className="flex items-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               جاري الحجز...
//                             </span>
//                           ) : (
//                             isAvailable ? '✅ توجه للطبيب الآن' : `📋 احجز مع Dr. ${doctor.name}`
//                           )}
//                         </Button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}
//           </div>

//           <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//             <div className="rounded-full bg-gray-100 border p-1">
//               <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" 
//                    height={20} width={20} xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" 
//                       d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
//               </svg>
//             </div>
//           </span>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className='bg-[#eff6fc] h-[680px] max-sm:h-screen flex flex-col justify-center max-sm:justify-start'>
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-4 right-4 flex items-center justify-center w-16 h-16 bg-azraq-400 hover:bg-gray-700 rounded-full cursor-pointer shadow-lg transition-all z-50"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} viewBox="0 0 24 24" 
//              fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
//         </svg>
//       </button>

//       {open && (
//         <div className="bg-white mx-auto shadow-2xl p-6 max-sm:p-0 rounded-lg max-sm:rounded-none border border-[#e5e7eb] max-sm:border-none w-[1100px] max-sm:w-full h-[634px] max-sm:h-screen max-sm:fixed max-sm:inset-0 max-sm:z-40 max-sm:flex max-sm:flex-col">
//           <div className="flex flex-col space-y-1.5 pb-6 max-sm:p-4 max-sm:pb-3 max-sm:border-b max-sm:border-gray-200 mx-2.5"dir='rtl'>
//             <h2 className="font-semibold text-2xl max-sm:text-xl tracking-tight text-azraq-400">مساعد طبي ذكي 🤖</h2>
//             <p className="text-sm max-sm:text-xs text-[#6b7280] leading-3">مدعوم بالذكاء الاصطناعي</p>
//           </div>

//           <div className="pr-4 max-sm:px-2 h-[474px] max-sm:h-auto max-sm:flex-1 overflow-y-auto max-sm:py-4">
//             {messages.length === 0 && (
//               <div className="flex justify-center items-center h-full text-gray-400 text-lg max-sm:text-base max-sm:text-center max-sm:px-4">
//                 كيف يمكنني مساعدتك اليوم؟ 💬
//               </div>
//             )}

//             {messages.map((msg, index) => (
//               <div key={index}>
//                 {msg.sender === "user" ? (
//                   <div className="flex my-4 max-sm:my-3 text-sm max-sm:text-xs gap-3 max-sm:gap-2">
//                     <span className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-blue-100 border flex items-center justify-center shrink-0">
//                       👤
//                     </span>
//                     <p className="p-3 max-sm:p-2 rounded-2xl bg-gray-100 text-[#42739E] max-w-[70%]">
//                       {msg.text}
//                     </p>
//                   </div>
//                 ) : msg.data ? (
//                   renderBotResponse(msg.data)
//                 ) : (
//                   <div className={`flex my-4 max-sm:my-3 text-sm max-sm:text-xs gap-3 max-sm:gap-2 justify-end ${msg.isError ? 'items-start' : ''}`}>
//                     <p className={`p-3 max-sm:p-2 rounded-2xl max-w-[70%] ${
//                       msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-azraq-400 text-white'
//                     }`}>
//                       {msg.text}
//                     </p>
//                     <span className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-gray-100 border flex items-center justify-center shrink-0">
//                       {msg.isError ? '⚠️' : '🤖'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-end items-center my-4 max-sm:my-3 gap-3 max-sm:gap-2">
//                 <div className="bg-azraq-100 p-3 max-sm:p-2 rounded-2xl">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 bg-azraq-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                     <div className="w-2 h-2 max-sm:w-1.5 max-sm:h-1.5 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                   </div>
//                 </div>
//                 <span className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full bg-gray-100 border flex items-center justify-center">
//                   🤖
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-3  items-center relative mt-3 max-sm:mt-0 max-sm:p-3 max-sm:border-t max-sm:border-gray-200 max-sm:bg-white">
//             {showSelect && (
//               <div className="absolute bottom-14 max-sm:bottom-12 right-10 max-sm:right-2 bg-white shadow-xl p-3 max-sm:p-2 rounded-lg z-50 w-60 max-sm:w-[90%] border"dir='rtl'>
//                 <p className="text-xs max-sm:text-[10px] text-gray-500 mb-2">اختر نموذج الذكاء الاصطناعي:</p>
//                 <Select
//                   className="w-full"
//                   selectedKeys={[selectedModel]}
//                   onSelectionChange={(keys) => {
//                     const selected = Array.from(keys)[0];
//                     setSelectedModel(selected);
//                     console.log('✅ Model selected:', selected);
//                   }}
//                 >
//                   {Models.map(model => (
//                     <SelectItem key={model.key}>{model.key}</SelectItem>
//                   ))}
//                 </Select>
//               </div>
//             )}

//             <Input
//               className="max-h-20 overflow-y-auto text-sm max-sm:text-xs  flex-1"dir='rtl'
//               placeholder="اكتب الأعراض التي تشعر بها..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               disabled={isLoading}
//               endContent={
//                 <FaSlidersH 
//                   size={20} 
//                   className="cursor-pointer hover:opacity-70 mx-2.5 transition max-sm:w-4 max-sm:h-4" 
//                   color="#224D7F" 
//                   onClick={() => setShowSelect(!showSelect)} 
//                 />
//               }
//             />

//             <Button 
//               onPress={sendMessage} 
//               isDisabled={isLoading || content.trim() === ""}
//               className="mr-2 max-sm:mr-1 rounded-md text-sm max-sm:text-xs font-medium text-white bg-azraq-400 hover:bg-azraq-500 px-6 max-sm:px-4 py-2 max-sm:py-3"
//             >
//               {isLoading ? '⏳ جاري المعالجة...' : 'إرسال 📤'}
//               <span className="max-sm:hidden">{isLoading ? '' : ''}</span>
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

















// import React, { useState } from 'react';
// import { FaSlidersH } from "react-icons/fa";
// import { Select, SelectItem } from "@heroui/react";
// import { Input, Button } from '@heroui/react';
// import { sendConsultation, prepareConsultationData } from '../../APi/ChatBotApi';
// import { getPatientId } from '../../getPatientId';
// export default function ChatBot() {
//   const [content, setContent] = useState("");
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [showSelect, setShowSelect] = useState(false);
//   const [selectedModel, setSelectedModel] = useState("Gpt-4oMini🚀 ");
//   const [isLoading, setIsLoading] = useState(false);
// const patientId =getPatientId();
// const patientData = JSON.parse(localStorage.getItem("patient") || "{}");
//   const Models = [
//     { key: "Gpt-4o🧠 " },
//     { key: "Gpt-4oMini🚀 " },
//     { key: "Gemini Pro 1.5 💎 " },
//     { key: "Claude 3 Haiku💫 " },
//     { key: "Claude 3.5 Sonnet 🤖 " },
//     { key: "Laama 3.1 70B🐂 " },
//     { key: "Mixtral 8x7B💥 " }
//   ];

//   async function sendMessage() {
//     if (content.trim() === "") return;
    
//     const userMessage = content;
//     setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
//     setContent("");
//     setIsLoading(true);

//     try {
//     const consultationData = prepareConsultationData(content, {
//   model: selectedModel,
//   patient_age: patientData?.age,
//   patient_gender: "male",
//   patient_weight: patientData?.weight,
//   patient_height: patientData?.height,
//   chronic_diseases: patientData?.chronic_diseases || [],
//         allergies: patientData?.allergies || [],
//         current_medications: patientData?.medications || patientData?.current_medications || [],
//         use_rag: true,
//   top_k: 5,
//   ...(patientId && { patient_id: patientId })
// });
      

//       console.log('📤 Sending consultation:', consultationData);
//       const response = await sendConsultation(consultationData);
      
//       console.log('✅ Received response:', response);
      
//       setMessages(prev => [...prev, { 
//         sender: "bot", 
//         data: response 
//       }]);

//     } catch (error) {
//       console.error('❌ Error:', error);
//       setMessages(prev => [...prev, { 
//         sender: "bot", 
//         text: `عذراً، حدث خطأ: ${error.message}`,
//         isError: true
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const renderBotResponse = (data) => {
//     if (!data || !data.assessment) {
//       return (
//         <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm" >
//           عذراً، لم نتمكن من معالجة الاستجابة بشكل صحيح
//         </div>
//       );
//     }

//     const { assessment, available_doctors } = data;

//     return (
//       <div className="flex my-4 text-azraq-400 text-sm justify-end gap-3 rounded-3xl flex-1">
//         <div className="flex flex-col gap-2 flex-1 text-right bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-bold text-azraq-500">التقييم الطبي الأولي 📜</h3>
          
//           {assessment.preliminary_diagnosis && (
//             <div className="my-2" dir='rtl'>
//               <strong>التشخيص المبدئي:</strong>
//               <p className="text-gray-700 mt-1">{assessment.preliminary_diagnosis}</p>
//             </div>
//           )}

//           {assessment.severity && (
//             <div className="my-2" dir='rtl'>
//               <strong>مستوى الخطورة: {assessment.severity.level}/10 
//                 {assessment.severity.emergency_required && ' ⚠️'}
//               </strong>
//               <p className="text-gray-700 mt-1">السبب: {assessment.severity.reasoning}</p>
//             </div>
//           )}

//           {assessment.first_aid && assessment.first_aid.length > 0 && (
//             <div className="my-2"dir='rtl'>
//               <strong>🎣 الإسعافات الأولية:</strong>
//               <ul className="list-disc list-inside mt-1 text-gray-700">
//                 {assessment.first_aid.map((aid, idx) => (
//                   <li key={idx}>{aid}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {assessment.warnings && assessment.warnings.length > 0 && (
//             <div className="my-2 bg-yellow-50 p-2 rounded border border-yellow-200"dir='rtl'>
//               <strong>⚠️ تحذيرات خاصة بحالتك:</strong>
//               <ul className="list-disc list-inside mt-1 text-gray-700">
//                 {assessment.warnings.map((warning, idx) => (
//                   <li key={idx}>{warning}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {assessment.specialty_required && (
//             <p className="my-2"dir='rtl'>
//               <strong>🏥 التخصص الطبي المطلوب:</strong> {assessment.specialty_required}
//             </p>
//           )}

//           <hr className='my-3 border-gray-300' />
//           <p className="text-xs text-gray-500">
//             ⚠️ ملاحظة مهمة: هذا تقييم أولي من نظام ذكاء اصطناعي، ويجب استشارة الطبيب المختص للتشخيص النهائي.
//           </p>

//           {available_doctors && available_doctors.length > 0 && (
//             <>
//               <hr className='my-3 border-gray-300'/>
//               <h3 className='text-azraq-500 font-bold mb-3'>👩🏻‍🔬 الأطباء المتاحون</h3>
//               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
//                 {available_doctors.map((doctor, idx) => (
//                   <div key={idx} className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
//                     <p className='font-bold text-azraq-600'>Dr. {doctor.name}</p>
//                     <p className='text-sm my-1'>متخصص في {doctor.specialty_ar || doctor.specialty}</p>
//                     <p className='text-sm'>⭐ التقييم: {doctor.rating}/5</p>
//                     <p className='text-sm my-1'>
//                       🕐 الدور {doctor.current_patients} – حوالي {doctor.estimated_wait_minutes} دقيقة
//                     </p>
//                     <p className='text-sm'>📍 الطابق: {doctor.floor} - الغرفة: {doctor.room}</p>
//                     <Button className="w-full mt-3 bg-azraq-500 text-white hover:bg-azraq-600">
//                       احجز مع Dr. {doctor.name}
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
//           <div className="rounded-full bg-gray-100 border p-1">
//             <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" 
//                  height={20} width={20} xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" 
//                     d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
//             </svg>
//           </div>
//         </span>
//       </div>
//     );
//   };

//   return (
//     <div className='bg-[#eff6fc] h-[680px] flex flex-col justify-center'>
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-4 right-4 flex items-center justify-center w-16 h-16 bg-azraq-400 hover:bg-gray-700 rounded-full cursor-pointer shadow-lg transition-all"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} viewBox="0 0 24 24" 
//              fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//           <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
//         </svg>
//       </button>

//       {open && (
//         <div className="bg-white mx-auto shadow-2xl p-6 rounded-lg border border-[#e5e7eb] w-[1100px] h-[634px]">
//           <div className="flex flex-col space-y-1.5 pb-6">
//             <h2 className="font-semibold text-2xl tracking-tight text-azraq-400">مساعد طبي ذكي 🤖</h2>
//             <p className="text-sm text-[#6b7280] leading-3">مدعوم بالذكاء الاصطناعي</p>
//           </div>

//           <div className="pr-4 h-[474px] overflow-y-auto">
//             {messages.length === 0 && (
//               <div className="flex justify-center items-center h-full text-gray-400 text-lg">
//                 كيف يمكنني مساعدتك اليوم؟ 💬
//               </div>
//             )}

//             {messages.map((msg, index) => (
//               <div key={index}>
//                 {msg.sender === "user" ? (
//                   <div className="flex my-4 text-sm gap-3">
//                     <span className="w-8 h-8 rounded-full bg-blue-100 border flex items-center justify-center">
//                       👤
//                     </span>
//                     <p className="p-3 rounded-2xl bg-gray-100 text-[#42739E] max-w-[70%]">
//                       {msg.text}
//                     </p>
//                   </div>
//                 ) : msg.data ? (
//                   renderBotResponse(msg.data)
//                 ) : (
//                   <div className={`flex my-4 text-sm gap-3 justify-end ${msg.isError ? 'items-start' : ''}`}>
//                     <p className={`p-3 rounded-2xl max-w-[70%] ${
//                       msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-azraq-400 text-white'
//                     }`}>
//                       {msg.text}
//                     </p>
//                     <span className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center">
//                       {msg.isError ? '⚠️' : '🤖'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex justify-end items-center my-4 gap-3">
//                 <div className="bg-azraq-100 p-3 rounded-2xl">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                     <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//                   </div>
//                 </div>
//                 <span className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center">
//                   🤖
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center relative mt-3">
//             {showSelect && (
//               <div className="absolute bottom-14 right-10 bg-white shadow-xl p-3 rounded-lg z-50 w-60 border">
//                 <p className="text-xs text-gray-500 mb-2">اختر نموذج الذكاء الاصطناعي:</p>
//                 <Select
//                   className="w-full"
//                   selectedKeys={[selectedModel]}
//                   onSelectionChange={(keys) => {
//                     const selected = Array.from(keys)[0];
//                     setSelectedModel(selected);
//                     console.log('✅ Model selected:', selected);
//                   }}
//                 >
//                   {Models.map(model => (
//                     <SelectItem key={model.key}>{model.key}</SelectItem>
//                   ))}
//                 </Select>
//               </div>
//             )}

//             <Input
//               className="max-h-20 overflow-y-auto text-sm flex-1"
//               placeholder="اكتب الأعراض التي تشعر بها..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               disabled={isLoading}
//               endContent={
//                 <FaSlidersH 
//                   size={20} 
//                   className="cursor-pointer hover:opacity-70 transition" 
//                   color="#224D7F" 
//                   onClick={() => setShowSelect(!showSelect)} 
//                 />
//               }
//             />

//             <Button 
//               onPress={sendMessage} 
//               isDisabled={isLoading || content.trim() === ""}
//               className="mr-2 rounded-md text-sm font-medium text-white bg-azraq-400 hover:bg-azraq-500 px-6 py-2"
//             >
//               {isLoading ? '⏳ جاري المعالجة...' : 'إرسال 📤'}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






 import React, { useState } from 'react';
import { FaSlidersH } from "react-icons/fa";
import { Select, SelectItem } from "@heroui/react";
import { Input, Button } from '@heroui/react';
import { sendConsultation, prepareConsultationData } from '../../APi/ChatBotApi';
import { getPatientId } from '../../getPatientId';
import BookingNotification from '../../BookingNotification';
import { useNavigate } from 'react-router-dom';

export default function ChatBot() {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gpt-4oMini🚀 ");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);

  const patientId = getPatientId();
  const patientData = JSON.parse(localStorage.getItem("patient") || "{}");
  const navigate = useNavigate();

  const Models = [
    { key: "Gpt-4o🧠 " },
    { key: "Gpt-4oMini🚀 " },
    { key: "Gemini Pro 1.5 💎 " },
    { key: "Claude 3 Haiku💫 " },
    { key: "Claude 3.5 Sonnet 🤖 " },
    { key: "Laama 3.1 70B🐂 " },
    { key: "Mixtral 8x7B💥 " }
  ];

  // الـ API عمل القائمة تلقائياً - بس نحفظ ونروح للانتظار
  const handleGoToWaiting = (queueInfo) => {
    localStorage.setItem('queueData', JSON.stringify({
      queue_id: queueInfo.queue_id,
      position: queueInfo.position || 1,
      estimated_wait_minutes: queueInfo.estimated_wait_minutes || 0,
      status: queueInfo.status || 'waiting',
      specialty: queueInfo.specialty_required,
    }));
    navigate('/wating');
  };

  async function sendMessage() {
    if (content.trim() === "") return;

    const userMessage = content;
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setContent("");
    setIsLoading(true);

    try {
      const consultationData = prepareConsultationData(content, {
        model: selectedModel,
        patient_age: patientData?.age,
        patient_gender: "male",
        patient_weight: patientData?.weight,
        patient_height: patientData?.height,
        chronic_diseases: patientData?.chronic_diseases || [],
        allergies: patientData?.allergies || [],
        current_medications: patientData?.medications || patientData?.current_medications || [],
        use_rag: true,
        top_k: 5,
        ...(patientId && { patient_id: patientId })
      });

      const response = await sendConsultation(consultationData);

      // لو الـ API رجع queue_info - احفظ تلقائياً
      if (response.queue_info?.queue_id) {
        localStorage.setItem('queueData', JSON.stringify({
          queue_id: response.queue_info.queue_id,
          position: response.queue_info.position || 1,
          estimated_wait_minutes: response.queue_info.estimated_wait_minutes || 0,
          status: response.queue_info.status || 'waiting',
          specialty: response.queue_info.specialty_required,
        }));
      }

      setMessages(prev => [...prev, { sender: "bot", data: response }]);

    } catch (error) {
      console.error('❌ Error:', error);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: `عذراً، حدث خطأ: ${error.message}`,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const renderBotResponse = (data) => {
    if (!data || !data.assessment) {
      return (
        <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
          عذراً، لم نتمكن من معالجة الاستجابة بشكل صحيح
        </div>
      );
    }

    const { assessment } = data;

    return (
      <div className="flex my-4 text-azraq-400 text-sm justify-end gap-3 rounded-3xl flex-1">
        <div className="flex flex-col gap-2 flex-1 text-right bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-azraq-500">التقييم الطبي الأولي 📜</h3>

          {assessment.preliminary_diagnosis && (
            <div className="my-2" dir='rtl'>
              <strong>التشخيص المبدئي:</strong>
              <p className="text-gray-700 mt-1">{assessment.preliminary_diagnosis}</p>
            </div>
          )}

          {assessment.severity && (
            <div className="my-2" dir='rtl'>
              <strong>مستوى الخطورة: {assessment.severity.level}/10
                {assessment.severity.emergency_required && ' ⚠️'}
              </strong>
              <p className="text-gray-700 mt-1">السبب: {assessment.severity.reasoning}</p>
            </div>
          )}

          {assessment.first_aid && assessment.first_aid.length > 0 && (
            <div className="my-2" dir='rtl'>
              <strong>🎣 الإسعافات الأولية:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {assessment.first_aid.map((aid, idx) => (
                  <li key={idx}>{aid}</li>
                ))}
              </ul>
            </div>
          )}

          {assessment.warnings && assessment.warnings.length > 0 && (
            <div className="my-2 bg-yellow-50 p-2 rounded border border-yellow-200" dir='rtl'>
              <strong>⚠️ تحذيرات خاصة بحالتك:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {assessment.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {assessment.specialty_required && (
            <p className="my-2" dir='rtl'>
              <strong>🏥 التخصص الطبي المطلوب:</strong> {assessment.specialty_required}
            </p>
          )}

          <hr className='my-3 border-gray-300' />
          <p className="text-xs text-gray-500" dir='rtl'>
            ⚠️ ملاحظة مهمة: هذا تقييم أولي من نظام ذكاء اصطناعي، ويجب استشارة الطبيب المختص للتشخيص النهائي.
          </p>

          {/* زرار الانتظار - الـ API عمل القائمة تلقائياً */}
          {data.queue_info?.queue_id && (
            <>
              <hr className='my-3 border-gray-300' />
              <div className='bg-blue-50 border border-blue-200 rounded-xl p-4' dir='rtl'>
                <h3 className='text-blue-700 font-bold mb-2'>📋 تم إضافتك للقائمة تلقائياً</h3>
                <p className='text-sm text-gray-600 mb-1'>
                  التخصص: <strong>{data.queue_info.specialty_required}</strong>
                </p>
                <p className='text-sm text-gray-600 mb-3'>
                  ترتيبك: <strong>#{data.queue_info.position || 1}</strong>
                </p>
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onPress={() => handleGoToWaiting(data.queue_info)}
                >
                  🚶 اذهب لصفحة الانتظار
                </Button>
              </div>
            </>
          )}
        </div>

        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
          <div className="rounded-full bg-gray-100 border p-1">
            <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24"
                 height={20} width={20} xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
        </span>
      </div>
    );
  };

  return (
    <>
      {showNotification && notificationData && (
        <BookingNotification
          data={notificationData}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className='bg-[#eff6fc] h-[680px] flex flex-col justify-center'>
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-4 right-4 flex items-center justify-center w-16 h-16 bg-azraq-400 hover:bg-gray-700 rounded-full cursor-pointer shadow-lg transition-all z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} viewBox="0 0 24 24"
               fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
        </button>

        {open && (
          <div className="bg-white mx-auto shadow-2xl p-6 rounded-lg border border-[#e5e7eb] w-[1100px] h-[634px]">
            <div className="flex flex-col space-y-1.5 pb-6" dir='rtl'>
              <h2 className="font-semibold text-2xl tracking-tight text-azraq-400">مساعد طبي ذكي 🤖</h2>
              <p className="text-sm text-[#6b7280] leading-3">مدعوم بالذكاء الاصطناعي</p>
            </div>

            <div className="pr-4 h-[474px] overflow-y-auto">
              {messages.length === 0 && (
                <div className="flex justify-center items-center h-full text-gray-400 text-lg">
                  كيف يمكنني مساعدتك اليوم؟ 💬
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.sender === "user" ? (
                    <div className="flex my-4 text-sm gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-100 border flex items-center justify-center">
                        👤
                      </span>
                      <p className="p-3 rounded-2xl bg-gray-100 text-[#42739E] max-w-[70%]">
                        {msg.text}
                      </p>
                    </div>
                  ) : msg.data ? (
                    renderBotResponse(msg.data)
                  ) : (
                    <div className={`flex my-4 text-sm gap-3 justify-end ${msg.isError ? 'items-start' : ''}`}>
                      <p className={`p-3 rounded-2xl max-w-[70%] ${
                        msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-azraq-400 text-white'
                      }`}>
                        {msg.text}
                      </p>
                      <span className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center">
                        {msg.isError ? '⚠️' : '🤖'}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-end items-center my-4 gap-3">
                  <div className="bg-azraq-100 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-azraq-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center">
                    🤖
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center relative mt-3">
              {showSelect && (
                <div className="absolute bottom-14 right-10 bg-white shadow-xl p-3 rounded-lg z-50 w-60 border">
                  <p className="text-xs text-gray-500 mb-2">اختر نموذج الذكاء الاصطناعي:</p>
                  <Select
                    className="w-full"
                    selectedKeys={[selectedModel]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      setSelectedModel(selected);
                    }}
                  >
                    {Models.map(model => (
                      <SelectItem key={model.key}>{model.key}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              <Input
                className="max-h-20 overflow-y-auto text-sm flex-1"
                placeholder="اكتب الأعراض التي تشعر بها..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                endContent={
                  <FaSlidersH
                    size={20}
                    className="cursor-pointer hover:opacity-70 transition"
                    color="#224D7F"
                    onClick={() => setShowSelect(!showSelect)}
                  />
                }
              />

              <Button
                onPress={sendMessage}
                isDisabled={isLoading || content.trim() === ""}
                className="mr-2 rounded-md text-sm font-medium text-white bg-azraq-400 hover:bg-azraq-500 px-6 py-2"
              >
                {isLoading ? '⏳ جاري المعالجة...' : 'إرسال 📤'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}