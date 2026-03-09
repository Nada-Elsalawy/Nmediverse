
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getQueueStatus, cancelQueue, getPatientNotifications } from '../../QueueApi';
// import { Card } from "@heroui/react";

// export default function WaitingQueue() {
//   const navigate = useNavigate();
//   const [queueData, setQueueData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentStatus, setCurrentStatus] = useState('waiting');
//   const [notifications, setNotifications] = useState([]);
//   const pollingInterval = useRef(null);

//   // تحميل بيانات الـ Queue من localStorage
//   useEffect(() => {
//     const savedQueueData = localStorage.getItem('queueData');
    
//     if (!savedQueueData) {
//       console.error('❌ No queue data found');
//       setError('لا توجد بيانات للقائمة. يرجى الحجز مرة أخرى.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const parsedData = JSON.parse(savedQueueData);
//       console.log(' Queue data loaded:', parsedData);
//       setQueueData(parsedData);
//       setLoading(false);
   
//       startPolling(parsedData.queue_id);
//     } catch (err) {
//       console.error('❌ Error parsing queue data:', err);
//       setError('خطأ في تحميل البيانات');
//       setLoading(false);
//     }

 
//     return () => {
//       if (pollingInterval.current) {
//         clearInterval(pollingInterval.current);
//       }
//     };
//   }, []);

 
//   const startPolling = (queueId) => {
//     // تحديث فوري
//     updateQueueStatus(queueId);
    
//     // تحديث كل 10 ثواني
//     pollingInterval.current = setInterval(() => {
//       updateQueueStatus(queueId);
//     }, 10000);
//   };

//   /**
//    * تحديث حالة الـ Queue
//    */
//   const updateQueueStatus = async (queueId) => {
//     try {
//       console.log('🔄 Updating queue status...');
//       const status = await getQueueStatus(queueId);
      
//       console.log('📊 Queue status:', status);
      
//       // تحديث البيانات
//       setQueueData(prev => ({
//         ...prev,
//         position: status.position || prev.position,
//         estimated_wait_minutes: status.estimated_wait_minutes || prev.estimated_wait_minutes,
//         status: status.status || prev.status
//       }));

//       setCurrentStatus(status.status || 'waiting');

     
//       if (status.status === 'called' || status.status === 'ready') {
       
//         console.log(' Doctor is ready! Redirecting...');
        
//         if (pollingInterval.current) {
//           clearInterval(pollingInterval.current);
//         }

//         alert(' دورك الآن! سيتم توجيهك للطبيب...');
        
//         setTimeout(() => {
//           navigate('/dr');
//         }, 1500);
//       }

//     } catch (err) {
//       console.error('❌ Error updating queue:', err);
   
//       if (err.message.includes('404') || err.message.includes('not found')) {
//         setError('لم يتم العثور على القائمة. ربما تم إلغاؤها.');
//         if (pollingInterval.current) {
//           clearInterval(pollingInterval.current);
//         }
//       }
//     }
//   };

//   /**
//    * إلغاء/مغادرة القائمة
//    */
//   const handleCancelQueue = async () => {
//     if (!queueData?.queue_id) return;

//     const confirmCancel = window.confirm(
//       '⚠️ هل أنت متأكد من مغادرة قائمة الانتظار؟\nستفقد دورك في القائمة.'
//     );

//     if (!confirmCancel) return;

//     try {
//       setLoading(true);
//       console.log('🚫 Cancelling queue:', queueData.queue_id);
      
//       await cancelQueue(queueData.queue_id);
      
//       // إيقاف التحديث
//       if (pollingInterval.current) {
//         clearInterval(pollingInterval.current);
//       }

//       // حذف البيانات من localStorage
//       localStorage.removeItem('queueData');
      
//       alert('✅ تم مغادرة قائمة الانتظار بنجاح');
      
//       // العودة للصفحة الرئيسية
//       navigate('/');

//     } catch (err) {
//       console.error('❌ Error cancelling queue:', err);
//       alert(`❌ خطأ في إلغاء القائمة: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !queueData) {
//     return (
//       <div className="min-h-screen bg-[#f4f8ff] flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">جاري تحميل بيانات القائمة...</p>
//         </div>
//       </div>
//     );
//   }

 
//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#f4f8ff] flex justify-center items-center px-4">
//         <Card className="bg-white p-8 max-w-md w-full text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
//           >
//             العودة للصفحة الرئيسية
//           </button>
//         </Card>
//       </div>
//     );
//   }

  
//   return (
//     <div className="min-h-screen bg-[#f4f8ff] flex justify-center items-center px-4 py-10">
//       <div className="w-full max-w-2xl">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
//             <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">قائمة الانتظار</h1>
//           <p className="text-gray-600">يرجى الانتظار حتى يحين دورك</p>
//         </div>

//         {/* Queue Status Card */}
//         <Card className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-blue-100">
          
//           {/* Doctor Info */}
//           <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-3xl">👨‍⚕️</span>
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl font-bold text-gray-800">
//                 Dr. {queueData?.doctor?.name || 'طبيب'}
//               </h2>
//               <p className="text-gray-600">
//                 {queueData?.doctor?.specialty_ar || queueData?.doctor?.specialty || 'تخصص'}
//               </p>
//               <p className="text-sm text-gray-500">
//                 📍 الطابق {queueData?.doctor?.floor || '-'} - غرفة {queueData?.doctor?.room || '-'}
//               </p>
//             </div>
//           </div>

//           {/* Queue Position */}
//           <div className="text-center mb-6">
//             <p className="text-gray-600 mb-2">دورك في القائمة</p>
//             <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-3">
//               <span className="text-5xl font-bold text-white">
//                 {queueData?.position || 1}
//               </span>
//             </div>
//             <p className="text-gray-600 text-lg font-medium">
//               الوقت المتوقع: <span className="text-blue-600 font-bold">{queueData?.estimated_wait_minutes || 15}</span> دقيقة
//             </p>
//           </div>

//           {/* Status Indicator */}
//           <div className="bg-gray-50 rounded-xl p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className={`w-3 h-3 rounded-full animate-pulse ${
//                   currentStatus === 'called' ? 'bg-green-500' : 
//                   currentStatus === 'waiting' ? 'bg-yellow-500' : 
//                   'bg-gray-400'
//                 }`}></div>
//                 <span className="text-gray-700 font-medium">
//                   {currentStatus === 'called' ? '✅ دورك الآن!' :
//                    currentStatus === 'waiting' ? '⏱️ في الانتظار' :
//                    '🔄 جاري التحديث...'}
//                 </span>
//               </div>
//               <span className="text-sm text-gray-500">يتم التحديث تلقائياً</span>
//             </div>
//           </div>

//           {/* Patient Info */}
//           {queueData?.patient && (
//             <div className="bg-blue-50 rounded-xl p-4 mb-6">
//               <h3 className="font-semibold text-gray-800 mb-2">معلومات المريض</h3>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-600">الاسم:</span>
//                   <span className="font-medium text-gray-800 mr-2">
//                     {queueData.patient.name || 'غير متوفر'}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">العمر:</span>
//                   <span className="font-medium text-gray-800 mr-2">
//                     {queueData.patient.age || '-'}
//                   </span>
//                 </div>
//                 {queueData.patient.gender && (
//                   <div>
//                     <span className="text-gray-600">الجنس:</span>
//                     <span className="font-medium text-gray-800 mr-2">
//                       {queueData.patient.gender === 'male' ? 'ذكر' : 'أنثى'}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Cancel Button */}
//           <button
//             onClick={handleCancelQueue}
//             disabled={loading}
//             className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 جاري الإلغاء...
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//                 مغادرة القائمة
//               </>
//             )}
//           </button>
//         </Card>

//         {/* Information Box */}
//         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//           <div className="flex items-start gap-3">
//             <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <div className="text-sm text-blue-800">
//               <p className="font-semibold mb-1">ملاحظات هامة:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>سيتم تحديث موقعك في القائمة تلقائياً كل 10 ثواني</li>
//                 <li>عندما يحين دورك، سيتم توجيهك تلقائياً لغرفة الطبيب</li>
//                 <li>يرجى عدم إغلاق الصفحة أثناء الانتظار</li>
//                 <li>يمكنك إلغاء الحجز في أي وقت بالضغط على "مغادرة القائمة"</li>
//               </ul>
//             </div>
//           </div>
//         </div>

        
//         <div className="flex justify-center mt-6">
//           <div className="flex gap-2">
//             <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
//             <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//             <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







// 




// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getQueueStatus, cancelQueue } from '../../QueueApi';

// export default function WaitingQueue() {
//   const navigate = useNavigate();
//   const [queueData, setQueueData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentStatus, setCurrentStatus] = useState('waiting');
//   const [cancelling, setCancelling] = useState(false);
//   const pollingInterval = useRef(null);

//   useEffect(() => {
//     const savedQueueData = localStorage.getItem('queueData');
//     if (!savedQueueData) {
//       setError('لا توجد بيانات للقائمة. يرجى الحجز مرة أخرى.');
//       setLoading(false);
//       return;
//     }
//     try {
//       const parsedData = JSON.parse(savedQueueData);
//       setQueueData(parsedData);
//       setLoading(false);

//       // ✅ لو مفيش queue_id مش هنعمل polling
//       if (!parsedData.queue_id) {
//         setError('لا يوجد رقم طابور. يرجى الحجز مرة أخرى.');
//         return;
//       }

//       startPolling(parsedData.queue_id);
//     } catch {
//       setError('خطأ في تحميل البيانات');
//       setLoading(false);
//     }
//     return () => {
//       if (pollingInterval.current) clearInterval(pollingInterval.current);
//     };
//   }, []);

//   const startPolling = (queueId) => {
//     updateQueueStatus(queueId);
//     pollingInterval.current = setInterval(() => updateQueueStatus(queueId), 10000);
//   };

//   const updateQueueStatus = async (queueId) => {
//     try {
//       const status = await getQueueStatus(queueId);
//       setQueueData(prev => ({
//         ...prev,
//         position: status.position ?? prev?.position,
//         estimated_wait_minutes: status.estimated_wait_minutes ?? prev?.estimated_wait_minutes,
//         status: status.status ?? prev?.status,
//       }));
//       setCurrentStatus(status.status || 'waiting');

//       // ✅ التعديل - أضفنا 'in_progress' و 'consulting' كمان
//       if (
//         status.status === 'called' ||
//         status.status === 'ready' ||
//         status.status === 'in_progress' ||
//         status.status === 'consulting'
//       ) {
//         if (pollingInterval.current) clearInterval(pollingInterval.current);
//         setTimeout(() => navigate('/dr'), 1500);
//       }
//     } catch (err) {
//       if (err?.message?.includes('404') || err?.message?.includes('not found')) {
//         setError('لم يتم العثور على القائمة. ربما تم إلغاؤها.');
//         if (pollingInterval.current) clearInterval(pollingInterval.current);
//       }
//     }
//   };

//   const handleCancelQueue = async () => {
//     if (!queueData?.queue_id) return;
//     const confirmCancel = window.confirm('هل أنت متأكد من مغادرة قائمة الانتظار؟');
//     if (!confirmCancel) return;
//     try {
//       setCancelling(true);
//       await cancelQueue(queueData.queue_id);
//       if (pollingInterval.current) clearInterval(pollingInterval.current);
//       localStorage.removeItem('queueData');
//       navigate('/');
//     } catch (err) {
//       alert(`خطأ في إلغاء القائمة: ${err.message}`);
//     } finally {
//       setCancelling(false);
//     }
//   };

//   // ─── Loading ───────────────────────────────────────────────
//   if (loading && !queueData) {
//     return (
//       <div className="min-h-screen bg-[#f0f4ff] flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
//           <p className="text-gray-500 text-base">جاري تحميل بيانات القائمة...</p>
//         </div>
//       </div>
//     );
//   }

//   // ─── Error ────────────────────────────────────────────────
//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#f0f4ff] flex justify-center items-center px-4">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
//           <div className="text-5xl mb-3">⚠️</div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
//           <p className="text-gray-500 text-sm mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
//           >
//             العودة للصفحة الرئيسية
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isCalled =
//     currentStatus === 'called' ||
//     currentStatus === 'ready' ||
//     currentStatus === 'in_progress' ||
//     currentStatus === 'consulting';

//   // ─── Main ─────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center justify-center px-4 py-10" dir="rtl">
//       <div className="w-full max-w-md">

//         {/* ── Title ── */}
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
//             غرفة الانتظار
//             <span className="text-2xl">🕐</span>
//           </h1>
//         </div>

//         {/* ── Main Card ── */}
//         <div className="bg-[#1e4d8c] rounded-3xl shadow-2xl overflow-hidden mb-4">

//           {/* Position Block */}
//           <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
//             <p className="text-blue-200 text-sm font-medium mb-3">موقفك في الطابور</p>
//             <div className="w-24 h-24 rounded-full bg-[#2a5fa8] flex items-center justify-center shadow-inner mb-4">
//               {isCalled ? (
//                 <span className="text-4xl">✅</span>
//               ) : (
//                 <span className="text-5xl font-extrabold text-white">
//                   {queueData?.position ?? 1}
//                 </span>
//               )}
//             </div>
//             {isCalled ? (
//               <p className="text-green-300 font-bold text-lg animate-pulse">دورك الآن! سيتم توجيهك...</p>
//             ) : (
//               <p className="text-blue-100 text-base font-semibold">
//                 الانتظار المتوقع:{' '}
//                 <span className="text-white font-bold">
//                   {queueData?.estimated_wait_minutes ?? 0} دقيقة
//                 </span>
//               </p>
//             )}
//           </div>

//           {/* Info Grid */}
//           <div className="grid grid-cols-2 gap-px bg-[#1a4278] mx-4 mb-4 rounded-2xl overflow-hidden">
//             {/* Doctor */}
//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">الطبيب</p>
//               <p className="text-sm font-bold text-gray-800 leading-tight">
//                 {queueData?.doctor?.name
//                   ? ` ${queueData.doctor.name}`
//                   : 'Dr: —'}
//               </p>
//             </div>

//             {/* Specialty */}
//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">التخصص</p>
//               <p className="text-sm font-bold text-gray-800 leading-tight">
//                 {queueData?.doctor?.specialty_ar || queueData?.doctor?.specialty || '—'}
//               </p>
//             </div>

//             {/* Status */}
//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">الحالة</p>
//               <p className={`text-sm font-bold flex items-center gap-1 ${
//                 isCalled ? 'text-green-600' : 'text-yellow-600'
//               }`}>
//                 {isCalled ? '✅ دورك الآن' : '⏳ في الانتظار'}
//               </p>
//             </div>

//             {/* Room */}
//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">الغرفة</p>
//               <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
//                 📍 دور {queueData?.doctor?.floor ?? '—'} – غرفة {queueData?.doctor?.room ?? '—'}
//               </p>
//             </div>
//           </div>

//           {/* Cancel Button */}
//           <div className="px-4 pb-6">
//             <button
//               onClick={handleCancelQueue}
//               disabled={cancelling}
//               className="w-full bg-[#e63946] hover:bg-[#c1121f] disabled:bg-gray-400 text-white py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
//             >
//               {cancelling ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
//                   جاري الإلغاء...
//                 </>
//               ) : (
//                 'إلغاء الانتظار'
//               )}
//             </button>
//           </div>
//         </div>

      

//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueueStatus, cancelQueue } from '../../QueueApi';

export default function WaitingQueue() {
  const navigate = useNavigate();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('waiting');
  const [cancelling, setCancelling] = useState(false);
  const [showCalledNotification, setShowCalledNotification] = useState(false);
  const pollingInterval = useRef(null);

  useEffect(() => {
    const savedQueueData = localStorage.getItem('queueData');
    if (!savedQueueData) {
      setError('لا توجد بيانات للقائمة. يرجى الحجز مرة أخرى.');
      setLoading(false);
      return;
    }
    try {
      const parsedData = JSON.parse(savedQueueData);
      setQueueData(parsedData);
      setLoading(false);

      if (!parsedData.queue_id) {
        setError('لا يوجد رقم طابور. يرجى الحجز مرة أخرى.');
        return;
      }

      startPolling(parsedData.queue_id);
    } catch {
      setError('خطأ في تحميل البيانات');
      setLoading(false);
    }
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const startPolling = (queueId) => {
    updateQueueStatus(queueId);
    pollingInterval.current = setInterval(() => updateQueueStatus(queueId), 10000);
  };

  const triggerCalledNotification = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    setShowCalledNotification(true);
  };

  const updateQueueStatus = async (queueId) => {
    try {
      const status = await getQueueStatus(queueId);
      // الـ API بيرجع queue_status مش status
      const currentStat = status.queue_status || status.status || 'waiting';

      setQueueData(prev => ({
        ...prev,
        position: status.queue_position ?? status.position ?? prev?.position,
        estimated_wait_minutes: status.estimated_wait_minutes ?? prev?.estimated_wait_minutes,
        status: currentStat,
        doctor: prev?.doctor ? {
          ...prev.doctor,
          name: status.doctor_name || prev.doctor.name,
          floor: status.doctor_floor ?? prev.doctor.floor,
          room: status.doctor_room || prev.doctor.room,
          specialty_ar: status.doctor_specialty_ar || prev.doctor.specialty_ar,
          specialty: status.doctor_specialty || prev.doctor.specialty,
        } : prev?.doctor,
      }));
      setCurrentStatus(currentStat);

      if (
        currentStat === 'called' ||
        currentStat === 'ready' ||
        currentStat === 'in_progress' ||
        currentStat === 'consulting' ||
        status.your_turn === true
      ) {
        triggerCalledNotification();
      }
    } catch (err) {
      if (err?.message?.includes('404') || err?.message?.includes('not found')) {
        setError('لم يتم العثور على القائمة. ربما تم إلغاؤها.');
        if (pollingInterval.current) clearInterval(pollingInterval.current);
      }
    }
  };

  const handleCancelQueue = async () => {
    if (!queueData?.queue_id) return;
    const confirmCancel = window.confirm('هل أنت متأكد من مغادرة قائمة الانتظار؟');
    if (!confirmCancel) return;
    try {
      setCancelling(true);
      await cancelQueue(queueData.queue_id);
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      localStorage.removeItem('queueData');
      navigate('/');
    } catch (err) {
      alert(`خطأ في إلغاء القائمة: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !queueData) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-base">جاري تحميل بيانات القائمة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const isCalled =
    currentStatus === 'called' ||
    currentStatus === 'ready' ||
    currentStatus === 'in_progress' ||
    currentStatus === 'consulting';

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center justify-center px-4 py-10" dir="rtl">

      {/* ── Notification Overlay لما الدكتور يعمل Call ── */}
      {showCalledNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-extrabold text-green-600 mb-2">دورك الآن!</h2>
            <p className="text-gray-600 mb-1">
              الطبيب{' '}
              <span className="font-bold text-blue-800">
                {queueData?.doctor?.name || ''}
              </span>
              {' '}جاهز لاستقبالك
            </p>
            <p className="text-gray-500 text-sm mb-6">
              📍 دور {queueData?.doctor?.floor ?? '—'} – غرفة {queueData?.doctor?.room ?? '—'}
            </p>
            <button
              onClick={() => setShowCalledNotification(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-sm transition"
            >
              حسناً ✓
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">

        {/* ── Title ── */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
            غرفة الانتظار
            <span className="text-2xl">🕐</span>
          </h1>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-[#1e4d8c] rounded-3xl shadow-2xl overflow-hidden mb-4">

          {/* Position Block */}
          <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
            <p className="text-blue-200 text-sm font-medium mb-3">موقفك في الطابور</p>
            <div className="w-24 h-24 rounded-full bg-[#2a5fa8] flex items-center justify-center shadow-inner mb-4">
              {isCalled ? (
                <span className="text-4xl">✅</span>
              ) : (
                <span className="text-5xl font-extrabold text-white">
                  {queueData?.position ?? 1}
                </span>
              )}
            </div>
            {isCalled ? (
              <p className="text-green-300 font-bold text-lg animate-pulse">دورك الآن </p>
            ) : (
              <p className="text-blue-100 text-base font-semibold">
                الانتظار المتوقع:{' '}
                <span className="text-white font-bold">
                  {queueData?.estimated_wait_minutes ?? 0} دقيقة
                </span>
              </p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-px bg-[#1a4278] mx-4 mb-4 rounded-2xl overflow-hidden">
            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1"></p>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {queueData?.doctor?.name ? `${queueData.doctor.name}` : 'Dr: —'}
              </p>
            </div>

            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1">التخصص</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {queueData?.doctor?.specialty_ar || queueData?.doctor?.specialty || queueData?.specialty || '—'}
              </p>
            </div>

            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1">الحالة</p>
              <p className={`text-sm font-bold flex items-center gap-1 ${isCalled ? 'text-green-600' : 'text-yellow-600'}`}>
                {isCalled ? '✅ دورك الآن' : '⏳ في الانتظار'}
              </p>
            </div>

            <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
              <p className="text-xs text-gray-400 mb-1">الغرفة</p>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                📍 دور {queueData?.doctor?.floor ?? '—'} – غرفة {queueData?.doctor?.room ?? '—'}
              </p>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="px-4 pb-6">
            <button
              onClick={handleCancelQueue}
              disabled={cancelling || isCalled}
              className="w-full bg-[#e63946] hover:bg-[#c1121f] disabled:bg-gray-400 text-white py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {cancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  جاري الإلغاء...
                </>
              ) : (
                'إلغاء الانتظار'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}