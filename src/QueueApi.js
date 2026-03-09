// // QueueApi.js - نظام إدارة قوائم الانتظار والحجز

// const API_BASE_URL = "http://127.0.0.1:8004";

// // ============================================================================
// // APPOINTMENTS ENDPOINTS
// // ============================================================================

// /**
//  * الحصول على قائمة التخصصات المتاحة
//  */
// export const getSpecialties = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/appointments/specialties`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على التخصصات (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Specialties Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على قائمة الأطباء المتاحين للحجز
//  */
// export const getDoctorsForBooking = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/appointments/doctors`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على الأطباء (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Doctors Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على مواعيد طبيب معين
//  */
// export const getDoctorSlots = async (doctorId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/appointments/doctors/${doctorId}/slots`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على المواعيد (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Slots Error:', error);
//     throw error;
//   }
// };

// /**
//  * حجز موعد مع طبيب
//  */
// export const bookAppointment = async (appointmentData) => {
//   try {
//     console.log('📤 Booking appointment:', appointmentData);

//     const response = await fetch(`${API_BASE_URL}/appointments/book`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: JSON.stringify(appointmentData),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ API Error:', errorText);
//       throw new Error(`خطأ في الحجز (${response.status}): ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('✅ Booking response:', data);
//     return data;

//   } catch (error) {
//     console.error('💥 Booking Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على تفاصيل موعد
//  */
// export const getAppointment = async (appointmentId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على الموعد (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Appointment Error:', error);
//     throw error;
//   }
// };

// /**
//  * إلغاء موعد
//  */
// export const cancelAppointment = async (appointmentId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في إلغاء الموعد (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Cancel Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على مواعيد المريض
//  */
// export const getPatientAppointments = async (patientId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/patients/${patientId}/appointments`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على المواعيد (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Patient Appointments Error:', error);
//     throw error;
//   }
// };

// // ============================================================================
// // QUEUE SYSTEM ENDPOINTS
// // ============================================================================

// /**
//  * الانضمام لقائمة الانتظار
//  */
// export const joinQueue = async (queueData) => {
//   try {
//     console.log('📤 Joining queue:', queueData);

//     const response = await fetch(`${API_BASE_URL}/queue/join`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: JSON.stringify(queueData),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ API Error:', errorText);
//       throw new Error(`خطأ في الانضمام للقائمة (${response.status}): ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('✅ Queue joined:', data);
//     return data;

//   } catch (error) {
//     console.error('💥 Join Queue Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على حالة قائمة الانتظار
//  */
// export const getQueueStatus = async (queueId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/queue/status/${queueId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على حالة القائمة (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Queue Status Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على قائمة انتظار المريض النشطة
//  */
// export const getPatientActiveQueue = async (patientId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/queue/patient/${patientId}/active`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 404) {
//         return null; // لا توجد قائمة انتظار نشطة
//       }
//       throw new Error(`خطأ في الحصول على القائمة النشطة (${response.status})`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Active Queue Error:', error);
//     throw error;
//   }
// };

// /**
//  * إلغاء/مغادرة قائمة الانتظار
//  */
// export const cancelQueue = async (queueId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/queue/${queueId}/cancel`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في مغادرة القائمة (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Cancel Queue Error:', error);
//     throw error;
//   }
// };

// /**
//  * الحصول على إشعارات المريض
//  */
// export const getPatientNotifications = async (patientId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/queue/notifications/${patientId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//     });

//     if (!response.ok) throw new Error(`خطأ في الحصول على الإشعارات (${response.status})`);
//     return await response.json();
//   } catch (error) {
//     console.error('❌ Notifications Error:', error);
//     throw error;
//   }
// };

// // ============================================================================
// // HELPER FUNCTIONS
// // ============================================================================

// /**
//  * التحقق من توفر الطبيب
//  */
// export const checkDoctorAvailability = async (doctorId) => {
//   try {
//     const activeQueue = await getPatientActiveQueue(doctorId);
    
//     // إذا كانت القائمة فارغة أو صغيرة، الطبيب متاح
//     if (!activeQueue || !activeQueue.queue || activeQueue.queue.length === 0) {
//       return {
//         available: true,
//         immediatelyAvailable: true,
//         queueLength: 0
//       };
//     }

//     return {
//       available: true,
//       immediatelyAvailable: false,
//       queueLength: activeQueue.queue.length,
//       estimatedWait: activeQueue.queue.length * 15 // تقدير 15 دقيقة لكل مريض
//     };
//   } catch (error) {
//     console.error('❌ Availability Check Error:', error);
//     return {
//       available: false,
//       error: error.message
//     };
//   }
// };

// /**
//  * تجهيز بيانات الانضمام للقائمة
//  */
// export const prepareQueueData = (doctorId, patientId, additionalData = {}) => {
//   return {
//     doctor_id: doctorId,
//     patient_id: patientId,
//     ...additionalData
//   };
// };

// /**
//  * تجهيز بيانات حجز الموعد
//  */
// export const prepareAppointmentData = (doctorId, patientId, slotId, additionalData = {}) => {
//   return {
//     doctor_id: doctorId,
//     patient_id: patientId,
//     slot_id: slotId,
//     ...additionalData
//   };
// };





// QueueApi.js - Complete version

// ✅ أضف هذا السطر في الأول
const API_BASE_URL = "https://subrhombical-akilah-interproglottidal.ngrok-free.dev";

/**
 * الانضمام لقائمة الانتظار
 */
export const joinQueue = async (queueData) => {
  try {
    console.log('📤 Joining queue:', queueData);

    const response = await fetch(`${API_BASE_URL}/queue/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(queueData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      // محاولة parse الـ JSON للحصول على رسالة خطأ أوضح
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || errorJson.detail || `خطأ في الانضمام للقائمة (${response.status})`);
      } catch (parseError) {
        throw new Error(`خطأ في الانضمام للقائمة (${response.status}): ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('✅ Queue joined:', data);
    return data;

  } catch (error) {
    console.error('💥 Join Queue Error:', error);
    throw error;
  }
};

/**
 * الحصول على حالة قائمة الانتظار
 */
export const getQueueStatus = async (queueId) => {
  try {
    console.log('🔍 Getting queue status for:', queueId);
    
    const response = await fetch(`${API_BASE_URL}/queue/status/${queueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Status Error:', errorText);
      throw new Error(`خطأ في الحصول على حالة القائمة (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Queue status:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Queue Status Error:', error);
    throw error;
  }
};

/**
 * الحصول على قائمة انتظار المريض النشطة
 */
export const getPatientActiveQueue = async (patientId) => {
  try {
    console.log('🔍 Getting active queue for patient:', patientId);
    
    const response = await fetch(`${API_BASE_URL}/queue/patient/${patientId}/active`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('ℹ️ No active queue found for patient');
        return null; // لا توجد قائمة انتظار نشطة
      }
      const errorText = await response.text();
      console.error('❌ Active Queue Error:', errorText);
      throw new Error(`خطأ في الحصول على القائمة النشطة (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Active queue:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Active Queue Error:', error);
    throw error;
  }
};

/**
 * إلغاء/مغادرة قائمة الانتظار
 */
export const cancelQueue = async (queueId) => {
  try {
    console.log('🚫 Cancelling queue:', queueId);
    
    const response = await fetch(`${API_BASE_URL}/queue/${queueId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cancel Error:', errorText);
      throw new Error(`خطأ في مغادرة القائمة (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Queue cancelled:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Cancel Queue Error:', error);
    throw error;
  }
};

/**
 * الحصول على إشعارات المريض
 */
export const getPatientNotifications = async (patientId) => {
  try {
    console.log('🔔 Getting notifications for patient:', patientId);
    
    const response = await fetch(`${API_BASE_URL}/queue/notifications/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Notifications Error:', errorText);
      throw new Error(`خطأ في الحصول على الإشعارات (${response.status})`);
    }
    
    const data = await response.json();
    console.log('✅ Notifications:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Notifications Error:', error);
    throw error;
  }
};