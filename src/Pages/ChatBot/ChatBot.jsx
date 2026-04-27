


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
//           <p className="text-xs text-gray-500"dir='rtl'>
//             ⚠️ ملاحظة مهمة: هذا تقييم أولي من نظام ذكاء اصطناعي، ويجب استشارة الطبيب المختص للتشخيص النهائي.
//           </p>

//           {available_doctors && available_doctors.length > 0 && (
//             <>
//               <hr className='my-3 border-gray-300'/>
//               <h3 className='text-azraq-500 font-bold mb-3'>👩🏻‍🔬 الأطباء المتاحون</h3>
//               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' dir='rtl'>
//                 {available_doctors.map((doctor, idx) => (
//                   <div key={idx} className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm'dir='rtl'>
//                     <p className='font-bold text-azraq-600'> {doctor.name}</p>
//                     <p className='text-sm my-1'>متخصص في {doctor.specialty_ar || doctor.specialty}</p>
//                     <p className='text-sm'>⭐ التقييم: {doctor.rating}/5</p>
//                     <p className='text-sm my-1'>
//                       🕐 الدور {doctor.current_patients} – حوالي {doctor.estimated_wait_minutes} دقيقة
//                     </p>
//                     <p className='text-sm'>📍 الطابق: {doctor.floor} - الغرفة: {doctor.room}</p>
//                     <Button className="w-full mt-3 bg-azraq-500 text-white hover:bg-azraq-600">
//                       احجز مع . {doctor.name}
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
//         <div className="bg-white mx-auto shadow-2xl p-6 rounded-lg border border-[#e5e7eb] w-[1100px] h-[634px]"dir='rtl'>
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
//               className="max-h-20 overflow-y-auto text-sm flex-1"dir='rtl'
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
//                   className="cursor-pointer hover:opacity-70 transition ms-2" 
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
export default function ChatBot() {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Gpt-4oMini🚀 ");
  const [isLoading, setIsLoading] = useState(false);
const patientId =getPatientId();
const patientData = JSON.parse(localStorage.getItem("patient") || "{}");
  const Models = [
    { key: "Gpt-4o🧠 " },
    { key: "Gpt-4oMini🚀 " },
    { key: "Gemini Pro 1.5 💎 " },
    { key: "Claude 3 Haiku💫 " },
    { key: "Claude 3.5 Sonnet 🤖 " },
    { key: "Laama 3.1 70B🐂 " },
    { key: "Mixtral 8x7B💥 " }
  ];

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
      

      console.log('📤 Sending consultation:', consultationData);
      const response = await sendConsultation(consultationData);
      
      console.log('✅ Received response:', response);
      
      setMessages(prev => [...prev, { 
        sender: "bot", 
        data: response 
      }]);

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
        <div className="p-4 bg-red-50 rounded-lg text-red-600 text-sm" >
          عذراً، لم نتمكن من معالجة الاستجابة بشكل صحيح
        </div>
      );
    }

    const { assessment, available_doctors } = data;

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
            <div className="my-2"dir='rtl'>
              <strong>🎣 الإسعافات الأولية:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {assessment.first_aid.map((aid, idx) => (
                  <li key={idx}>{aid}</li>
                ))}
              </ul>
            </div>
          )}

          {assessment.warnings && assessment.warnings.length > 0 && (
            <div className="my-2 bg-yellow-50 p-2 rounded border border-yellow-200"dir='rtl'>
              <strong>⚠️ تحذيرات خاصة بحالتك:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {assessment.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {assessment.specialty_required && (
            <p className="my-2"dir='rtl'>
              <strong>🏥 التخصص الطبي المطلوب:</strong> {assessment.specialty_required}
            </p>
          )}

          <hr className='my-3 border-gray-300' />
          <p className="text-xs text-gray-500"dir='rtl'>
            ⚠️ ملاحظة مهمة: هذا تقييم أولي من نظام ذكاء اصطناعي، ويجب استشارة الطبيب المختص للتشخيص النهائي.
          </p>

          {available_doctors && available_doctors.length > 0 && (
            <>
              <hr className='my-3 border-gray-300'/>
              <h3 className='text-azraq-500 font-bold mb-3'>👩🏻‍🔬 الأطباء المتاحون</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' dir='rtl'>
                {available_doctors.map((doctor, idx) => (
                  <div key={idx} className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm'dir='rtl'>
                    <p className='font-bold text-azraq-600'> {doctor.name}</p>
                    <p className='text-sm my-1'>متخصص في {doctor.specialty_ar || doctor.specialty}</p>
                    <p className='text-sm'>⭐ التقييم: {doctor.rating}/5</p>
                    <p className='text-sm my-1'>
                      🕐 الدور {doctor.current_patients} – حوالي {doctor.estimated_wait_minutes} دقيقة
                    </p>
                    <p className='text-sm'>📍 الطابق: {doctor.floor} - الغرفة: {doctor.room}</p>
                    <Button className="w-full mt-3 bg-azraq-500 text-white hover:bg-azraq-600">
                      احجز مع . {doctor.name}
                    </Button>
                  </div>
                ))}
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
    <div className='bg-[#eff6fc] h-[680px] flex flex-col justify-center'>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 flex items-center justify-center w-16 h-16 bg-azraq-400 hover:bg-gray-700 rounded-full cursor-pointer shadow-lg transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={40} viewBox="0 0 24 24" 
             fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {open && (
        <div className="bg-white mx-auto shadow-2xl p-6 rounded-lg border border-[#e5e7eb] w-[1100px] h-[634px]"dir='rtl'>
          <div className="flex flex-col space-y-1.5 pb-6">
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
                    console.log('✅ Model selected:', selected);
                  }}
                >
                  {Models.map(model => (
                    <SelectItem key={model.key}>{model.key}</SelectItem>
                  ))}
                </Select>
              </div>
            )}

            <Input
              className="max-h-20 overflow-y-auto text-sm flex-1"dir='rtl'
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
                  className="cursor-pointer hover:opacity-70 transition ms-2" 
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
  );
}
