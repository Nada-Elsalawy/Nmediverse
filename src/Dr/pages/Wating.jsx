

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
//   const [showCalledNotification, setShowCalledNotification] = useState(false);
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

//   const triggerCalledNotification = () => {
//     if (pollingInterval.current) clearInterval(pollingInterval.current);
//     setShowCalledNotification(true);
//   };

//   const updateQueueStatus = async (queueId) => {
//     try {
//       const status = await getQueueStatus(queueId);
//       // الـ API بيرجع queue_status مش status
//       const currentStat = status.queue_status || status.status || 'waiting';

//       setQueueData(prev => ({
//         ...prev,
//         position: status.queue_position ?? status.position ?? prev?.position,
//         estimated_wait_minutes: status.estimated_wait_minutes ?? prev?.estimated_wait_minutes,
//         status: currentStat,
//         doctor: prev?.doctor ? {
//           ...prev.doctor,
//           name: status.doctor_name || prev.doctor.name,
//           floor: status.doctor_floor ?? prev.doctor.floor,
//           room: status.doctor_room || prev.doctor.room,
//           specialty_ar: status.doctor_specialty_ar || prev.doctor.specialty_ar,
//           specialty: status.doctor_specialty || prev.doctor.specialty,
//         } : prev?.doctor,
//       }));
//       setCurrentStatus(currentStat);

//       if (
//         currentStat === 'called' ||
//         currentStat === 'ready' ||
//         currentStat === 'in_progress' ||
//         currentStat === 'consulting' ||
//         status.your_turn === true
//       ) {
//         triggerCalledNotification();
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

//   return (
//     <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center justify-center px-4 py-10" dir="rtl">

//       {/* ── Notification Overlay لما الدكتور يعمل Call ── */}
//       {showCalledNotification && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
//             <div className="text-6xl mb-4">🔔</div>
//             <h2 className="text-2xl font-extrabold text-green-600 mb-2">دورك الآن!</h2>
//             <p className="text-gray-600 mb-1">
//               الطبيب{' '}
//               <span className="font-bold text-blue-800">
//                 {queueData?.doctor?.name || ''}
//               </span>
//               {' '}جاهز لاستقبالك
//             </p>
//             <p className="text-gray-500 text-sm mb-6">
//               📍 دور {queueData?.doctor?.floor ?? '—'} – غرفة {queueData?.doctor?.room ?? '—'}
//             </p>
//             <button
//               onClick={() => setShowCalledNotification(false)}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold text-sm transition"
//             >
//               حسناً ✓
//             </button>
//           </div>
//         </div>
//       )}

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
//               <p className="text-green-300 font-bold text-lg animate-pulse">دورك الآن </p>
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
//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1"></p>
//               <p className="text-sm font-bold text-gray-800 leading-tight">
//                 {queueData?.doctor?.name ? `${queueData.doctor.name}` : 'Dr: —'}
//               </p>
//             </div>

//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">التخصص</p>
//               <p className="text-sm font-bold text-gray-800 leading-tight">
//                 {queueData?.doctor?.specialty_ar || queueData?.doctor?.specialty || queueData?.specialty || '—'}
//               </p>
//             </div>

//             <div className="bg-[#f8faff] flex flex-col items-center justify-center py-4 px-3 text-center">
//               <p className="text-xs text-gray-400 mb-1">الحالة</p>
//               <p className={`text-sm font-bold flex items-center gap-1 ${isCalled ? 'text-green-600' : 'text-yellow-600'}`}>
//                 {isCalled ? '✅ دورك الآن' : '⏳ في الانتظار'}
//               </p>
//             </div>

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
//               disabled={cancelling || isCalled}
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












// // import React, { useState } from 'react';
// // import { AiOutlineClockCircle, AiOutlineSearch, AiOutlineFileText, AiOutlineEdit, AiOutlineCalendar } from 'react-icons/ai';
// // import { MdOutlineImage, MdCheckCircle, MdCancel } from 'react-icons/md';
// // import { FaHeartbeat } from 'react-icons/fa';
// // import { BiUserCircle } from 'react-icons/bi';

// // const DoctorDashboard = () => {
// //   const [searchId, setSearchId] = useState('124');
// //   const [selectedPatient, setSelectedPatient] = useState({
// //     name: 'Ahmed Mohamed Ali',
// //     nationalId: '30310031700357',
// //     age: 28,
// //     gender: 'Male',
// //     height: 175,
// //     weight: 78,
// //     bmi: 25.5,
// //     bloodType: 'A+',
// //     chronicDiseases: ['Hypertension', 'Asthma'],
// //     allergies: ['Penicillin', 'Aspirin'],
// //     medications: ['Amlodipine 5mg', 'Ventolin Inhaler']
// //   });

// //   const [aiDiagnosis, setAiDiagnosis] = useState({
// //     symptoms: 'Red, itchy rash on arms and legs with dry, scaly patches for 2 weeks',
// //     diagnosis: 'Possible Psoriasis',
// //     confidence: 82
// //   });

// //   const [patientQueue] = useState([
// //     { id: 1, name: 'Ahmed Mohamed', time: '~5 min', status: 'red' },
// //     { id: 2, name: 'Sara Khalil', time: '~15 min', status: 'yellow' },
// //     { id: 3, name: 'Omar Said', time: '~25 min', status: 'green' }
// //   ]);

// //   const [medicalHistory] = useState([
// //     { date: '2024-11-15', condition: 'Contact Dermatitis', doctor: 'Dr. Sara Ahmed' },
// //     { date: '2024-08-20', condition: 'Eczema', doctor: 'Dr. Ahmed Hassan' }
// //   ]);

// //   const getStatusColor = (status) => {
// //     switch(status) {
// //       case 'red': return 'bg-red-500';
// //       case 'yellow': return 'bg-yellow-400';
// //       case 'green': return 'bg-green-500';
// //       default: return 'bg-gray-500';
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-4">
// //       {/* Header */}
// //       <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
// //         <div className="flex justify-between items-start">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900 mb-1">Dr. Ahmed Hassan</h1>
// //             <p className="text-sm text-gray-500">Dermatology • Room 205 • 2nd Floor</p>
// //           </div>
// //           <div className="flex gap-2">
// //             <button className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md font-medium">Available</button>
// //             <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-md">Busy</button>
// //             <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-md">Break</button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-4 gap-4">
// //         {/* Left Sidebar - Patient Queue */}
// //         <div className="col-span-1">
// //           <div className="bg-white rounded-xl shadow-sm p-5">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-base font-bold text-gray-900">Patient Queue</h2>
// //               <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
// //                 3 waiting
// //               </span>
// //             </div>
            
// //             <div className="space-y-2.5 mb-4">
// //               {patientQueue.map((patient, index) => (
// //                 <div key={patient.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
// //                   <div className="flex justify-between items-center mb-1.5">
// //                     <span className="text-sm font-semibold text-gray-900">{index + 1}. {patient.name}</span>
// //                     <span className={`w-5 h-5 ${getStatusColor(patient.status)} rounded flex items-center justify-center text-white text-xs font-bold`}>
// //                       {index + 1}
// //                     </span>
// //                   </div>
// //                   <div className="flex items-center text-xs text-gray-500">
// //                     <AiOutlineClockCircle className="w-3.5 h-3.5 mr-1" />
// //                     {patient.time}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 transition">
// //               <BiUserCircle className="w-5 h-5" />
// //               Call Next Patient
// //             </button>
// //           </div>
// //         </div>

// //         {/* Main Content */}
// //         <div className="col-span-3 space-y-4">
// //           {/* Search Bar */}
// //           <div className="bg-white rounded-xl shadow-sm p-4">
// //             <label className="block text-xs font-semibold text-gray-700 mb-2">
// //               Search Patient by ID
// //             </label>
// //             <div className="flex gap-2">
// //               <input
// //                 type="text"
// //                 value={searchId}
// //                 onChange={(e) => setSearchId(e.target.value)}
// //                 className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
// //                 placeholder="124"
// //               />
// //               <button className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition">
// //                 <AiOutlineSearch className="w-4 h-4" />
// //                 Search
// //               </button>
// //             </div>
// //           </div>

// //           {/* Patient Information */}
// //           <div className="bg-white rounded-xl shadow-sm p-5">
// //             <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Information</h2>
            
// //             <div className="grid grid-cols-2 gap-x-8 gap-y-4">
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-0.5">Name</label>
// //                 <p className="text-sm font-semibold text-gray-900">{selectedPatient.name}</p>
// //               </div>
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-0.5">National ID</label>
// //                 <p className="text-sm font-semibold text-gray-900">{selectedPatient.nationalId}</p>
// //               </div>
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-0.5">Age / Gender</label>
// //                 <p className="text-sm font-semibold text-gray-900">{selectedPatient.age} years / {selectedPatient.gender}</p>
// //               </div>
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-0.5">Blood Type</label>
// //                 <p className="text-sm font-semibold text-gray-900">{selectedPatient.bloodType}</p>
// //               </div>
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-0.5">Height / Weight</label>
// //                 <p className="text-sm font-semibold text-gray-900">{selectedPatient.height} cm / {selectedPatient.weight} kg</p>
// //               </div>
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-0.5">BMI</label>
// //                 <p className="text-sm font-semibold text-gray-900">{selectedPatient.bmi}</p>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-5 pt-5 border-t border-gray-100">
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-2">Chronic Diseases</label>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {selectedPatient.chronicDiseases.map((disease, idx) => (
// //                     <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
// //                       {disease}
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="text-xs text-gray-500 block mb-2">Allergies</label>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {selectedPatient.allergies.map((allergy, idx) => (
// //                     <span key={idx} className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
// //                       {allergy}
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="mt-3">
// //               <label className="text-xs text-gray-500 block mb-2">Current Medications</label>
// //               <div className="flex gap-2 flex-wrap">
// //                 {selectedPatient.medications.map((med, idx) => (
// //                   <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
// //                     {med}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* AI Preliminary Analysis */}
// //           <div className="bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50 rounded-xl shadow-sm p-5 border border-purple-100">
// //   <div className="flex justify-between items-center mb-4">
// //     <h2 className="text-lg font-bold text-gray-900">AI Preliminary Analysis</h2>
// //     <FaHeartbeat className="w-5 h-5 text-purple-600" />
// //   </div>

// //   <div className="mb-4">
// //     <label className="text-xs font-medium text-gray-600 block mb-1.5">Symptoms Reported</label>
// //     <p className="text-sm text-gray-800 leading-relaxed">{aiDiagnosis.symptoms}</p>
// //   </div>

// //   <div className="grid grid-cols-2 gap-6 mb-4">
// //     <div>
// //       <label className="text-xs font-medium text-gray-600 block mb-1.5">AI Diagnosis</label>
// //       <p className="text-xl font-bold text-purple-700">{aiDiagnosis.diagnosis}</p>
// //     </div>
// //     <div>
// //       <label className="text-xs font-medium text-gray-600 block mb-1.5">Confidence Level</label>
// //       <div className="flex items-center gap-2 mt-2">
// //         <div className="flex-1 h-2.5 bg-purple-200 rounded-full overflow-hidden">
// //           <div 
// //             className="h-full bg-purple-600 rounded-full transition-all duration-500"
// //             style={{ width: `${aiDiagnosis.confidence}%` }}
// //           />
// //         </div>
// //         <span className="text-base font-bold text-purple-700 min-w-[38px]">{aiDiagnosis.confidence}%</span>
// //       </div>
// //     </div>
// //   </div>

// //   <button className="w-full bg-purple-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center justify-center gap-2 transition shadow-md">
// //     <FaHeartbeat className="w-5 h-5" />
// //     Analyze with Specialist AI Model
// //   </button>
// // </div>
// //           {/* Medical History Timeline */}
// //           <div className="bg-white rounded-xl shadow-sm p-5">
// //             <h2 className="text-lg font-bold text-gray-900 mb-4">Medical History Timeline</h2>
// //             <div className="space-y-3">
// //               {medicalHistory.map((record, idx) => (
// //                 <div key={idx} className="flex gap-4 pb-3 border-b border-gray-100 last:border-0">
// //                   <div className="text-xs text-gray-500 w-20 flex-shrink-0">{record.date}</div>
// //                   <div className="flex-1">
// //                     <p className="text-sm font-semibold text-gray-900">{record.condition}</p>
// //                     <p className="text-xs text-gray-500 mt-0.5">by {record.doctor}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Quick Actions */}
// //           <div className="bg-white rounded-xl shadow-sm p-5">
// //             <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
// //             <div className="grid grid-cols-4 gap-3">
// //               <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
// //                 <AiOutlineFileText className="w-7 h-7 text-blue-600" />
// //                 <span className="text-xs font-medium text-gray-700 text-center">Request Lab Test</span>
// //               </button>
// //               <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
// //                 <MdOutlineImage className="w-7 h-7 text-blue-600" />
// //                 <span className="text-xs font-medium text-gray-700 text-center">Request X-ray</span>
// //               </button>
// //               <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
// //                 <AiOutlineEdit className="w-7 h-7 text-blue-600" />
// //                 <span className="text-xs font-medium text-gray-700 text-center">Prescribe</span>
// //               </button>
// //               <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
// //                 <AiOutlineCalendar className="w-7 h-7 text-blue-600" />
// //                 <span className="text-xs font-medium text-gray-700 text-center">Schedule Follow-up</span>
// //               </button>
// //             </div>
// //           </div>

// //           {/* Complete Consultation */}
// //           <div className="bg-white rounded-xl shadow-sm p-5">
// //             <h2 className="text-lg font-bold text-gray-900 mb-4">Complete Consultation</h2>
            
// //             <div className="mb-4">
// //               <label className="block text-xs font-semibold text-gray-700 mb-2">Final Diagnosis</label>
// //               <textarea
// //                 className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
// //                 rows="3"
// //                 placeholder="Enter final diagnosis..."
// //               />
// //             </div>

// //             <div className="mb-4">
// //               <label className="block text-xs font-semibold text-gray-700 mb-2">Doctor Notes</label>
// //               <textarea
// //                 className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
// //                 rows="4"
// //                 placeholder="Add notes..."
// //               />
// //             </div>

// //             <div className="mb-5">
// //               <label className="block text-xs font-semibold text-gray-700 mb-3">AI Diagnosis Feedback</label>
// //               <div className="grid grid-cols-2 gap-3">
// //                 <button className="py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-green-500 hover:bg-green-50 hover:text-green-700 flex items-center justify-center gap-2 transition-all">
// //                   <MdCheckCircle className="w-5 h-5" />
// //                   AI Correct
// //                 </button>
// //                 <button className="py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2 transition-all">
// //                   <MdCancel className="w-5 h-5" />
// //                   AI Incorrect
// //                 </button>
// //               </div>
// //               <label className="flex items-center gap-2 mt-3">
// //                 <input type="checkbox" className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
// //                 <span className="text-xs text-gray-700">Follow-up required</span>
// //               </label>
// //             </div>

// //             <div className="grid grid-cols-2 gap-3">
// //               <button className="py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
// //                 Save & Continue
// //               </button>
// //               <button className="py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
// //                 Complete Consultation
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DoctorDashboard;


// import React, { useState } from "react";
// import {
//   FaSearch,
//   FaRegClock,
//   FaHeartbeat,
//   FaFlask,
//   FaRegImage,
//   FaPills,
//   FaCalendarPlus,
//   FaUser
// } from "react-icons/fa";
// import { MdCheckCircle, MdCancel } from "react-icons/md";

// const DoctorDashboard = () => {
//   const [searchId, setSearchId] = useState("124");

//   const patientQueue = [
//     { name: "Ahmed Mohamed", time: "~5 min", color: "bg-red-500", num: 8 },
//     { name: "Sara Khalil", time: "~15 min", color: "bg-orange-400", num: 5 },
//     { name: "Omar Said", time: "~25 min", color: "bg-emerald-500", num: 3 },
//   ];

//   const medicalHistory = [
//     { date: "01/02/2025", condition: "Skin Rash", doctor: "Dr. Ali" },
//     { date: "15/03/2025", condition: "Allergy Check", doctor: "Dr. Sara" },
//   ];

//   const Info = ({ label, value }) => (
//     <div>
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="font-semibold text-sm">{value}</p>
//     </div>
//   );

//   const Tag = ({ color, children }) => {
//     let bgColor = color === "red" ? "bg-red-100 text-red-700" :
//                   color === "yellow" ? "bg-yellow-100 text-yellow-700" :
//                   "bg-blue-100 text-blue-700";
//     return (
//       <span className={`${bgColor} px-2 py-0.5 rounded text-xs font-medium`}>
//         {children}
//       </span>
//     );
//   };

//   const Action = ({ icon, label }) => (
//     <button className="flex flex-col items-center justify-center gap-1 bg-slate-50 rounded-lg p-3 text-sm font-semibold hover:bg-slate-100 transition">
//       {icon}
//       {label}
//     </button>
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 text-slate-800">

//       {/* ================= HEADER ================= */}
//       <header className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-xl font-bold">Dr. Ahmed Hassan</h1>
//           <p className="text-xs text-slate-500">
//             Dermatology • Room 205 • 2nd Floor
//           </p>
//         </div>

//         <div className="flex gap-2">
//           <button className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-md">
//             Available
//           </button>
//           <button className="px-4 py-1.5 border border-slate-300 text-xs rounded-md">
//             Busy
//           </button>
//           <button className="px-4 py-1.5 border border-slate-300 text-xs rounded-md">
//             Break
//           </button>
//         </div>
//       </header>

//       {/* ================= LAYOUT ================= */}
//       <div className="grid grid-cols-12 gap-6">

//         {/* ================= QUEUE ================= */}
//         <aside className="col-span-3">
//           <div className="bg-white rounded-xl shadow-sm p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-sm font-bold">Patient Queue</h2>
//               <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">
//                 3 waiting
//               </span>
//             </div>

//             <div className="space-y-3">
//               {patientQueue.map((p, i) => (
//                 <div
//                   key={i}
//                   className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
//                 >
//                   <div className="flex justify-between">
//                     <div>
//                       <p className="text-sm font-semibold">
//                         {i + 1}. {p.name}
//                       </p>
//                       <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
//                         <FaRegClock size={11} />
//                         {p.time}
//                       </p>
//                     </div>
//                     <span
//                       className={`${p.color} text-white text-xs w-5 h-5 rounded flex items-center justify-center`}
//                     >
//                       {p.num}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
//               <FaUser />
//               Call Next Patient
//             </button>
//           </div>
//         </aside>

//         {/* ================= MAIN ================= */}
//         <main className="col-span-9 flex flex-col gap-6">

//           {/* SEARCH */}
//           <div className="bg-white rounded-xl p-4 shadow-sm">
//             <p className="text-xs font-semibold mb-2">Search Patient by ID</p>
//             <div className="flex gap-2">
//               <input
//                 value={searchId}
//                 onChange={(e) => setSearchId(e.target.value)}
//                 className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button className="bg-blue-600 text-white px-4 rounded-lg flex items-center gap-2 text-sm font-semibold">
//                 <FaSearch />
//                 Search
//               </button>
//             </div>
//           </div>

//           {/* PATIENT INFO */}
//           <div className="bg-white rounded-xl p-5 shadow-sm">
//             <h2 className="font-bold mb-4">Patient Information</h2>

//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <Info label="Name" value="Nada Elsalawy" />
//               <Info label="National ID" value="30302222399075" />
//               <Info label="Age / Gender" value="28 / Male" />
//               <Info label="Blood Type" value="A+" />
//               <Info label="Height / Weight" value="175 cm / 78 kg" />
//               <Info label="BMI" value="25.5" />
//             </div>

//             <hr className="my-3 text-[#d8dde3]" />

//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-sm text-[#90a1b9]">Chronic Diseases</p>
//                 <div className="flex gap-3 my-2">
//                   <Tag color="red">Hypertension</Tag>
//                   <Tag color="red">Asthma</Tag>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm text-[#90a1b9]">Allergies</p>
//                 <div className="flex gap-3 my-2">
//                   <Tag color="yellow">Penicillin</Tag>
//                   <Tag color="yellow">Aspirin</Tag>
//                 </div>
//               </div>
//             </div>

//             <hr className="my-3 text-[#d8dde3]" />

//             <div>
//               <p className="text-sm text-[#90a1b9]">Current Medication</p>
//               <div className="flex gap-3 my-2">
//                 <Tag color="blue">Amlodipine 5mg</Tag>
//               </div>
//             </div>
//           </div>

//           {/* AI ANALYSIS */}
//           <div className="bg-gradient-to-br from-purple-100/70 via-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
//             <div className="flex justify-between items-center mb-3">
//               <h2 className="font-bold">AI Preliminary Analysis</h2>
//               <FaHeartbeat className="text-purple-600" />
//             </div>

//             <div className="bg-white p-3">
//               <p>Symptoms Reported</p>
//               <p className="text-sm text-slate-700 mb-4">
//                 Red, itchy rash on arms and legs with dry, scaly patches for 2 weeks
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="bg-white mt-3 p-3">
//                 <p className="text-xs text-slate-500 mb-1">AI Diagnosis</p>
//                 <p className="font-bold text-purple-700">
//                   Possible Psoriasis
//                 </p>
//               </div>

//               <div className="bg-white mt-3 p-3">
//                 <p className="text-xs text-slate-500 mb-1">Confidence Level</p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-purple-600 rounded-full"
//                       style={{ width: "82%" }}
//                     />
//                   </div>
//                   <span className="text-sm font-bold text-purple-700">82%</span>
//                 </div>
//               </div>
//             </div>

//             <button className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2">
//               <FaHeartbeat />
//               Analyze with Specialist AI Model
//             </button>
//           </div>

//           {/* Medical History Timeline */}
//           <div className="bg-white rounded-xl shadow-sm p-5">
//             <h2 className="text-lg font-bold text-gray-900 mb-4">Medical History Timeline</h2>
//             <div className="space-y-3">
//               {medicalHistory.map((record, idx) => (
//                 <div key={idx} className="flex gap-4 pb-3 border-b border-gray-100 last:border-0">
//                   <div className="text-xs text-gray-500 w-20 flex-shrink-0">{record.date}</div>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-gray-900">{record.condition}</p>
//                     <p className="text-xs text-gray-500 mt-0.5">by {record.doctor}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* QUICK ACTIONS */}
//           <div className="bg-white rounded-xl p-5 shadow-sm">
//             <h2 className="font-bold mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-4 gap-3">
//               <Action icon={<FaFlask />} label="Lab Test" />
//               <Action icon={<FaRegImage />} label="X-ray" />
//               <Action icon={<FaPills />} label="Prescribe" />
//               <Action icon={<FaCalendarPlus />} label="Follow-up" />
//             </div>
//           </div>

//           {/* COMPLETE */}
//           <div className="bg-white rounded-xl shadow-sm p-5">
//             <h2 className="text-lg font-bold text-gray-900 mb-4">Complete Consultation</h2>

//             <div className="mb-4">
//               <label className="block text-xs font-semibold text-gray-700 mb-2">Final Diagnosis</label>
//               <textarea
//                 className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
//                 rows={3}
//                 placeholder="Enter final diagnosis..."
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-xs font-semibold text-gray-700 mb-2">Doctor Notes</label>
//               <textarea
//                 className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
//                 rows={4}
//                 placeholder="Add notes..."
//               />
//             </div>

//             <div className="mb-5">
//               <label className="block text-xs font-semibold text-gray-700 mb-3">AI Diagnosis Feedback</label>
//               <div className="grid grid-cols-2 gap-3">
//                 <button className="py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-green-500 hover:bg-green-50 hover:text-green-700 flex items-center justify-center gap-2 transition-all">
//                   <MdCheckCircle className="w-5 h-5" />
//                   AI Correct
//                 </button>
//                 <button className="py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2 transition-all">
//                   <MdCancel className="w-5 h-5" />
//                   AI Incorrect
//                 </button>
//               </div>
//               <label className="flex items-center gap-2 mt-3">
//                 <input type="checkbox" className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
//                 <span className="text-xs text-gray-700">Follow-up required</span>
//               </label>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <button className="py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
//                 Save & Continue
//               </button>
//               <button className="py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
//                 Complete Consultation
//               </button>
//             </div>
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard;








// import React, { useState, useEffect, useCallback, useRef } from 'react';

// // ============================================================================
// // COMPLETE DOCTOR QUEUE SYSTEM - SINGLE FILE
// // ============================================================================

// export default function DoctorQueue() {
//   // ========== STATE MANAGEMENT ==========
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('connected');
//   const [showNotificationBanner, setShowNotificationBanner] = useState(true);
//   const [showHelpModal, setShowHelpModal] = useState(false);
//   const [showLeaveModal, setShowLeaveModal] = useState(false);
//   const [notifyEnabled, setNotifyEnabled] = useState(false);
//   const [autoRefreshKey, setAutoRefreshKey] = useState(0);
//   const previousPosition = useRef(null);

//   // ========== MOCK DATA GENERATOR ==========
//   const generateMockData = () => {
//     const now = new Date();
//     const joinedAt = new Date(now.getTime() - 20 * 60 * 1000);

//     return {
//       doctor: {
//         id: 'dr_001',
//         name: 'Dr. Mahmoud Khalid',
//         specialty: 'Dermatology',
//         rating: 4.8,
      
//         initials: 'MK',
//         status: 'with-patient',
//         room: '205',
//         floor: '2nd Floor'
//       },
//       yourEntry: {
//         queueId: 'Q47',
//         patientId: 'P001',
//         position: {
//           current: 3,
//           total: 8,
//           ahead: 2
//         },
//         status: 'waiting',
//         joinedAt,
//         estimatedWait: {
//           min: 25,
//           max: 35,
//           unit: 'minutes',
//           lastUpdated: now
//         },
//         isYou: true
//       },
//       queue: [
//         {
//           queueId: 'Q45',
//           patientId: 'P102',
//           position: { current: 1, total: 8, ahead: 0 },
//           status: 'in-session',
//           joinedAt: new Date(now.getTime() - 45 * 60 * 1000),
//           estimatedWait: { min: 0, max: 0, unit: 'minutes', lastUpdated: now }
//         },
//         {
//           queueId: 'Q46',
//           patientId: 'P103',
//           position: { current: 2, total: 8, ahead: 1 },
//           status: 'waiting',
//           joinedAt: new Date(now.getTime() - 30 * 60 * 1000),
//           estimatedWait: { min: 10, max: 15, unit: 'minutes', lastUpdated: now }
//         },
//         {
//           queueId: 'Q47',
//           patientId: 'P001',
//           position: { current: 3, total: 8, ahead: 2 },
//           status: 'waiting',
//           joinedAt,
//           estimatedWait: { min: 25, max: 35, unit: 'minutes', lastUpdated: now },
//           isYou: true
//         }
//       ],
//       connectionStatus: 'connected',
//       lastSync: now
//     };
//   };

//   // ========== EFFECTS ==========
//   // Initial data load
//   useEffect(() => {
//     setTimeout(() => {
//       setData(generateMockData());
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   // Real-time updates simulation
//   useEffect(() => {
//     if (!data) return;

//     const interval = setInterval(() => {
//       setData(prev => {
//         if (!prev) return prev;

//         const newPosition = Math.max(1, prev.yourEntry.position.current - (Math.random() > 0.7 ? 1 : 0));
//         const newAhead = Math.max(0, newPosition - 1);
//         const baseWait = newPosition * 12;
//         const minWait = Math.max(0, baseWait - 5);
//         const maxWait = baseWait + 5;

//         return {
//           ...prev,
//           yourEntry: {
//             ...prev.yourEntry,
//             position: {
//               ...prev.yourEntry.position,
//               current: newPosition,
//               ahead: newAhead
//             },
//             estimatedWait: {
//               min: minWait,
//               max: maxWait,
//               unit: 'minutes',
//               lastUpdated: new Date()
//             }
//           },
//           lastSync: new Date()
//         };
//       });
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [data]);

//   // Auto-refresh timestamps
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setAutoRefreshKey(prev => prev + 1);
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         setShowHelpModal(false);
//         setShowLeaveModal(false);
//       }
//       if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         window.location.reload();
//       }
//       if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         setNotifyEnabled(prev => !prev);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   // Position change announcements
//   useEffect(() => {
//     if (data?.yourEntry && previousPosition.current !== null) {
//       const currentPos = data.yourEntry.position.current;
//       if (currentPos < previousPosition.current) {
//         const announcement = document.createElement('div');
//         announcement.setAttribute('role', 'status');
//         announcement.setAttribute('aria-live', 'polite');
//         announcement.className = 'sr-only';
//         announcement.textContent = `Your position has moved up to number ${currentPos}`;
//         document.body.appendChild(announcement);
//         setTimeout(() => announcement.remove(), 1000);
//       }
//       previousPosition.current = currentPos;
//     } else if (data?.yourEntry) {
//       previousPosition.current = data.yourEntry.position.current;
//     }
//   }, [data?.yourEntry?.position.current]);

//   // ========== HANDLERS ==========
//   const handleNotifyToggle = () => {
//     setNotifyEnabled(prev => !prev);
//     if (!notifyEnabled) {
//       setShowNotificationBanner(false);
//     }
//   };

//   const handleLeaveQueue = () => {
//     setShowLeaveModal(false);
//     console.log('Left queue');
//   };

//   // ========== HELPER FUNCTIONS ==========
//   const formatRelativeTime = (date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);

//     if (diffMins < 1) return 'just now';
//     if (diffMins < 60) return `${diffMins} min ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     return `${Math.floor(diffHours / 24)} day(s) ago`;
//   };

//   const formatAbsoluteTime = (date) => {
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const calculateProgress = (current, total) => {
//     if (total === 0) return 0;
//     return Math.round(((total - current + 1) / total) * 100);
//   };

//   const maskId = (id) => {
//     if (id.length <= 4) return id;
//     return `***${id.slice(-4)}`;
//   };

//   const getGuidanceMessage = (position, estimatedMinutes) => {
//     if (position === 1) {
//       return {
//         message: "🎯 You're next! Please stay nearby and listen for your name.",
//         bgColor: 'bg-green-50 border-green-200',
//         textColor: 'text-green-800'
//       };
//     } else if (position === 2) {
//       return {
//         message: "⏰ You're up soon! Please remain in the waiting area.",
//         bgColor: 'bg-yellow-50 border-yellow-200',
//         textColor: 'text-yellow-800'
//       };
//     } else if (estimatedMinutes > 30) {
//       return {
//         message: "☕ You have time. Feel free to grab a coffee, but stay within the building.",
//         bgColor: 'bg-blue-50 border-blue-200',
//         textColor: 'text-blue-800'
//       };
//     } else {
//       return {
//         message: "📍 Please stay in the waiting area. Your turn is coming up soon.",
//         bgColor: 'bg-indigo-50 border-indigo-200',
//         textColor: 'text-indigo-800'
//       };
//     }
//   };

//   // ========== LOADING STATE ==========
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//         <div className="max-w-6xl mx-auto space-y-6">
//           {/* Loading skeletons */}
//           <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
//               <div className="flex-1">
//                 <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-40"></div>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
//                 <div className="h-12 bg-gray-200 rounded w-20 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-32"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========== ERROR STATE ==========
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Queue</h3>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!data) return null;

//   const { doctor, yourEntry, queue, lastSync } = data;
//   const progress = calculateProgress(yourEntry.position.current, yourEntry.position.total);
//   const guidance = getGuidanceMessage(yourEntry.position.current, yourEntry.estimatedWait.min);
//   const statusConfig = {
//     'with-patient': { label: 'With Patient', color: 'text-orange-600', indicator: 'bg-orange-500' },
//     'available': { label: 'Available', color: 'text-green-600', indicator: 'bg-green-500' },
//     'on-break': { label: 'On Break', color: 'text-yellow-600', indicator: 'bg-yellow-500' },
//     'offline': { label: 'Offline', color: 'text-gray-600', indicator: 'bg-gray-400' }
//   }[doctor.status];

//   // ========== MAIN RENDER ==========
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//       <style>{`
//         .sr-only {
//           position: absolute;
//           width: 1px;
//           height: 1px;
//           padding: 0;
//           margin: -1px;
//           overflow: hidden;
//           clip: rect(0, 0, 0, 0);
//           white-space: nowrap;
//           border-width: 0;
//         }
//       `}</style>

//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Notification Banner */}
//         {showNotificationBanner && !notifyEnabled && (
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
//             <div className="flex items-start gap-3 flex-1">
//               <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//               <div>
//                 <h3 className="font-bold text-sm mb-1">Enable Notifications</h3>
//                 <p className="text-xs text-blue-100">Get notified when you're next in line</p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={handleNotifyToggle}
//                 className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
//               >
//                 Enable
//               </button>
//               <button
//                 onClick={() => setShowNotificationBanner(false)}
//                 className="px-3 py-2 text-white rounded-lg hover:bg-white/20 transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Doctor Header */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-start justify-between gap-4 flex-wrap">
//             <div className="flex items-center gap-4 flex-1 min-w-0">
//               <div className="relative">
//                 <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
//                   {doctor.initials}
//                 </div>
//                 <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${statusConfig.indicator} rounded-full ring-2 ring-white animate-pulse`}></div>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h1 className="text-2xl font-bold text-slate-800 truncate">{doctor.name}</h1>
//                 <p className="text-slate-600 text-base">{doctor.specialty}</p>
//                 <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
//                   <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   </svg>
//                   <span>{doctor.room} - {doctor.floor}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-0.5">
//                   {[1, 2, 3, 4].map(star => (
//                     <svg key={star} className="w-5 h-5 fill-orange-400" viewBox="0 0 20 20">
//                       <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                     </svg>
//                   ))}
//                   <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
//                     <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                   </svg>
//                 </div>
//                 <span className="text-slate-700 text-sm font-medium ml-1">
//                   {doctor.rating.toFixed(1)}
//                   <span className="text-slate-400 ml-1">({doctor.totalReviews})</span>
//                 </span>
//               </div>
//               <div className="group relative">
//                 <div className={`${statusConfig.color.replace('text-', 'bg-')}-100 ${statusConfig.color} px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer`}>
//                   <div className={`w-2 h-2 rounded-full ${statusConfig.indicator} animate-pulse`}></div>
//                   <span>{statusConfig.label}</span>
//                 </div>
//                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
//                   Doctor is currently {statusConfig.label.toLowerCase()}
//                   <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Guidance Banner */}
//         <div className={`${guidance.bgColor} ${guidance.textColor} border-2 rounded-xl p-4 flex items-start gap-3`} role="status" aria-live="polite">
//           <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-sm md:text-base font-medium flex-1">{guidance.message}</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Position */}
//           <div className={`bg-white rounded-2xl shadow-sm p-6 ${yourEntry.position.current <= 2 ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
//             <div className="flex items-start justify-between mb-3">
//               <p className="text-slate-500 text-sm font-medium">Your Position</p>
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="text-5xl md:text-6xl font-bold text-slate-800 leading-none">
//               #{yourEntry.position.current}
//             </div>
//             <p className="text-slate-400 text-sm mt-2">
//               {yourEntry.position.ahead} patient{yourEntry.position.ahead !== 1 ? 's' : ''} ahead
//             </p>
//           </div>

//           {/* Estimated Wait */}
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-start justify-between mb-3">
//               <p className="text-slate-500 text-sm font-medium">Estimated Wait</p>
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                   <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
//                 </svg>
//               </div>
//             </div>
//             <div className="text-4xl md:text-5xl font-bold text-slate-800 leading-none">
//               {yourEntry.estimatedWait.min === yourEntry.estimatedWait.max 
//                 ? `~${yourEntry.estimatedWait.min}` 
//                 : `${yourEntry.estimatedWait.min}-${yourEntry.estimatedWait.max}`}
//             </div>
//             <p className="text-slate-400 text-sm mt-2">{yourEntry.estimatedWait.unit}</p>
//           </div>

//           {/* Status */}
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-start justify-between mb-3">
//               <p className="text-slate-500 text-sm font-medium">Queue Status</p>
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 mt-4">
//               <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium text-base flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" strokeWidth="2"/>
//                   <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
//                 </svg>
//                 <span className="capitalize">{yourEntry.status}</span>
//               </div>
//             </div>
//             <p className="text-slate-400 text-sm mt-2">Queue {yourEntry.queueId}</p>
//           </div>
//         </div>

//         {/* Queue Visualization */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
//             </svg>
//             <h2 className="text-lg font-bold text-slate-800">Queue Visualization</h2>
//           </div>

//           {/* Legend */}
//           <div className="flex items-center justify-center gap-6 mb-6 text-xs text-slate-500">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               <span>Current Patient</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-slate-700 ring-4 ring-blue-200"></div>
//               <span>You</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-slate-300"></div>
//               <span>Waiting</span>
//             </div>
//           </div>

//           {/* Queue Positions */}
//           <div className="flex items-center justify-center gap-8 mb-8">
//             {queue.slice(0, 5).map((entry) => {
//               const isCurrent = entry.status === 'in-session';
//               const isYou = entry.isYou;
//               return (
//                 <div key={entry.queueId} className="flex flex-col items-center">
//                   <div className={`
//                     w-16 h-16 rounded-full flex items-center justify-center
//                     text-white text-xl font-bold transition-all
//                     ${isCurrent ? 'bg-green-500 shadow-lg shadow-green-200' : ''}
//                     ${isYou ? 'bg-slate-700 ring-4 ring-blue-200 shadow-lg' : ''}
//                     ${!isCurrent && !isYou ? 'bg-slate-300' : ''}
//                   `}>
//                     {entry.position.current}
//                   </div>
//                   <p className={`text-xs mt-2 font-medium ${isYou ? 'text-slate-700' : 'text-slate-500'}`}>
//                     {isCurrent ? 'Current' : isYou ? 'You' : '\u00A0'}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Progress Bar */}
//           <div className="space-y-3">
//             <div className="flex justify-between text-xs text-slate-500">
//               <span>Joined Queue</span>
//               <span>Your Turn</span>
//             </div>
//             <div className="relative">
//               <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-blue-600 rounded-full transition-all duration-500"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className="text-xs text-slate-500">{progress}% through the queue</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
       

//         {/* Queue Details */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <circle cx="12" cy="12" r="10" strokeWidth="2"/>
//               <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
//             </svg>
//             <h2 className="text-lg font-bold text-slate-800">Queue Details</h2>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Queue Number</p>
//               <p className="text-slate-800 font-bold text-lg">{maskId(yourEntry.queueId)}</p>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Patient ID</p>
//               <p className="text-slate-800 font-bold text-lg">{maskId(yourEntry.patientId)}</p>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Joined At</p>
//               <p className="text-slate-800 font-bold text-base">{formatAbsoluteTime(yourEntry.joinedAt)}</p>
//               <p className="text-slate-400 text-xs mt-0.5">
//                 {yourEntry.joinedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               </p>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Time Waiting</p>
//               <p className="text-slate-800 font-bold text-base">{formatRelativeTime(yourEntry.joinedAt)}</p>
//               <p className="text-slate-400 text-xs mt-0.5">Updates live</p>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//             <p className="text-xs text-blue-700 flex items-start gap-2">
//               <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//               <span>Some information is masked for your privacy. Full details are visible only to you and medical staff.</span>
//             </p>
//           </div>
//         </div>

//         {/* Location Info */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
//             </svg>
//             <h2 className="text-lg font-bold text-slate-800">Where to Go</h2>
//           </div>

//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
//             <div className="flex items-center justify-around flex-wrap gap-4">
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
//                   {doctor.floor.charAt(0)}
//                 </div>
//                 <p className="text-slate-500 text-xs">Floor</p>
//                 <p className="text-slate-800 font-bold text-sm">{doctor.floor}</p>
//               </div>

//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg mb-3">
//                   {doctor.room}
//                 </div>
//                 <p className="text-slate-500 text-xs">Room Number</p>
//                 <p className="text-slate-800 font-bold text-sm">Room {doctor.room}</p>
//               </div>

//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg mb-3">
//                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
//                   </svg>
//                 </div>
//                 <p className="text-slate-500 text-xs">Doctor</p>
//                 <p className="text-slate-800 font-bold text-sm">{doctor.name}</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
//             <p className="text-xs text-indigo-700 flex items-start gap-2">
//               <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>Look for signs to <strong>{doctor.floor}</strong> and follow room numbers to <strong>{doctor.room}</strong>. Staff at reception can help if needed.</span>
//             </p>
//           </div>
//         </div>

//         {/* Connection Status */}
//         <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center gap-3">
//           <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
//           <span className={`text-sm font-medium ${connectionStatus === 'connected' ? 'text-green-600' : 'text-yellow-600'}`}>
//             {connectionStatus === 'connected' ? 'Connected' : 'Reconnecting...'}
//           </span>
//           {lastSync && connectionStatus === 'connected' && (
//             <span className="text-slate-400 text-xs ml-2">
//               Updated {formatRelativeTime(lastSync)}
//             </span>
//           )}
//         </div>

//         {/* Keyboard Shortcuts */}
       
//       </div>

//       {/* Help Modal */}
//       {showHelpModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHelpModal(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//             <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-slate-800">Need Help?</h2>
//               <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               <div>
//                 <h3 className="text-lg font-bold text-slate-800 mb-3">Frequently Asked Questions</h3>
//                 <div className="space-y-4">
//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-slate-800 mb-2">How accurate is the estimated wait time?</h4>
//                     <p className="text-sm text-slate-600">Wait times are calculated based on average consultation duration and current queue position. Actual times may vary.</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-slate-800 mb-2">Can I leave and come back?</h4>
//                     <p className="text-sm text-slate-600">If you have more than 30 minutes, you may leave the waiting area but stay within the building. Enable notifications to be alerted.</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-slate-800 mb-2">What if I miss my turn?</h4>
//                     <p className="text-sm text-slate-600">Speak to reception immediately. You may be placed at the end of the queue or need to reschedule.</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t border-slate-200 pt-6">
//                 <h3 className="text-lg font-bold text-slate-800 mb-3">Still Need Help?</h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 flex items-center justify-center gap-2">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                     Call Reception
//                   </button>
//                   <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100 flex items-center justify-center gap-2">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                     </svg>
//                     Live Chat
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Leave Queue Modal */}
//       {showLeaveModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowLeaveModal(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>

//             <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Leave Queue?</h2>
//             <p className="text-slate-600 text-center mb-6">
//               {yourEntry.position.current <= 2 ? (
//                 <>
//                   You're up soon (position #{yourEntry.position.current})! Are you sure you want to leave?
//                   <strong className="block mt-2 text-red-600">You'll lose your current position.</strong>
//                 </>
//               ) : (
//                 'Are you sure you want to cancel your appointment? You\'ll need to join the queue again if you change your mind.'
//               )}
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowLeaveModal(false)}
//                 className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//               >
//                 Stay in Queue
//               </button>
//               <button
//                 onClick={handleLeaveQueue}
//                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
//               >
//                 Yes, Leave
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useState, useEffect, useCallback, useRef } from 'react';

// // ============================================================================
// // COMPLETE DOCTOR QUEUE SYSTEM - SINGLE FILE
// // ============================================================================

// export default function DoctorQueue() {
//   // ========== STATE MANAGEMENT ==========
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('connected');
//   const [showNotificationBanner, setShowNotificationBanner] = useState(true);
//   const [showHelpModal, setShowHelpModal] = useState(false);
//   const [showLeaveModal, setShowLeaveModal] = useState(false);
//   const [notifyEnabled, setNotifyEnabled] = useState(false);
//   const [autoRefreshKey, setAutoRefreshKey] = useState(0);
//   const previousPosition = useRef(null);

//   // ========== MOCK DATA GENERATOR ==========
//   const generateMockData = () => {
//     const now = new Date();
//     const joinedAt = new Date(now.getTime() - 20 * 60 * 1000);

//     return {
//       doctor: {
//         id: 'dr_001',
//         name: 'Dr. Mahmoud Khalid',
//         specialty: 'Dermatology',
//         rating: 4.8,
//         totalReviews: 342,
//         initials: 'MK',
//         status: 'with-patient',
//         room: '205',
//         floor: '2nd Floor'
//       },
//       yourEntry: {
//         queueId: 'Q47',
//         patientId: 'P001',
//         position: {
//           current: 3,
//           total: 8,
//           ahead: 2
//         },
//         status: 'waiting',
//         joinedAt,
//         estimatedWait: {
//           min: 25,
//           max: 35,
//           unit: 'minutes',
//           lastUpdated: now
//         },
//         isYou: true
//       },
//       queue: [
//         {
//           queueId: 'Q45',
//           patientId: 'P102',
//           position: { current: 1, total: 8, ahead: 0 },
//           status: 'in-session',
//           joinedAt: new Date(now.getTime() - 45 * 60 * 1000),
//           estimatedWait: { min: 0, max: 0, unit: 'minutes', lastUpdated: now }
//         },
//         {
//           queueId: 'Q46',
//           patientId: 'P103',
//           position: { current: 2, total: 8, ahead: 1 },
//           status: 'waiting',
//           joinedAt: new Date(now.getTime() - 30 * 60 * 1000),
//           estimatedWait: { min: 10, max: 15, unit: 'minutes', lastUpdated: now }
//         },
//         {
//           queueId: 'Q47',
//           patientId: 'P001',
//           position: { current: 3, total: 8, ahead: 2 },
//           status: 'waiting',
//           joinedAt,
//           estimatedWait: { min: 25, max: 35, unit: 'minutes', lastUpdated: now },
//           isYou: true
//         }
//       ],
//       connectionStatus: 'connected',
//       lastSync: now
//     };
//   };

//   // ========== EFFECTS ==========
//   // Initial data load
//   useEffect(() => {
//     setTimeout(() => {
//       setData(generateMockData());
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   // Real-time updates simulation
//   useEffect(() => {
//     if (!data) return;

//     const interval = setInterval(() => {
//       setData(prev => {
//         if (!prev) return prev;

//         const newPosition = Math.max(1, prev.yourEntry.position.current - (Math.random() > 0.7 ? 1 : 0));
//         const newAhead = Math.max(0, newPosition - 1);
//         const baseWait = newPosition * 12;
//         const minWait = Math.max(0, baseWait - 5);
//         const maxWait = baseWait + 5;

//         return {
//           ...prev,
//           yourEntry: {
//             ...prev.yourEntry,
//             position: {
//               ...prev.yourEntry.position,
//               current: newPosition,
//               ahead: newAhead
//             },
//             estimatedWait: {
//               min: minWait,
//               max: maxWait,
//               unit: 'minutes',
//               lastUpdated: new Date()
//             }
//           },
//           lastSync: new Date()
//         };
//       });
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [data]);

//   // Auto-refresh timestamps
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setAutoRefreshKey(prev => prev + 1);
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         setShowHelpModal(false);
//         setShowLeaveModal(false);
//       }
//       if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         window.location.reload();
//       }
//       if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         setNotifyEnabled(prev => !prev);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   // Position change announcements
//   useEffect(() => {
//     if (data?.yourEntry && previousPosition.current !== null) {
//       const currentPos = data.yourEntry.position.current;
//       if (currentPos < previousPosition.current) {
//         const announcement = document.createElement('div');
//         announcement.setAttribute('role', 'status');
//         announcement.setAttribute('aria-live', 'polite');
//         announcement.className = 'sr-only';
//         announcement.textContent = `Your position has moved up to number ${currentPos}`;
//         document.body.appendChild(announcement);
//         setTimeout(() => announcement.remove(), 1000);
//       }
//       previousPosition.current = currentPos;
//     } else if (data?.yourEntry) {
//       previousPosition.current = data.yourEntry.position.current;
//     }
//   }, [data?.yourEntry?.position.current]);

//   // ========== HANDLERS ==========
//   const handleNotifyToggle = () => {
//     setNotifyEnabled(prev => !prev);
//     if (!notifyEnabled) {
//       setShowNotificationBanner(false);
//     }
//   };

//   const handleLeaveQueue = () => {
//     setShowLeaveModal(false);
//     console.log('Left queue');
//   };

//   // ========== HELPER FUNCTIONS ==========
//   const formatRelativeTime = (date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);

//     if (diffMins < 1) return 'just now';
//     if (diffMins < 60) return `${diffMins} min ago`;
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
//     return `${Math.floor(diffHours / 24)} day(s) ago`;
//   };

//   const formatAbsoluteTime = (date) => {
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const calculateProgress = (current, total) => {
//     if (total === 0) return 0;
//     return Math.round(((total - current + 1) / total) * 100);
//   };

//   const maskId = (id) => {
//     if (id.length <= 4) return id;
//     return `***${id.slice(-4)}`;
//   };

//   const getGuidanceMessage = (position, estimatedMinutes) => {
//     if (position === 1) {
//       return {
//         message: "🎯 You're next! Please stay nearby and listen for your name.",
//         bgColor: 'bg-green-50 border-green-200',
//         textColor: 'text-green-800'
//       };
//     } else if (position === 2) {
//       return {
//         message: "⏰ You're up soon! Please remain in the waiting area.",
//         bgColor: 'bg-yellow-50 border-yellow-200',
//         textColor: 'text-yellow-800'
//       };
//     } else if (estimatedMinutes > 30) {
//       return {
//         message: "☕ You have time. Feel free to grab a coffee, but stay within the building.",
//         bgColor: 'bg-blue-50 border-blue-200',
//         textColor: 'text-blue-800'
//       };
//     } else {
//       return {
//         message: "📍 Please stay in the waiting area. Your turn is coming up soon.",
//         bgColor: 'bg-indigo-50 border-indigo-200',
//         textColor: 'text-indigo-800'
//       };
//     }
//   };

//   // ========== LOADING STATE ==========
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//         <div className="max-w-6xl mx-auto space-y-6">
//           {/* Loading skeletons */}
//           <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
//               <div className="flex-1">
//                 <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-40"></div>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
//                 <div className="h-12 bg-gray-200 rounded w-20 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-32"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========== ERROR STATE ==========
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Queue</h3>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!data) return null;

//   const { doctor, yourEntry, queue, lastSync } = data;
//   const progress = calculateProgress(yourEntry.position.current, yourEntry.position.total);
//   const guidance = getGuidanceMessage(yourEntry.position.current, yourEntry.estimatedWait.min);
//   const statusConfig = {
//     'with-patient': { label: 'With Patient', color: 'text-orange-600', indicator: 'bg-orange-500' },
//     'available': { label: 'Available', color: 'text-green-600', indicator: 'bg-green-500' },
//     'on-break': { label: 'On Break', color: 'text-yellow-600', indicator: 'bg-yellow-500' },
//     'offline': { label: 'Offline', color: 'text-gray-600', indicator: 'bg-gray-400' }
//   }[doctor.status];

//   // ========== MAIN RENDER ==========
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//       <style>{`
//         .sr-only {
//           position: absolute;
//           width: 1px;
//           height: 1px;
//           padding: 0;
//           margin: -1px;
//           overflow: hidden;
//           clip: rect(0, 0, 0, 0);
//           white-space: nowrap;
//           border-width: 0;
//         }
//       `}</style>

//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Notification Banner */}
//         {showNotificationBanner && !notifyEnabled && (
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
//             <div className="flex items-start gap-3 flex-1">
//               <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//               <div>
//                 <h3 className="font-bold text-sm mb-1">Enable Notifications</h3>
//                 <p className="text-xs text-blue-100">Get notified when you're next in line</p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={handleNotifyToggle}
//                 className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
//               >
//                 Enable
//               </button>
//               <button
//                 onClick={() => setShowNotificationBanner(false)}
//                 className="px-3 py-2 text-white rounded-lg hover:bg-white/20 transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Doctor Header */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-start justify-between gap-4 flex-wrap">
//             <div className="flex items-center gap-4 flex-1 min-w-0">
//               <div className="relative">
//                 <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
//                   {doctor.initials}
//                 </div>
//                 <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${statusConfig.indicator} rounded-full ring-2 ring-white animate-pulse`}></div>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h1 className="text-2xl font-bold text-slate-800 truncate">{doctor.name}</h1>
//                 <p className="text-slate-600 text-base">{doctor.specialty}</p>
//                 <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
//                   <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   </svg>
//                   <span>{doctor.room} - {doctor.floor}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-0.5">
//                   {[1, 2, 3, 4].map(star => (
//                     <svg key={star} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
//                       <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                     </svg>
//                   ))}
//                   <svg className="w-5 h-5 fill-gray-300" viewBox="0 0 20 20">
//                     <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                   </svg>
//                 </div>
//                 <span className="text-slate-700 text-sm font-medium ml-1">
//                   {doctor.rating.toFixed(1)}
//                   <span className="text-slate-400 ml-1">({doctor.totalReviews})</span>
//                 </span>
//               </div>
//               <div className="group relative">
//                 <div className={`${statusConfig.color.replace('text-', 'bg-')}-100 ${statusConfig.color} px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer`}>
//                   <div className={`w-2 h-2 rounded-full ${statusConfig.indicator} animate-pulse`}></div>
//                   <span>{statusConfig.label}</span>
//                 </div>
//                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
//                   Doctor is currently {statusConfig.label.toLowerCase()}
//                   <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Guidance Banner */}
//         <div className={`${guidance.bgColor} ${guidance.textColor} border-2 rounded-xl p-4 flex items-start gap-3`} role="status" aria-live="polite">
//           <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-sm md:text-base font-medium flex-1">{guidance.message}</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Position */}
//           <div className={`bg-white rounded-2xl shadow-sm p-6 ${yourEntry.position.current <= 2 ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
//             <div className="flex items-start justify-between mb-3">
//               <p className="text-slate-500 text-sm font-medium">Your Position</p>
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="text-5xl md:text-6xl font-bold text-slate-800 leading-none">
//               #{yourEntry.position.current}
//             </div>
//             <p className="text-slate-400 text-sm mt-2">
//               {yourEntry.position.ahead} patient{yourEntry.position.ahead !== 1 ? 's' : ''} ahead
//             </p>
//           </div>

//           {/* Estimated Wait */}
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-start justify-between mb-3">
//               <p className="text-slate-500 text-sm font-medium">Estimated Wait</p>
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                   <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
//                 </svg>
//               </div>
//             </div>
//             <div className="text-4xl md:text-5xl font-bold text-slate-800 leading-none">
//               {yourEntry.estimatedWait.min === yourEntry.estimatedWait.max 
//                 ? `~${yourEntry.estimatedWait.min}` 
//                 : `${yourEntry.estimatedWait.min}-${yourEntry.estimatedWait.max}`}
//             </div>
//             <p className="text-slate-400 text-sm mt-2">{yourEntry.estimatedWait.unit}</p>
//           </div>

//           {/* Status */}
//           <div className="bg-white rounded-2xl shadow-sm p-6">
//             <div className="flex items-start justify-between mb-3">
//               <p className="text-slate-500 text-sm font-medium">Queue Status</p>
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 mt-4">
//               <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium text-base flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" strokeWidth="2"/>
//                   <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
//                 </svg>
//                 <span className="capitalize">{yourEntry.status}</span>
//               </div>
//             </div>
//             <p className="text-slate-400 text-sm mt-2">Queue {yourEntry.queueId}</p>
//           </div>
//         </div>

//         {/* Queue Visualization */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
//             </svg>
//             <h2 className="text-lg font-bold text-slate-800">Queue Visualization</h2>
//           </div>

//           {/* Legend */}
//           <div className="flex items-center justify-center gap-6 mb-6 text-xs text-slate-500">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               <span>Current Patient</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-slate-700 ring-4 ring-blue-200"></div>
//               <span>You</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full bg-slate-300"></div>
//               <span>Waiting</span>
//             </div>
//           </div>

//           {/* Queue Positions */}
//           <div className="flex items-center justify-center gap-8 mb-8">
//             {queue.slice(0, 5).map((entry) => {
//               const isCurrent = entry.status === 'in-session';
//               const isYou = entry.isYou;
//               return (
//                 <div key={entry.queueId} className="flex flex-col items-center">
//                   <div className={`
//                     w-16 h-16 rounded-full flex items-center justify-center
//                     text-white text-xl font-bold transition-all
//                     ${isCurrent ? 'bg-green-500 shadow-lg shadow-green-200' : ''}
//                     ${isYou ? 'bg-slate-700 ring-4 ring-blue-200 shadow-lg' : ''}
//                     ${!isCurrent && !isYou ? 'bg-slate-300' : ''}
//                   `}>
//                     {entry.position.current}
//                   </div>
//                   <p className={`text-xs mt-2 font-medium ${isYou ? 'text-slate-700' : 'text-slate-500'}`}>
//                     {isCurrent ? 'Current' : isYou ? 'You' : '\u00A0'}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Progress Bar */}
//           <div className="space-y-3">
//             <div className="flex justify-between text-xs text-slate-500">
//               <span>Joined Queue</span>
//               <span>Your Turn</span>
//             </div>
//             <div className="relative">
//               <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-blue-600 rounded-full transition-all duration-500"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className="text-xs text-slate-500">{progress}% through the queue</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
       

//         {/* Queue Details */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <circle cx="12" cy="12" r="10" strokeWidth="2"/>
//               <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
//             </svg>
//             <h2 className="text-lg font-bold text-slate-800">Queue Details</h2>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Queue Number</p>
//               <p className="text-slate-800 font-bold text-lg">{maskId(yourEntry.queueId)}</p>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Patient ID</p>
//               <p className="text-slate-800 font-bold text-lg">{maskId(yourEntry.patientId)}</p>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Joined At</p>
//               <p className="text-slate-800 font-bold text-base">{formatAbsoluteTime(yourEntry.joinedAt)}</p>
//               <p className="text-slate-400 text-xs mt-0.5">
//                 {yourEntry.joinedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               </p>
//             </div>
//             <div className="bg-slate-50 rounded-xl p-4">
//               <p className="text-slate-500 text-xs mb-1">Time Waiting</p>
//               <p className="text-slate-800 font-bold text-base">{formatRelativeTime(yourEntry.joinedAt)}</p>
//               <p className="text-slate-400 text-xs mt-0.5">Updates live</p>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//             <p className="text-xs text-blue-700 flex items-start gap-2">
//               <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//               <span>Some information is masked for your privacy. Full details are visible only to you and medical staff.</span>
//             </p>
//           </div>
//         </div>

//         {/* Location Info */}
//         <div className="bg-white rounded-2xl shadow-sm p-6">
//           <div className="flex items-center gap-2 mb-6">
//             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
//             </svg>
//             <h2 className="text-lg font-bold text-slate-800">Where to Go</h2>
//           </div>

//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
//             <div className="flex items-center justify-around flex-wrap gap-4">
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3">
//                   {doctor.floor.charAt(0)}
//                 </div>
//                 <p className="text-slate-500 text-xs">Floor</p>
//                 <p className="text-slate-800 font-bold text-sm">{doctor.floor}</p>
//               </div>

//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg mb-3">
//                   {doctor.room}
//                 </div>
//                 <p className="text-slate-500 text-xs">Room Number</p>
//                 <p className="text-slate-800 font-bold text-sm">Room {doctor.room}</p>
//               </div>

//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg mb-3">
//                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
//                   </svg>
//                 </div>
//                 <p className="text-slate-500 text-xs">Doctor</p>
//                 <p className="text-slate-800 font-bold text-sm">{doctor.name}</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
//             <p className="text-xs text-indigo-700 flex items-start gap-2">
//               <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>Look for signs to <strong>{doctor.floor}</strong> and follow room numbers to <strong>{doctor.room}</strong>. Staff at reception can help if needed.</span>
//             </p>
//           </div>
//         </div>

//         {/* Connection Status */}
//         <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center gap-3">
//           <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
//           <span className={`text-sm font-medium ${connectionStatus === 'connected' ? 'text-green-600' : 'text-yellow-600'}`}>
//             {connectionStatus === 'connected' ? 'Connected' : 'Reconnecting...'}
//           </span>
//           {lastSync && connectionStatus === 'connected' && (
//             <span className="text-slate-400 text-xs ml-2">
//               Updated {formatRelativeTime(lastSync)}
//             </span>
//           )}
//         </div>

//         {/* Keyboard Shortcuts */}
       
//       </div>

//       {/* Help Modal */}
//       {showHelpModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHelpModal(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//             <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-slate-800">Need Help?</h2>
//               <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               <div>
//                 <h3 className="text-lg font-bold text-slate-800 mb-3">Frequently Asked Questions</h3>
//                 <div className="space-y-4">
//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-slate-800 mb-2">How accurate is the estimated wait time?</h4>
//                     <p className="text-sm text-slate-600">Wait times are calculated based on average consultation duration and current queue position. Actual times may vary.</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-slate-800 mb-2">Can I leave and come back?</h4>
//                     <p className="text-sm text-slate-600">If you have more than 30 minutes, you may leave the waiting area but stay within the building. Enable notifications to be alerted.</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <h4 className="font-semibold text-slate-800 mb-2">What if I miss my turn?</h4>
//                     <p className="text-sm text-slate-600">Speak to reception immediately. You may be placed at the end of the queue or need to reschedule.</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t border-slate-200 pt-6">
//                 <h3 className="text-lg font-bold text-slate-800 mb-3">Still Need Help?</h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 flex items-center justify-center gap-2">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                     Call Reception
//                   </button>
//                   <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100 flex items-center justify-center gap-2">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                     </svg>
//                     Live Chat
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Leave Queue Modal */}
//       {showLeaveModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowLeaveModal(false)}>
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>

//             <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Leave Queue?</h2>
//             <p className="text-slate-600 text-center mb-6">
//               {yourEntry.position.current <= 2 ? (
//                 <>
//                   You're up soon (position #{yourEntry.position.current})! Are you sure you want to leave?
//                   <strong className="block mt-2 text-red-600">You'll lose your current position.</strong>
//                 </>
//               ) : (
//                 'Are you sure you want to cancel your appointment? You\'ll need to join the queue again if you change your mind.'
//               )}
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowLeaveModal(false)}
//                 className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//               >
//                 Stay in Queue
//               </button>
//               <button
//                 onClick={handleLeaveQueue}
//                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
//               >
//                 Yes, Leave
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
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
