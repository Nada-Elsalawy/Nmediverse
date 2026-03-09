







// // import React, { useEffect, useState } from "react";
// // import {
// //   FaUser,
// //   FaIdCard,
// //   FaPhone,
// //   FaVenusMars,
// //   FaBirthdayCake,
// //   FaNotesMedical,
// //   FaTint,
// //   FaRulerCombined,
// //   FaHeartbeat,
// //   FaAllergies,
// //   FaExclamationTriangle,
// //   FaDownload,
// //   FaFileAlt,
// //   FaExclamationCircle,
// //   FaArrowDown,
// //   FaRing,
// //   FaBriefcase,
// //   FaWeight,
// // } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";

// // export default function PatientDashboard() {
// //   const navigate = useNavigate();
// //   const [patient, setPatient] = useState(null);
// //   const [loading, setLoading] = useState(true);

  
// //   useEffect(() => {
// //     const savedPatient = localStorage.getItem("patient"); 
// //     if (savedPatient) {
// //       try {
// //         const parsed = JSON.parse(savedPatient);
// //         setPatient(parsed);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Error parsing patient data:", err);
// //         navigate("/", { replace: true });
// //       }
// //     } else {
// //       navigate("/", { replace: true }); 
// //     }
// //   }, [navigate]);

// //   const calculateAge = (dob) => {
// //     if (!dob) return "N/A";
// //     const birthDate = new Date(dob);
// //     const today = new Date();
// //     let age = today.getFullYear() - birthDate.getFullYear();
// //     const monthDiff = today.getMonth() - birthDate.getMonth();
// //     const dayDiff = today.getDate() - birthDate.getDate();
// //     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
// //     return age;
// //   };

// //   const calculateBMI = (weight, height) => {
// //     if (!weight || !height) return "N/A";
// //     const heightInMeters = height / 100;
// //     const bmi = weight / (heightInMeters * heightInMeters);
// //     return bmi.toFixed(1);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
// //         <p className="text-2xl text-blue-900">Loading patient data...</p>
// //       </div>
// //     );
// //   }

// //   if (!patient) {
// //     return (
// //       <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
// //         <p className="text-2xl text-red-600">No patient data found</p>
// //       </div>
// //     );
// //   }


// //   const medicationsList = patient.current_medications
// //     ? patient.current_medications.split("|").map((item) => item.trim())
// //     : [];

// //   const allergiesList = patient.allergies
// //     ? patient.allergies.split("|").map((item) => item.trim())
// //     : [];

// //   const chronicList = patient.chronic_diseases
// //     ? patient.chronic_diseases.split("|").map((item) => item.trim())
// //     : [];

// //   return (
// //     <div className="min-h-screen bg-[#e9f3fb] px-2 py-1 font-sans">
// //       <div className="max-w-6xl mx-auto">
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-5">
// //           <div>
// //             <button 
// //               onClick={() => {
// //                 localStorage.removeItem("patient");
// //                 navigate("/", { replace: true });
// //               }}
// //               className="text-blue-900 font-semibold text-lg mt-5"
// //             >
// //               ← back
// //             </button>
// //             <h1 className="text-3xl font-bold text-blue-900 mt-5">
// //               Welcome back {patient.full_name || "Patient"}
// //             </h1>
// //           </div>
          
// //           {patient?.image && (
// //             <div className="flex justify-center">
// //               <img 
// //                 src={patient.image} 
// //                 alt="Patient" 
// //                 className="w-32 h-32 rounded-full shadow-lg object-cover border-4 border-white"
// //               />
// //             </div>
// //           )}
// //         </div>

// //         <h2 className="text-azraq-400 text-2xl mb-10">
// //           Here's your medical summary and treatment history.
// //         </h2>

// //         {/* Info Cards */}
// //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-8">
// //           <InfoCard icon={<FaUser />} title="Full name" value={patient.full_name || "N/A"} />
// //           <InfoCard icon={<FaIdCard />} title="National id" value={patient.national_id || "N/A"} />
// //           <InfoCard icon={<FaPhone />} title="Phone number" value={patient.phone_number || "N/A"} />
// //           <InfoCard icon={<FaVenusMars />} title="Age & Gender" value={`${calculateAge(patient.date_of_birth)} yrs, ${patient.gender || "N/A"}`} />
// //           <InfoCard icon={<FaBirthdayCake />} title="Date of birth" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} />
// //           <InfoCard icon={<FaNotesMedical />} title="Patient ID" value={patient.id || "N/A"} />
// //           <InfoCard icon={<FaTint />} title="Blood Type" value={patient.blood_type || "N/A"} />
// //           <InfoCard icon={<FaRulerCombined />} title="Height & Weight" value={patient.height && patient.weight ? `${patient.height} cm / ${patient.weight} kg` : "Not recorded"} />
// //           <InfoCard icon={<FaHeartbeat />} title="Chronic Diseases" value="" />
// //           <InfoCard icon={<FaAllergies />} title="Allergies" value="" />
// //           <InfoCard icon={<FaRing />} title="Marital Status" value={patient.marital_status || "Not specified"} />
// //           <InfoCard icon={<FaBriefcase />} title="Job" value={patient.job || "Not specified"} />
// //           <InfoCard icon={<FaWeight />} title="BMI" value={calculateBMI(patient.weight, patient.height)} />
// //         </div>

        
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-20">
// //           {/* Chronic Diseases Card */}
// //           <div className="bg-[#e9f3fb] rounded-lg p-5 shadow-md">
// //             <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
// //               <FaHeartbeat className="text-blue-900" />
// //               Chronic Diseases
// //             </h2>
// //             <div className="space-y-3">
// //               {chronicList.length > 0 ? (
// //                 chronicList.map((item, i) => (
// //                   <MedItem key={i} title={item} lines={[]} date="N/A" />
// //                 ))
// //               ) : (
// //                 <p className="text-gray-600 text-center py-6 bg-gray-50 rounded-lg">
// //                   No chronic diseases recorded
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Allergies Card */}
// //           <div className="bg-[#e9f3fb] rounded-lg p-5 shadow-md">
// //             <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
             
// //               Allergies
// //             </h2>
// //             <div className="space-y-3">
// //               {allergiesList.length > 0 ? (
// //                 allergiesList.map((item, i) => (
// //                   <MedItem key={i} title={item} lines={[]} date="N/A" />
// //                 ))
// //               ) : (
// //                 <p className="text-gray-600 text-center py-6 bg-gray-50 rounded-lg">
// //                   No known allergies
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Current Medications */}
// //         {/* <div className="mb-8">
// //           <h2 className="text-2xl font-bold text-blue-900 mb-4">Current Medications</h2>
// //           <div className="space-y-3">
// //             {medicationsList.length > 0 ? (
// //               medicationsList.map((med, i) => (
// //                 <MedItem key={i} title={med} lines={["Consult doctor for dosage"]} date="N/A" />
// //               ))
// //             ) : (
// //               <p className="text-gray-600 text-center py-10">No current medications</p>
// //             )}
// //           </div>
// //         </div> */}

// //         {/* AI Insights */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
// //           <div>
// //             <h2 className="text-xl font-bold text-blue-900 mb-4">AI Insights</h2>
// //             <div className="flex items-start gap-3 p-4">
// //               <div className="flex items-center justify-center w-10 h-10 bg-black">
// //                 <FaExclamationCircle className="text-yellow-600 bg-black text-xl" />
// //               </div>
// //               <div>
// //                 <p className="font-semibold text-black-800 text-sm">Last visit was 30 days ago</p>
// //                 <p className="text-gray-600 text-sm">Consider scheduling a follow-up with your doctor</p>
// //               </div>
// //               <button 
// //                 onClick={() => navigate("/Reports")}
// //                 className="text-blue-700 text-base font-semibold hover:text-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95 mt-4"
// //               >
// //                 Schedule Now
// //               </button>
// //             </div>

// //             <div className="flex items-center justify-between mt-4">
// //               <div className="flex items-center gap-5">
// //                 <p className="text-4xl font-semibold text-blue-900">AI</p>
// //                 <div>
// //                   <p className="font-semibold text-blue-900 text-sm">Please speak with the chatbot</p>
// //                   <p className="text-gray-600 text-xs">Talk to the chatbot to enter your symptoms</p>
// //                 </div>
// //               </div>
// //               <button 
// //                 onClick={() => navigate("/chatBot")}
// //                 className="bg-azraq-500 text-white px-4 py-1 mr-20 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
// //               >
// //                 Speak Now
// //               </button>
// //             </div>
// //           </div>

// //           {/* Reports & Medications */}
// //           <div>
// //             <h2 className="text-2xl font-bold text-blue-900 mb-4">Current Medications</h2>
// //             <div className="bg-[#dfeffb] rounded-lg p-6 shadow-md space-y-4 relative min-h-[450px]">
// //               {medicationsList.length > 0 ? (
// //                 medicationsList.map((med, i) => (
// //                   <MedItem key={i} title={med} lines={["Consult doctor for dosage"]} date="N/A" />
// //                 ))
// //               ) : (
// //                 <p className="text-gray-600 text-center py-10">No current medications</p>
// //               )}
// //               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-700 animate-bounce">
// //                 <FaArrowDown className="text-3xl" />
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Reports & Scans */}
// //         <div className="bg-babyblue text-white p-6 shadow-md mb-8 flex justify-between items-center">
// //           <div>
// //             <h3 className="font-bold text-lg">Reports & Scans</h3>
// //             <p className="text-sm opacity-90">View all your medical reports and scan results</p>
// //           </div>
// //           <button 
// //             onClick={() => navigate("/Files")}
// //             className="bg-[#234a78] px-6 py-3 rounded-lg shadow-md hover:bg-[#1b3a5e] transition-all duration-300 transform hover:scale-105"
// //           >
// //             View All Reports
// //           </button>
// //         </div>

// //         {/* Treatment History */}
// //         <h2 className="text-3xl font-bold text-blue-900 mb-4">Treatment History</h2>
// //         <div className="bg-white shadow-md overflow-hidden">
// //           <table className="min-w-full text-lg">
// //             <thead className="bg-azraq-500 text-left text-white">
// //               <tr>
// //                 <th className="p-5">Date</th>
// //                 <th className="p-5">Department</th>
// //                 <th className="p-5">Doctor</th>
// //                 <th className="p-5">Diagnosis</th>
// //                 <th className="p-5">Treatment</th>
// //                 <th className="p-5">Prescription</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {patient.treatment_history && patient.treatment_history.length > 0 ? (
// //                 patient.treatment_history.map((history, index) => (
// //                   <HistoryRow
// //                     key={index}
// //                     date={history.date || "N/A"}
// //                     dept={history.department || "N/A"}
// //                     doctor={history.doctor || "N/A"}
// //                     diag={history.diagnosis || "N/A"}
// //                     treat={history.treatment || "N/A"}
// //                   />
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="6" className="p-4 text-center text-gray-600">No treatment history available</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Action Buttons */}
// //         <div className="flex justify-center gap-4 mt-8">
// //           <ActionButton icon={<FaFileAlt />} text="View Prescriptions" bgColor="#5593CA" onClick={() => navigate("/prescriptions")} />
// //           <ActionButton icon={<FaDownload />} text="Download Report" bgColor="#5593CA" onClick={() => alert("Download feature coming soon!")} />
// //           <ActionButton icon={<FaNotesMedical />} text="AI Summary" bgColor="#224D7F" onClick={() => navigate("/ai-summary")} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Components
// // function InfoCard({ icon, title, value }) {
// //   return (
// //     <div className="bg-[#5d9ed0] text-white rounded-xl py-6 px-3 flex flex-col items-start justify-start shadow-md hover:scale-105 transition-transform">
// //       <div className="text-black text-3xl mb-3 ml-1">{icon}</div>
// //       <p className="text-sm opacity-90">{title}</p>
// //       <p className="text-base font-semibold mt-1">{value}</p>
// //     </div>
// //   );
// // }

// // function MedItem({ title, lines, date }) {
// //   return (
// //     <div className="bg-[#93c0e6] p-3 rounded-md flex justify-between items-start shadow-sm">
// //       <div>
// //         <p className="font-semibold">{title}</p>
// //         {lines.map((line, i) => line && <p key={i} className="text-xs text-blue-600">{line}</p>)}
// //       </div>
// //       <div className="text-xs text-right text-black-600">
// //         <p>Start Date</p>
// //         <p className="font-medium">{date}</p>
// //       </div>
// //     </div>
// //   );
// // }

// // function HistoryRow({ date, dept, doctor, diag, treat }) {
// //   return (
// //     <tr className="border-t hover:bg-gray-50">
// //       <td className="p-4">{date}</td>
// //       <td className="p-4">{dept}</td>
// //       <td className="p-4">{doctor}</td>
// //       <td className="p-4">{diag}</td>
// //       <td className="p-4">{treat}</td>
// //       <td className="p-4 text-blue-700 font-semibold cursor-pointer hover:underline">View</td>
// //     </tr>
// //   );
// // }

// // function ActionButton({ icon, text, bgColor, onClick }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="text-white px-5 py-3 rounded-lg shadow-md flex items-center gap-2 hover:opacity-90 transition-all duration-300"
// //       style={{ backgroundColor: bgColor }}
// //     >
// //       <span className="text-lg">{icon}</span>
// //       <span className="font-medium">{text}</span>
// //     </button>
// //   );
// // }




// // import React, { useEffect, useState } from "react";
// // import {
// //   FaUser,
// //   FaIdCard,
// //   FaPhone,
// //   FaVenusMars,
// //   FaBirthdayCake,
// //   FaNotesMedical,
// //   FaTint,
// //   FaRulerCombined,
// //   FaHeartbeat,
// //   FaAllergies,
// //   FaExclamationTriangle,
// //   FaDownload,
// //   FaFileAlt,
// //   FaExclamationCircle,
// //   FaArrowDown,
// //   FaRing,
// //   FaBriefcase,
// //   FaWeight,
// // } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";

// // export default function PatientDashboard() {
// //   const navigate = useNavigate();
// //   const [patient, setPatient] = useState(null);
// //   const [loading, setLoading] = useState(true);

  
// //   useEffect(() => {
// //     const savedPatient = localStorage.getItem("patient"); 
// //     if (savedPatient) {
// //       try {
// //         const parsed = JSON.parse(savedPatient);
// //         setPatient(parsed);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Error parsing patient data:", err);
// //         navigate("/", { replace: true });
// //       }
// //     } else {
// //       navigate("/", { replace: true }); 
// //     }
// //   }, [navigate]);

// //   const calculateAge = (dob) => {
// //     if (!dob) return "N/A";
// //     const birthDate = new Date(dob);
// //     const today = new Date();
// //     let age = today.getFullYear() - birthDate.getFullYear();
// //     const monthDiff = today.getMonth() - birthDate.getMonth();
// //     const dayDiff = today.getDate() - birthDate.getDate();
// //     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
// //     return age;
// //   };

// //   const calculateBMI = (weight, height) => {
// //     if (!weight || !height) return "N/A";
// //     const heightInMeters = height / 100;
// //     const bmi = weight / (heightInMeters * heightInMeters);
// //     return bmi.toFixed(1);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
// //         <p className="text-2xl max-sm:text-lg text-blue-900">Loading patient data...</p>
// //       </div>
// //     );
// //   }

// //   if (!patient) {
// //     return (
// //       <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
// //         <p className="text-2xl max-sm:text-lg text-red-600">No patient data found</p>
// //       </div>
// //     );
// //   }


// //   const medicationsList = patient.current_medications
// //     ? patient.current_medications.split("|").map((item) => item.trim())
// //     : [];

// //   const allergiesList = patient.allergies
// //     ? patient.allergies.split("|").map((item) => item.trim())
// //     : [];

// //   const chronicList = patient.chronic_diseases
// //     ? patient.chronic_diseases.split("|").map((item) => item.trim())
// //     : [];

// //   return (
// //     <div className="min-h-screen bg-[#e9f3fb] px-2 max-sm:px-3 py-1 max-sm:py-4 font-sans">
// //       <div className="max-w-6xl mx-auto">
// //         {/* Header */}
// //         <div className="flex max-sm:flex-col justify-between items-center max-sm:items-start mb-5 max-sm:gap-4">
// //           <div className="max-sm:w-full">
// //             <button 
// //               onClick={() => {
// //                 localStorage.removeItem("patient");
// //                 navigate("/", { replace: true });
// //               }}
// //               className="text-blue-900 font-semibold text-lg max-sm:text-base mt-5 max-sm:mt-2"
// //             >
// //               ← back
// //             </button>
// //             <h1 className="text-3xl max-sm:text-xl font-bold text-blue-900 mt-5 max-sm:mt-3">
// //               Welcome back {patient.full_name || "Patient"}
// //             </h1>
// //           </div>
          
// //           {patient?.image && (
// //             <div className="flex justify-center max-sm:w-full">
// //               <img 
// //                 src={patient.image} 
// //                 alt="Patient" 
// //                 className="w-32 h-32 max-sm:w-24 max-sm:h-24 rounded-full shadow-lg object-cover border-4 border-white"
// //               />
// //             </div>
// //           )}
// //         </div>

// //         <h2 className="text-azraq-400 text-2xl max-sm:text-base mb-10 max-sm:mb-6">
// //           Here's your medical summary and treatment history.
// //         </h2>

// //         {/* Info Cards */}
// //         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 max-sm:gap-3 mb-8 max-sm:mb-6">
// //           <InfoCard icon={<FaUser />} title="Full name" value={patient.full_name || "N/A"} />
// //           <InfoCard icon={<FaIdCard />} title="National id" value={patient.national_id || "N/A"} />
// //           <InfoCard icon={<FaPhone />} title="Phone number" value={patient.phone_number || "N/A"} />
// //           <InfoCard icon={<FaVenusMars />} title="Age & Gender" value={`${calculateAge(patient.date_of_birth)} yrs, ${patient.gender || "N/A"}`} />
// //           <InfoCard icon={<FaBirthdayCake />} title="Date of birth" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} />
// //           <InfoCard icon={<FaNotesMedical />} title="Patient ID" value={patient.id || "N/A"} />
// //           <InfoCard icon={<FaTint />} title="Blood Type" value={patient.blood_type || "N/A"} />
// //           <InfoCard icon={<FaRulerCombined />} title="Height & Weight" value={patient.height && patient.weight ? `${patient.height} cm / ${patient.weight} kg` : "Not recorded"} />
     
        
// //           <InfoCard icon={<FaRing />} title="Marital Status" value={patient.marital_status || "Not specified"} />
// //           <InfoCard icon={<FaBriefcase />} title="Job" value={patient.job || "Not specified"} />
// //           <InfoCard icon={<FaWeight />} title="BMI" value={calculateBMI(patient.weight, patient.height)} />
// //         </div>

        
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:gap-4 my-20 max-sm:my-10">
// //           {/* Chronic Diseases Card */}
// //           <div className="bg-[#e9f3fb] rounded-lg p-5 max-sm:p-4 shadow-md">
// //             <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3 flex items-center gap-2">
// //               <FaHeartbeat className="text-blue-900" />
// //               Chronic Diseases
// //             </h2>
// //             <div className="space-y-3 max-sm:space-y-2">
// //               {chronicList.length > 0 ? (
// //                 chronicList.map((item, i) => (
// //                   <MedItem key={i} title={item} lines={[]} date="N/A" />
// //                 ))
// //               ) : (
// //                 <p className="text-gray-600 text-center py-6 max-sm:py-4 bg-gray-50 rounded-lg max-sm:text-sm">
// //                   No chronic diseases recorded
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Allergies Card */}
// //           <div className="bg-[#e9f3fb] rounded-lg p-5 max-sm:p-4 shadow-md">
// //             <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3 flex items-center gap-2">
             
// //               Allergies
// //             </h2>
// //             <div className="space-y-3 max-sm:space-y-2">
// //               {allergiesList.length > 0 ? (
// //                 allergiesList.map((item, i) => (
// //                   <MedItem key={i} title={item} lines={[]} date="N/A" />
// //                 ))
// //               ) : (
// //                 <p className="text-gray-600 text-center py-6 max-sm:py-4 bg-gray-50 rounded-lg max-sm:text-sm">
// //                   No known allergies
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Current Medications */}
// //         {/* <div className="mb-8">
// //           <h2 className="text-2xl font-bold text-blue-900 mb-4">Current Medications</h2>
// //           <div className="space-y-3">
// //             {medicationsList.length > 0 ? (
// //               medicationsList.map((med, i) => (
// //                 <MedItem key={i} title={med} lines={["Consult doctor for dosage"]} date="N/A" />
// //               ))
// //             ) : (
// //               <p className="text-gray-600 text-center py-10">No current medications</p>
// //             )}
// //           </div>
// //         </div> */}

// //         {/* AI Insights */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-sm:gap-4 mb-10 max-sm:mb-6">
// //           <div>
// //             <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3">AI Insights</h2>
// //             <div className="flex items-start gap-3 max-sm:gap-2 p-4 max-sm:p-3">
// //               <div className="flex items-center justify-center w-10 h-10 max-sm:w-8 max-sm:h-8 bg-black">
// //                 <FaExclamationCircle className="text-yellow-600 bg-black text-xl max-sm:text-base" />
// //               </div>
// //               <div>
// //                 <p className="font-semibold text-black-800 text-sm max-sm:text-xs">Last visit was 30 days ago</p>
// //                 <p className="text-gray-600 text-sm max-sm:text-xs">Consider scheduling a follow-up with your doctor</p>
// //               </div>
// //               <button 
// //                 onClick={() => navigate("/Reports")}
// //                 className="text-blue-700 text-base max-sm:text-sm font-semibold hover:text-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95 mt-4 max-sm:mt-2"
// //               >
// //                 Schedule Now
// //               </button>
// //             </div>

// //             <div className="flex max-sm:flex-col items-center max-sm:items-start justify-between mt-4 max-sm:mt-3 max-sm:gap-3">
// //               <div className="flex items-center gap-5 max-sm:gap-3">
// //                 <p className="text-4xl max-sm:text-3xl font-semibold text-blue-900">AI</p>
// //                 <div>
// //                   <p className="font-semibold text-blue-900 text-sm max-sm:text-xs">Please speak with the chatbot</p>
// //                   <p className="text-gray-600 text-xs max-sm:text-[10px]">Talk to the chatbot to enter your symptoms</p>
// //                 </div>
// //               </div>
// //               <button 
// //                 onClick={() => navigate("/chatBot")}
// //                 className="bg-azraq-500 text-white px-4 max-sm:px-3 py-1 max-sm:py-2 mr-20 max-sm:mr-0 max-sm:w-full rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 max-sm:text-sm"
// //               >
// //                 Speak Now
// //               </button>
// //             </div>
// //           </div>

// //           {/* Reports & Medications */}
// //           <div>
// //             <h2 className="text-2xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3">Current Medications</h2>
// //             <div className="bg-[#dfeffb] rounded-lg p-6 max-sm:p-4 shadow-md space-y-4 max-sm:space-y-3 relative min-h-auto max-sm:min-h-[300px]">
// //               {medicationsList.length > 0 ? (
// //                 medicationsList.map((med, i) => (
// //                   <MedItem key={i} title={med} lines={["Consult doctor for dosage"]} date="N/A" />
// //                 ))
// //               ) : (
// //                 <p className="text-gray-600 text-center py-10 max-sm:py-6 max-sm:text-sm">No current medications</p>
// //               )}
// //               {/* <div className="absolute bottom-4 max-sm:bottom-2 left-1/2 transform -translate-x-1/2 text-blue-700 animate-bounce">
// //                 <FaArrowDown className="text-3xl max-sm:text-2xl" />
// //               </div> */}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Reports & Scans */}
// //         <div className="bg-babyblue text-white p-6 max-sm:p-4 shadow-md mb-8 max-sm:mb-6 flex max-sm:flex-col justify-between items-center max-sm:items-start max-sm:gap-4">
// //           <div>
// //             <h3 className="font-bold text-lg max-sm:text-base">Reports & Scans</h3>
// //             <p className="text-sm max-sm:text-xs opacity-90">View all your medical reports and scan results</p>
// //           </div>
// //           <button 
// //             onClick={() => navigate("/Files")}
// //             className="bg-[#234a78] px-6 max-sm:px-4 py-3 max-sm:py-2 max-sm:w-full rounded-lg shadow-md hover:bg-[#1b3a5e] transition-all duration-300 transform hover:scale-105 max-sm:text-sm"
// //           >
// //             View All Reports
// //           </button>
// //         </div>

// //         {/* Treatment History */}
// //         <h2 className="text-3xl max-sm:text-xl font-bold text-blue-900 mb-4 max-sm:mb-3">Treatment History</h2>
// //         <div className="bg-white shadow-md overflow-hidden max-sm:overflow-x-auto">
// //           <table className="min-w-full text-lg max-sm:text-xs">
// //             <thead className="bg-azraq-500 text-left text-white">
// //               <tr>
// //                 <th className="p-5 max-sm:p-2">Date</th>
// //                 <th className="p-5 max-sm:p-2">Department</th>
// //                 <th className="p-5 max-sm:p-2">Doctor</th>
// //                 <th className="p-5 max-sm:p-2">Diagnosis</th>
// //                 <th className="p-5 max-sm:p-2">Treatment</th>
// //                 <th className="p-5 max-sm:p-2">Prescription</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {patient.treatment_history && patient.treatment_history.length > 0 ? (
// //                 patient.treatment_history.map((history, index) => (
// //                   <HistoryRow
// //                     key={index}
// //                     date={history.date || "N/A"}
// //                     dept={history.department || "N/A"}
// //                     doctor={history.doctor || "N/A"}
// //                     diag={history.diagnosis || "N/A"}
// //                     treat={history.treatment || "N/A"}
// //                   />
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="6" className="p-4 max-sm:p-2 text-center text-gray-600 max-sm:text-xs">No treatment history available</td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

       
// //       </div>
// //     </div>
// //   );
// // }

// // // Components
// // function InfoCard({ icon, title, value }) {
// //   return (
// //     <div className="bg-[#5d9ed0] text-white rounded-xl py-6 max-sm:py-4 px-3 max-sm:px-2 flex flex-col items-start justify-start shadow-md hover:scale-105 transition-transform">
// //       <div className="text-black text-3xl max-sm:text-2xl mb-3 max-sm:mb-2 ml-1">{icon}</div>
// //       <p className="text-sm max-sm:text-xs opacity-90">{title}</p>
// //       <p className="text-base max-sm:text-sm font-semibold mt-1">{value}</p>
// //     </div>
// //   );
// // }

// // // function MedItem({ title, lines, date }) {
// // //   return (
// // //     <div className="bg-[#93c0e6] p-3 max-sm:p-2 rounded-md flex justify-between items-start shadow-sm">
// // //       <div>
// // //         <p className="font-semibold max-sm:text-sm">{title}</p>
// // //         {lines.map((line, i) => line && <p key={i} className="text-xs max-sm:text-[10px] text-blue-600">{line}</p>)}
// // //       </div>
// // //       <div className="text-xs max-sm:text-[10px] text-right text-black-600">
// // //         <p>Start Date</p>
// // //         <p className="font-medium">{date}</p>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // function MedItem({ title, lines, date }) {
// //   return (
// //     <div className="bg-white rounded-xl p-4 max-sm:p-3 
// //                     shadow-md border border-blue-100 
// //                     hover:shadow-lg transition-all duration-300">
      
// //       <div className="flex justify-between items-start">
// //         <div>
// //           <p className="font-semibold text-blue-900">{title}</p>

// //           {lines.map((line, i) =>
// //             line && (
// //               <p key={i} className="text-sm text-gray-600">
// //                 {line}
// //               </p>
// //             )
// //           )}
// //         </div>

// //         <div className="text-right text-sm">
// //           <p className="text-gray-500">Start Date</p>
// //           <p className="font-medium">{date}</p>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // }
// // function HistoryRow({ date, dept, doctor, diag, treat }) {
// //   return (
// //     <tr className="border-t hover:bg-gray-50">
// //       <td className="p-4 max-sm:p-2">{date}</td>
// //       <td className="p-4 max-sm:p-2">{dept}</td>
// //       <td className="p-4 max-sm:p-2">{doctor}</td>
// //       <td className="p-4 max-sm:p-2">{diag}</td>
// //       <td className="p-4 max-sm:p-2">{treat}</td>
// //       <td className="p-4 max-sm:p-2 text-blue-700 font-semibold cursor-pointer hover:underline">View</td>
// //     </tr>
// //   );
// // }

// // function ActionButton({ icon, text, bgColor, onClick }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="text-white px-5 max-sm:px-4 py-3 max-sm:py-2 max-sm:w-full rounded-lg shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 max-sm:text-sm"
// //       style={{ backgroundColor: bgColor }}
// //     >
// //       <span className="text-lg max-sm:text-base">{icon}</span>
// //       <span className="font-medium">{text}</span>
// //     </button>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import {
//   FaUser,
//   FaIdCard,
//   FaPhone,
//   FaVenusMars,
//   FaBirthdayCake,
//   FaNotesMedical,
//   FaTint,
//   FaRulerCombined,
//   FaHeartbeat,
//   FaAllergies,
//   FaExclamationTriangle,
//   FaDownload,
//   FaFileAlt,
//   FaExclamationCircle,
//   FaArrowDown,
//   FaRing,
//   FaBriefcase,
//   FaWeight,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export default function PatientDashboard() {
//   const navigate = useNavigate();
//   const [patient, setPatient] = useState(null);
//   const [loading, setLoading] = useState(true);

  
//   useEffect(() => {
//     const savedPatient = localStorage.getItem("patient"); 
//     if (savedPatient) {
//       try {
//         const parsed = JSON.parse(savedPatient);
//         setPatient(parsed);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error parsing patient data:", err);
//         navigate("/", { replace: true });
//       }
//     } else {
//       navigate("/", { replace: true }); 
//     }
//   }, [navigate]);

//   const calculateAge = (dob) => {
//     if (!dob) return "N/A";
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     const dayDiff = today.getDate() - birthDate.getDate();
//     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
//     return age;
//   };

//   const calculateBMI = (weight, height) => {
//     if (!weight || !height) return "N/A";
//     const heightInMeters = height / 100;
//     const bmi = weight / (heightInMeters * heightInMeters);
//     return bmi.toFixed(1);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
//         <p className="text-2xl max-sm:text-lg text-blue-900">Loading patient data...</p>
//       </div>
//     );
//   }

//   if (!patient) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
//         <p className="text-2xl max-sm:text-lg text-red-600">No patient data found</p>
//       </div>
//     );
//   }


//   const medicationsList = patient.current_medications
//     ? patient.current_medications.split(/[|,]/).map((item) => item.trim()).filter(Boolean)
//     : [];

//   const allergiesList = patient.allergies
//     ? patient.allergies.split(/[|,]/).map((item) => item.trim()).filter(Boolean)
//     : [];

//   const chronicList = patient.chronic_diseases
//     ? patient.chronic_diseases.split(/[|,]/).map((item) => item.trim()).filter(Boolean)
//     : [];

//   return (
//     <div className="min-h-screen bg-[#e9f3fb] px-2 max-sm:px-3 py-1 max-sm:py-4 font-sans">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex max-sm:flex-col justify-between items-center max-sm:items-start mb-5 max-sm:gap-4">
//           <div className="max-sm:w-full">
//             <button 
//               onClick={() => {
//                 localStorage.removeItem("patient");
//                 navigate("/", { replace: true });
//               }}
//               className="text-blue-900 font-semibold text-lg max-sm:text-base mt-5 max-sm:mt-2"
//             >
//               ← back
//             </button>
//             <h1 className="text-3xl max-sm:text-xl font-bold text-blue-900 mt-5 max-sm:mt-3">
//               Welcome back {patient.full_name || "Patient"}
//             </h1>
//           </div>
          
//           {patient?.image && (
//             <div className="flex justify-center max-sm:w-full">
//               <img 
//                 src={patient.image} 
//                 alt="Patient" 
//                 className="w-32 h-32 max-sm:w-24 max-sm:h-24 rounded-full shadow-lg object-cover border-4 border-white"
//               />
//             </div>
//           )}
//         </div>

//         <h2 className="text-azraq-400 text-2xl max-sm:text-base mb-10 max-sm:mb-6">
//           Here's your medical summary and treatment history.
//         </h2>

//         {/* Info Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 max-sm:gap-3 mb-8 max-sm:mb-6">
//           <InfoCard icon={<FaUser />} title="Full name" value={patient.full_name || "N/A"} />
//           <InfoCard icon={<FaIdCard />} title="National id" value={patient.national_id || "N/A"} />
//           <InfoCard icon={<FaPhone />} title="Phone number" value={patient.phone_number || "N/A"} />
//           <InfoCard icon={<FaVenusMars />} title="Age & Gender" value={`${calculateAge(patient.date_of_birth)} yrs, ${patient.gender || "N/A"}`} />
//           <InfoCard icon={<FaBirthdayCake />} title="Date of birth" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} />
//           <InfoCard icon={<FaNotesMedical />} title="Patient ID" value={patient.id || "N/A"} />
//           <InfoCard icon={<FaTint />} title="Blood Type" value={patient.blood_type || "N/A"} />
//           <InfoCard icon={<FaRulerCombined />} title="Height & Weight" value={patient.height && patient.weight ? `${patient.height} cm / ${patient.weight} kg` : "Not recorded"} />
     
        
//           <InfoCard icon={<FaRing />} title="Marital Status" value={patient.marital_status || "Not specified"} />
//           <InfoCard icon={<FaBriefcase />} title="Job" value={patient.job || "Not specified"} />
//           <InfoCard icon={<FaWeight />} title="BMI" value={calculateBMI(patient.weight, patient.height)} />
//         </div>

        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:gap-4  my-20 max-sm:my-10">
//           {/* Chronic Diseases Card */}
//           <div className="bg-[#e9f3fb] rounded-lg p-5 max-sm:p-4 shadow-md">
//             <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3 flex items-center gap-2">
//               <FaHeartbeat className="text-blue-900" />
//               Chronic Diseases
//             </h2>
//             <div className="space-y-3 max-sm:space-y-2">
//               {chronicList.length > 0 ? (
//                 chronicList.map((item, i) => (
//                   <MedItem key={i} title={item} lines={[]} date="N/A" />
//                 ))
//               ) : (
//                 <p className="text-gray-600 text-center py-6 max-sm:py-4 bg-gray-50 rounded-lg max-sm:text-sm">
//                   No chronic diseases recorded
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Allergies Card */}
//           <div className="bg-[#e9f3fb] rounded-lg p-5 max-sm:p-4 shadow-md ">
//             <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3 flex items-center gap-2">
//               Allergies
//             </h2>
//             <div className="space-y-3 max-sm:space-y-2">
//               {allergiesList.length > 0 ? (
//                 allergiesList.map((item, i) => (
//                   <MedItem key={i} title={item} lines={[]} date="N/A" />
//                 ))
//               ) : (
//                 <p className="text-gray-600 text-center py-6 max-sm:py-4 bg-gray-50 rounded-lg max-sm:text-sm">
//                   No known allergies
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* AI Insights */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-sm:gap-4 mb-10 max-sm:mb-6">
//           <div>
//             <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3">AI Insights</h2>
//             <div className="flex items-start gap-3 max-sm:gap-2 p-4 max-sm:p-3">
//               <div className="flex items-center justify-center w-10 h-10 max-sm:w-8 max-sm:h-8 bg-black">
//                 <FaExclamationCircle className="text-yellow-600 bg-black text-xl max-sm:text-base" />
//               </div>
//               <div>
//                 <p className="font-semibold text-black-800 text-sm max-sm:text-xs">Last visit was 30 days ago</p>
//                 <p className="text-gray-600 text-sm max-sm:text-xs">Consider scheduling a follow-up with your doctor</p>
//               </div>
//               <button 
//                 onClick={() => navigate("/Reports")}
//                 className="text-blue-700 text-base max-sm:text-sm font-semibold hover:text-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95 mt-4 max-sm:mt-2"
//               >
//                 Schedule Now
//               </button>
//             </div>

//             <div className="flex max-sm:flex-col items-center max-sm:items-start justify-between mt-4 max-sm:mt-3 max-sm:gap-3">
//               <div className="flex items-center gap-5 max-sm:gap-3">
//                 <p className="text-4xl max-sm:text-3xl font-semibold text-blue-900">AI</p>
//                 <div>
//                   <p className="font-semibold text-blue-900 text-sm max-sm:text-xs">Please speak with the chatbot</p>
//                   <p className="text-gray-600 text-xs max-sm:text-[10px]">Talk to the chatbot to enter your symptoms</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => navigate("/chatBot")}
//                 className="bg-azraq-500 text-white px-4 max-sm:px-3 py-1 max-sm:py-2 mr-20 max-sm:mr-0 max-sm:w-full rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 max-sm:text-sm"
//               >
//                 Speak Now
//               </button>
//             </div>
//           </div>

//           {/* Current Medications */}
//           <div>
//             <h2 className="text-2xl  max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3">Current Medications</h2>
//             <div className="bg-[#dfeffb]  rounded-lg p-6 max-sm:p-4 shadow-md space-y-4 max-sm:space-y-3 relative min-h-auto max-sm:min-h-[300px]">
//               {medicationsList.length > 0 ? (
//                 medicationsList.map((med, i) => (
//                   <MedItem key={i} title={med} lines={["Consult doctor for dosage"]}  />
//                 ))
//               ) : (
//                 <p className="text-gray-600 text-center py-10 max-sm:py-6 max-sm:text-sm">No current medications</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Reports & Scans */}
//         <div className="bg-babyblue text-white p-6 max-sm:p-4 shadow-md mb-8 max-sm:mb-6 flex max-sm:flex-col justify-between items-center max-sm:items-start max-sm:gap-4">
//           <div>
//             <h3 className="font-bold text-lg max-sm:text-base">Reports & Scans</h3>
//             <p className="text-sm max-sm:text-xs opacity-90">View all your medical reports and scan results</p>
//           </div>
//           <button 
//             onClick={() => navigate("/Files")}
//             className="bg-[#234a78] px-6 max-sm:px-4 py-3 max-sm:py-2 max-sm:w-full rounded-lg shadow-md hover:bg-[#1b3a5e] transition-all duration-300 transform hover:scale-105 max-sm:text-sm"
//           >
//             View All Reports
//           </button>
//         </div>

//         {/* Treatment History */}
//         <h2 className="text-3xl max-sm:text-xl font-bold text-blue-900 mb-4 max-sm:mb-3">Treatment History</h2>
//         <div className="bg-white shadow-md overflow-hidden max-sm:overflow-x-auto mb-5">
//           <table className="min-w-full text-lg max-sm:text-xs">
//             <thead className="bg-azraq-500 text-left text-white">
//               <tr>
//                 <th className="p-5 max-sm:p-2">Date</th>
//                 <th className="p-5 max-sm:p-2">Department</th>
//                 <th className="p-5 max-sm:p-2">Doctor</th>
//                 <th className="p-5 max-sm:p-2">Diagnosis</th>
//                 <th className="p-5 max-sm:p-2">Treatment</th>
//                 <th className="p-5 max-sm:p-2">Prescription</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patient.treatment_history && patient.treatment_history.length > 0 ? (
//                 patient.treatment_history.map((history, index) => (
//                   <HistoryRow
//                     key={index}
//                     date={history.date || "N/A"}
//                     dept={history.department || "N/A"}
//                     doctor={history.doctor || "N/A"}
//                     diag={history.diagnosis || "N/A"}
//                     treat={history.treatment || "N/A"}
//                   />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="p-4 max-sm:p-2 text-center text-gray-600 max-sm:text-xs">No treatment history available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

       
//       </div>
//     </div>
//   );
// }

// // Components
// function InfoCard({ icon, title, value }) {
//   return (
//     <div className="bg-[#5d9ed0] text-white rounded-xl py-6 max-sm:py-4 px-3 max-sm:px-2 flex flex-col items-start justify-start shadow-md hover:scale-105 transition-transform">
//       <div className="text-black text-3xl max-sm:text-2xl mb-3 max-sm:mb-2 ml-1">{icon}</div>
//       <p className="text-sm max-sm:text-xs opacity-90">{title}</p>
//       <p className="text-base max-sm:text-sm font-semibold mt-1">{value}</p>
//     </div>
//   );
// }

// function MedItem({ title, lines, date }) {
//   return (
//     <div className="bg-[#93c0e6] rounded-lg flex justify-between items-center shadow-sm  overflow-hidden">
//       {/* Red left border accent */}
//       <div className="w-1 self-stretch  flex-shrink-0" />
//       <div className="flex-1 px-4 py-3 max-sm:py-2">
//         <p className="font-semibold text-blue-900 max-sm:text-sm">{title}</p>
//         {lines.map((line, i) => line && (
//           <p key={i} className="text-xs max-sm:text-[10px] text-blue-500 mt-0.5">{line}</p>
//         ))}
//       </div>
      
//     </div>
//   );
// }

// function HistoryRow({ date, dept, doctor, diag, treat }) {
//   return (
//     <tr className="border-t hover:bg-gray-50">
//       <td className="p-4 max-sm:p-2">{date}</td>
//       <td className="p-4 max-sm:p-2">{dept}</td>
//       <td className="p-4 max-sm:p-2">{doctor}</td>
//       <td className="p-4 max-sm:p-2">{diag}</td>
//       <td className="p-4 max-sm:p-2">{treat}</td>
//       <td className="p-4 max-sm:p-2 text-blue-700 font-semibold cursor-pointer hover:underline">View</td>
//     </tr>
//   );
// }

// function ActionButton({ icon, text, bgColor, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="text-white px-5 max-sm:px-4 py-3 max-sm:py-2 max-sm:w-full rounded-lg shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 max-sm:text-sm"
//       style={{ backgroundColor: bgColor }}
//     >
//       <span className="text-lg max-sm:text-base">{icon}</span>
//       <span className="font-medium">{text}</span>
//     </button>
//   );
// }







import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaVenusMars,
  FaBirthdayCake,
  FaNotesMedical,
  FaTint,
  FaRulerCombined,
  FaHeartbeat,
  FaExclamationCircle,
  FaRing,
  FaBriefcase,
  FaWeight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [lastVisit, setLastVisit] = useState(undefined); // undefined = not fetched yet
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const savedPatient = localStorage.getItem("patient");
    if (savedPatient) {
      try {
        const parsed = JSON.parse(savedPatient);
        setPatient(parsed);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing patient data:", err);
        navigate("/", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!patient?.id) return;

    const headers = {
      accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    };

    // Fetch treatment history (consultations)
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/patients/${patient.id}/history`,
          { headers }
        );
        if (response.ok) {
          const data = await response.json();
          setConsultations(data.consultations || []);
        }
      } catch (err) {
        console.error("Error fetching treatment history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    // Fetch last visit info
    const fetchLastVisit = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/patients/${patient.id}/last-visit`,
          { headers }
        );
        if (response.ok) {
          const data = await response.json();
          setLastVisit(data);
        } else {
          setLastVisit(null);
        }
      } catch (err) {
        console.error("Error fetching last visit:", err);
        setLastVisit(null);
      }
    };

    fetchHistory();
    fetchLastVisit();
  }, [patient]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
    return age;
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return "N/A";
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const getDaysSinceLastVisit = () => {
    if (!lastVisit?.date) return null;
    const visitDate = new Date(lastVisit.date);
    const today = new Date();
    const diffTime = Math.abs(today - visitDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSeverityBadge = (severity) => {
    if (severity >= 8) return { label: "High", color: "bg-red-100 text-red-700" };
    if (severity >= 6) return { label: "Medium", color: "bg-orange-100 text-orange-700" };
    return { label: "Low", color: "bg-green-100 text-green-700" };
  };

  const getLastVisitText = () => {
    if (lastVisit === undefined) return "Loading last visit...";
    if (!lastVisit || !lastVisit.date) return "No previous visits recorded";
    const days = getDaysSinceLastVisit();
    return `Last visit was ${days} day${days !== 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
        <p className="text-2xl max-sm:text-lg text-blue-900">Loading patient data...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#e9f3fb]">
        <p className="text-2xl max-sm:text-lg text-red-600">No patient data found</p>
      </div>
    );
  }

  const medicationsList = patient.current_medications
    ? patient.current_medications.split(/[|,]/).map((item) => item.trim()).filter(Boolean)
    : [];

  const allergiesList = patient.allergies
    ? patient.allergies.split(/[|,]/).map((item) => item.trim()).filter(Boolean)
    : [];

  const chronicList = patient.chronic_diseases
    ? patient.chronic_diseases.split(/[|,]/).map((item) => item.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#e9f3fb] px-2 max-sm:px-3 py-1 max-sm:py-4 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex max-sm:flex-col justify-between items-center max-sm:items-start mb-5 max-sm:gap-4">
          <div className="max-sm:w-full">
            <button
              onClick={() => {
                localStorage.removeItem("patient");
                navigate("/", { replace: true });
              }}
              className="text-blue-900 font-semibold text-lg max-sm:text-base mt-5 max-sm:mt-2"
            >
              ← back
            </button>
            <h1 className="text-3xl max-sm:text-xl font-bold text-blue-900 mt-5 max-sm:mt-3">
              Welcome back {patient.full_name || "Patient"}
            </h1>
          </div>
          {patient?.image && (
            <div className="flex justify-center max-sm:w-full">
              <img
                src={patient.image}
                alt="Patient"
                className="w-32 h-32 max-sm:w-24 max-sm:h-24 rounded-full shadow-lg object-cover border-4 border-white"
              />
            </div>
          )}
        </div>

        <h2 className="text-azraq-400 text-2xl max-sm:text-base mb-10 max-sm:mb-6">
          Here's your medical summary and treatment history.
        </h2>

        {/* Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 max-sm:gap-3 mb-8 max-sm:mb-6">
          <InfoCard icon={<FaUser />} title="Full name" value={patient.full_name || "N/A"} />
          <InfoCard icon={<FaIdCard />} title="National id" value={patient.national_id || "N/A"} />
          <InfoCard icon={<FaPhone />} title="Phone number" value={patient.phone_number || "N/A"} />
          <InfoCard icon={<FaVenusMars />} title="Age & Gender" value={`${calculateAge(patient.date_of_birth)} yrs, ${patient.gender || "N/A"}`} />
          <InfoCard icon={<FaBirthdayCake />} title="Date of birth" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"} />
          
          <InfoCard icon={<FaTint />} title="Blood Type" value={patient.blood_type || "N/A"} />
          <InfoCard icon={<FaRulerCombined />} title="Height & Weight" value={patient.height && patient.weight ? `${patient.height} cm / ${patient.weight} kg` : "Not recorded"} />
          <InfoCard icon={<FaRing />} title="Marital Status" value={patient.marital_status || "Not specified"} />
          <InfoCard icon={<FaBriefcase />} title="Job" value={patient.job || "Not specified"} />
          <InfoCard icon={<FaWeight />} title="BMI" value={calculateBMI(patient.weight, patient.height)} />
        </div>

        {/* Chronic Diseases & Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-sm:gap-4 my-20 max-sm:my-10">
          <div className="bg-[#e9f3fb] rounded-lg p-5 max-sm:p-4 shadow-md">
            <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3 flex items-center gap-2">
              <FaHeartbeat className="text-blue-900" /> Chronic Diseases
            </h2>
            <div className="space-y-3 max-sm:space-y-2">
              {chronicList.length > 0 ? (
                chronicList.map((item, i) => <MedItem key={i} title={item} lines={[]} />)
              ) : (
                <p className="text-gray-600 text-center py-6 max-sm:py-4 bg-gray-50 rounded-lg max-sm:text-sm">
                  No chronic diseases recorded
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#e9f3fb] rounded-lg p-5 max-sm:p-4 shadow-md">
            <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3 flex items-center gap-2">
              Allergies
            </h2>
            <div className="space-y-3 max-sm:space-y-2">
              {allergiesList.length > 0 ? (
                allergiesList.map((item, i) => <MedItem key={i} title={item} lines={[]} />)
              ) : (
                <p className="text-gray-600 text-center py-6 max-sm:py-4 bg-gray-50 rounded-lg max-sm:text-sm">
                  No known allergies
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI Insights + Current Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-sm:gap-4 mb-10 max-sm:mb-6">
          <div>
            <h2 className="text-xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3">AI Insights</h2>

            {/* Last Visit Card - Dynamic */}
            <div className="flex items-start gap-3 max-sm:gap-2 p-4 max-sm:p-3">
              <div className="flex items-center justify-center w-10 h-10 max-sm:w-8 max-sm:h-8 bg-black flex-shrink-0">
                <FaExclamationCircle className="text-yellow-600 text-xl max-sm:text-base" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm max-sm:text-xs">
                  {getLastVisitText()}
                </p>
                {lastVisit?.specialty && (
                  <p className="text-gray-500 text-xs max-sm:text-[10px]">
                    {lastVisit.specialty} — {formatDate(lastVisit.date)}
                  </p>
                )}
                <p className="text-gray-600 text-sm max-sm:text-xs mt-1">
                  Consider scheduling a follow-up with your doctor
                </p>
              </div>
              <button
                onClick={() => navigate("/Reports")}
                className="text-blue-700 text-base max-sm:text-sm font-semibold hover:text-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                Schedule Now
              </button>
            </div>

            <div className="flex max-sm:flex-col items-center max-sm:items-start justify-between mt-4 max-sm:mt-3 max-sm:gap-3">
              <div className="flex items-center gap-5 max-sm:gap-3">
                <p className="text-4xl max-sm:text-3xl font-semibold text-blue-900">AI</p>
                <div>
                  <p className="font-semibold text-blue-900 text-sm max-sm:text-xs">Please speak with the chatbot</p>
                  <p className="text-gray-600 text-xs max-sm:text-[10px]">Talk to the chatbot to enter your symptoms</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/chatBot")}
                className="bg-azraq-500 text-white px-4 max-sm:px-3 py-1 max-sm:py-2 mr-20 max-sm:mr-0 max-sm:w-full rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 max-sm:text-sm"
              >
                Speak Now
              </button>
            </div>
          </div>

          {/* Current Medications */}
          <div>
            <h2 className="text-2xl max-sm:text-lg font-bold text-blue-900 mb-4 max-sm:mb-3">Current Medications</h2>
            <div className="bg-[#dfeffb] rounded-lg p-6 max-sm:p-4 shadow-md space-y-4 max-sm:space-y-3 min-h-[200px]">
              {medicationsList.length > 0 ? (
                medicationsList.map((med, i) => (
                  <MedItem key={i} title={med} lines={["Consult doctor for dosage"]} />
                ))
              ) : (
                <p className="text-gray-600 text-center py-10 max-sm:py-6 max-sm:text-sm">No current medications</p>
              )}
            </div>
          </div>
        </div>

        {/* Reports & Scans */}
        <div className="bg-babyblue text-white p-6 max-sm:p-4 shadow-md mb-8 max-sm:mb-6 flex max-sm:flex-col justify-between items-center max-sm:items-start max-sm:gap-4">
          <div>
            <h3 className="font-bold text-lg max-sm:text-base">Reports & Scans</h3>
            <p className="text-sm max-sm:text-xs opacity-90">View all your medical reports and scan results</p>
          </div>
          <button
            onClick={() => navigate("/Files")}
            className="bg-[#234a78] px-6 max-sm:px-4 py-3 max-sm:py-2 max-sm:w-full rounded-lg shadow-md hover:bg-[#1b3a5e] transition-all duration-300 transform hover:scale-105 max-sm:text-sm"
          >
            View All Reports
          </button>
        </div>

        {/* Treatment History Table */}
        <h2 className="text-3xl max-sm:text-xl font-bold text-blue-900 mb-4 max-sm:mb-3">Treatment History</h2>
        <div className="bg-white shadow-md overflow-hidden max-sm:overflow-x-auto mb-5">
          {historyLoading ? (
            <p className="text-center text-blue-900 py-8">Loading treatment history...</p>
          ) : (
            <table className="min-w-full text-lg max-sm:text-xs">
              <thead className="bg-azraq-500 text-left text-white">
                <tr>
                  <th className="p-5 max-sm:p-2">Date</th>
                  <th className="p-5 max-sm:p-2">Specialty</th>
                  <th className="p-5 max-sm:p-2">Doctor</th>
                  <th className="p-5 max-sm:p-2">Diagnosis</th>
                  <th className="p-5 max-sm:p-2">Symptoms</th>
                  <th className="p-5 max-sm:p-2">Severity</th>
                  <th className="p-5 max-sm:p-2">Doctor Notes</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length > 0 ? (
                  consultations.slice(0, visibleCount).map((consultation, index) => {
                    const badge = getSeverityBadge(consultation.severity);
                    return (
                      <tr key={consultation.consultation_id || index} className="border-t hover:bg-gray-50">
                        <td className="p-4 max-sm:p-2 whitespace-nowrap">{formatDate(consultation.date)}</td>
                        <td className="p-4 max-sm:p-2">{consultation.specialty || "N/A"}</td>
                        <td className="p-4 max-sm:p-2">{consultation.doctor_name || "—"}</td>
                        <td className="p-4 max-sm:p-2 max-w-xs">{consultation.diagnosis || "N/A"}</td>
                        <td className="p-4 max-sm:p-2 max-w-xs text-gray-600">{consultation.symptoms || "N/A"}</td>
                        <td className="p-4 max-sm:p-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                            {consultation.severity}/10 · {badge.label}
                          </span>
                        </td>
                        <td className="p-4 max-sm:p-2 text-gray-600">{consultation.doctor_notes || "—"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 max-sm:p-2 text-center text-gray-600 max-sm:text-xs">
                      No treatment history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* See More / See Less */}
          {consultations.length > 10 && (
            <div className="flex justify-center py-4">
              {visibleCount < consultations.length ? (
                <button
                  onClick={() => setVisibleCount(visibleCount + 10)}
                  className="text-blue-700 font-semibold text-sm hover:text-blue-900 flex items-center gap-1"
                >
                  ↓ See More ({consultations.length - visibleCount} more)
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(10)}
                  className="text-blue-700 font-semibold text-sm hover:text-blue-900 flex items-center gap-1"
                >
                  ↑ See Less
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-[#5d9ed0] text-white rounded-xl py-6 max-sm:py-4 px-3 max-sm:px-2 flex flex-col items-start justify-start shadow-md hover:scale-105 transition-transform">
      <div className="text-black text-3xl max-sm:text-2xl mb-3 max-sm:mb-2 ml-1">{icon}</div>
      <p className="text-sm max-sm:text-xs opacity-90">{title}</p>
      <p className="text-base max-sm:text-sm font-semibold mt-1">{value}</p>
    </div>
  );
}

function MedItem({ title, lines }) {
  return (
    <div className="bg-[#93c0e6] rounded-lg flex items-center shadow-sm overflow-hidden">
      <div className="w-1 self-stretch flex-shrink-0" />
      <div className="flex-1 px-4 py-3 max-sm:py-2">
        <p className="font-semibold text-blue-900 max-sm:text-sm">{title}</p>
        {lines && lines.map((line, i) =>
          line && <p key={i} className="text-xs max-sm:text-[10px] text-blue-500 mt-0.5">{line}</p>
        )}
      </div>
    </div>
  );
}