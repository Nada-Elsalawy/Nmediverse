







// const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// class DoctorAPI {
//   constructor() {
//     this.baseURL = BASE_URL;
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//         ...options.headers,
//       },
//     };

//     try {
//       const response = await fetch(url, config);
      
      
//       const contentType = response.headers.get('content-type');
      
//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;
        
//         try {
//           if (contentType && contentType.includes('application/json')) {
//             const error = await response.json();
//             errorMessage = error.message || error.detail || errorMessage;
//           } else {
//             const errorText = await response.text();
//             console.error('❌ Server error:', errorText.substring(0, 200));
//             errorMessage = `Server error (${response.status})`;
//           }
//         } catch (parseError) {
//           console.error('❌ Error parsing error response:', parseError);
//         }
        
//         throw new Error(errorMessage);
//       }
      
    
//       if (contentType && contentType.includes('application/json')) {
//         return await response.json();
//       } else {
//         const text = await response.text();
//         console.warn('⚠️ Non-JSON response:', text.substring(0, 200));
//         throw new Error('Server returned non-JSON response');
//       }
      
//     } catch (error) {
//       console.error('💥 API Request Error:', error);
//       throw error;
//     }
//   }

 
//   async checkDoctorAvailability(doctorId) {
//     try {
//       console.log('🔍 Checking doctor availability for ID:', doctorId);
      
      
      
//       try {
       
//         const queueData = await this.getQueue();
        
//         if (queueData && Array.isArray(queueData)) {
//           const current_patients = queueData.length || 0;
          
//           return {
//             available: current_patients === 0,
//             current_patients: current_patients,
//             status: current_patients === 0 ? 'available' : 'busy',
//             doctor_id: doctorId
//           };
//         }
        
//       } catch (queueError) {
//         console.warn('⚠️ Could not get queue, trying profile...');
        
       
//         try {
//           const profile = await this.getProfile();
          
//           if (profile && profile.status) {
//             return {
//               available: profile.status === 'available',
//               current_patients: profile.current_patients || 0,
//               status: profile.status,
//               doctor_id: doctorId
//             };
//           }
          
//         } catch (profileError) {
//           console.warn('⚠️ Could not get profile either');
//         }
//       }
      
     
//       console.warn('⚠️ Unable to determine doctor availability - assuming busy for safety');
//       return {
//         available: false,
//         current_patients: 1,
//         status: 'unknown',
//         doctor_id: doctorId,
//         note: 'Could not verify availability - defaulting to busy'
//       };
      
//     } catch (error) {
//       console.error('❌ Error checking doctor availability:', error);
      
     
//       return {
//         available: false,
//         current_patients: 1,
//         status: 'unknown',
//         error: error.message
//       };
//     }
//   }

  
//   async checkDoctorAvailabilityViaBooking(doctorId, patientId) {
//     try {
     
//       const activeQueue = await this.getPatientActiveQueue(patientId);
      
//       if (activeQueue && activeQueue.doctor_id === doctorId) {
        
//         return {
//           available: false,
//           current_patients: activeQueue.position || 1,
//           status: 'busy',
//           doctor_id: doctorId,
//           note: 'Patient already in queue'
//         };
//       }
     
//       return {
//         available: true,
//         current_patients: 0,
//         status: 'available',
//         doctor_id: doctorId
//       };
      
//     } catch (error) {
      
//       if (error.message.includes('404')) {
//         return {
//           available: true,
//           current_patients: 0,
//           status: 'available',
//           doctor_id: doctorId
//         };
//       }
      
//       throw error;
//     }
//   }

  
//   async getProfile() {
//     return this.request('/doctor/profile', {
//       method: 'GET',
//     });
//   }


//   async updateProfile(profileData) {
//     return this.request('/doctor/profile', {
//       method: 'PUT',
//       body: JSON.stringify(profileData),
//     });
//   }

  
//   async updateStatus(statusData) {
//     return this.request('/doctor/status', {
//       method: 'PUT',
//       body: JSON.stringify(statusData),
//     });
//   }

 
//   async getQueue() {
//     return this.request('/doctor/queue', {
//       method: 'GET',
//     });
//   }

  
//   async callNext() {
//     return this.request('/doctor/queue/next', {
//       method: 'POST',
//     });
//   }

 
//   async completeConsultation(queueId, consultationData) {
//     return this.request(`/doctor/queue/${queueId}/complete`, {
//       method: 'POST',
//       body: JSON.stringify(consultationData),
//     });
//   }

 
//   async markNoShow(queueId) {
//     return this.request(`/doctor/queue/${queueId}/no-show`, {
//       method: 'POST',
//     });
//   }

 
//   async getPatient(patientId) {
//     return this.request(`/doctor/patient/${patientId}`, {
//       method: 'GET',
//     });
//   }


//   async addNote(noteData) {
//     return this.request('/doctor/notes', {
//       method: 'POST',
//       body: JSON.stringify(noteData),
//     });
//   }

//   async getStats() {
//     return this.request('/doctor/stats', {
//       method: 'GET',
//     });
//   }

 
//   async getMyUploads() {
//     return this.request('/doctor/my-uploads', {
//       method: 'GET',
//     });
//   }

//   // ==================== Medical Files APIs ====================
  
//   async analyzeMedicalImage(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
    
//     if (fileData.symptoms) {
//       formData.append('symptoms', fileData.symptoms);
//     }
//     if (fileData.patientId) {
//       formData.append('patient_id', fileData.patientId);
//     }

//     return fetch(`${this.baseURL}/medical-files/analyze`, {
//       method: 'POST',
//       headers: {
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: formData,
//     }).then(async res => {
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Analysis failed: ${text}`);
//       }
//       return res.json();
//     });
//   }
  
//   // POST /medical-files/upload - Upload Medical File
//   async uploadMedicalFile(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     formData.append('patient_id', fileData.patientId);
//     formData.append('file_type', fileData.fileType);
    
//     if (fileData.title) {
//       formData.append('title', fileData.title);
//     }
//     if (fileData.description) {
//       formData.append('description', fileData.description);
//     }
//     if (fileData.doctorId) {
//       formData.append('doctor_id', fileData.doctorId);
//     }

//     return fetch(`${this.baseURL}/medical-files/upload`, {
//       method: 'POST',
//       headers: {
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: formData,
//     }).then(async res => {
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Upload failed: ${text}`);
//       }
//       return res.json();
//     });
//   }

//   // GET /medical-files/patient/{patient_id} - Get Patient Medical Files
//   async getPatientFiles(patientId, fileType = null) {
//     const params = fileType ? `?file_type=${fileType}` : '';
//     return this.request(`/medical-files/patient/${patientId}${params}`, {
//       method: 'GET',
//     });
//   }

//   // GET /medical-files/{file_id} - Get Single Medical File Metadata
//   async getMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'GET',
//     });
//   }

//   // DELETE /medical-files/{file_id} - Delete Medical File
//   async deleteMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'DELETE',
//     });
//   }

//   // Helper: Download Medical File (returns blob)
//   async downloadMedicalFile(fileId) {
//     const url = `${this.baseURL}/medical-files/${fileId}/download`;
    
//     try {
//       const response = await fetch(url, {
//         headers: {
//           'ngrok-skip-browser-warning': 'true',
//         }
//       });
//       if (!response.ok) {
//         throw new Error(`Download failed: ${response.status}`);
//       }
//       return await response.blob();
//     } catch (error) {
//       console.error('Download Error:', error);
//       throw error;
//     }
//   }

//   // Upload X-ray or Lab Test (legacy - kept for backward compatibility)
//   async uploadFile(file, type) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', type);

//     return fetch(`${this.baseURL}/doctor/upload`, {
//       method: 'POST',
//       headers: {
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: formData,
//     }).then(res => res.json());
//   }

//   // ==================== Appointments APIs ====================
  
//   // PUT /appointments/{appointment_id}/cancel - Cancel Appointment
//   async cancelAppointment(appointmentId) {
//     return this.request(`/appointments/${appointmentId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   // GET /patients/{patient_id}/appointments - Patient Appointments
//   async getPatientAppointments(patientId) {
//     return this.request(`/patients/${patientId}/appointments`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Queue APIs (Patient Side) ====================
  
//   // POST /queue/join - Join Queue
//   async joinQueue(queueData) {
//     return this.request('/queue/join', {
//       method: 'POST',
//       body: JSON.stringify(queueData),
//     });
//   }

//   // GET /queue/status/{queue_id} - Queue Status
//   async getQueueStatus(queueId) {
//     return this.request(`/queue/status/${queueId}`, {
//       method: 'GET',
//     });
//   }

//   // GET /queue/patient/{patient_id}/active - Patient Active Queue
//   async getPatientActiveQueue(patientId) {
//     return this.request(`/queue/patient/${patientId}/active`, {
//       method: 'GET',
//     });
//   }

//   // PUT /queue/{queue_id}/cancel - Cancel Queue
//   async cancelQueue(queueId) {
//     return this.request(`/queue/${queueId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   // GET /queue/notifications/{patient_id} - Patient Notifications
//   async getPatientNotifications(patientId) {
//     return this.request(`/queue/notifications/${patientId}`, {
//       method: 'GET',
//     });
//   }
// }

// export default new DoctorAPI();


// const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// class DoctorAPI {
//   constructor() {
//     this.baseURL = BASE_URL;
//   }

//   // ==================== Helpers ====================

//   getToken() {
//     return localStorage.getItem("token");
//   }

//   getAuthHeaders(extraHeaders = {}) {
//     const token = this.getToken();

//     return {
//       'ngrok-skip-browser-warning': 'true',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...extraHeaders,
//     };
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;

//     const config = {
//       ...options,
//       headers: this.getAuthHeaders({
//         'Content-Type': 'application/json',
//         ...options.headers,
//       }),
//     };

//     try {
//       const response = await fetch(url, config);
//       const contentType = response.headers.get('content-type');

//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;

//         try {
//           if (contentType?.includes('application/json')) {
//             const error = await response.json();
//             errorMessage = error.message || error.detail || errorMessage;
//           } else {
//             const text = await response.text();
//             errorMessage = text || errorMessage;
//           }
//         } catch {}

//         // لو Unauthorized رجعيه login
//         if (response.status === 401) {
//           localStorage.removeItem("token");
//           window.location.href = "/login";
//         }

//         throw new Error(errorMessage);
//       }

//       if (contentType?.includes('application/json')) {
//         return await response.json();
//       }

//       return await response.text();

//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   }

//   // ==================== Doctor APIs ====================

//   getProfile() {
//     return this.request('/doctor/profile', { method: 'GET' });
//   }

//   updateProfile(data) {
//     return this.request('/doctor/profile', {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   updateStatus(data) {
//     return this.request('/doctor/status', {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   getQueue() {
//     return this.request('/doctor/queue', { method: 'GET' });
//   }

//   callNext() {
//     return this.request('/doctor/queue/next', { method: 'POST' });
//   }

//   completeConsultation(queueId, data) {
//     return this.request(`/doctor/queue/${queueId}/complete`, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   markNoShow(queueId) {
//     return this.request(`/doctor/queue/${queueId}/no-show`, {
//       method: 'POST',
//     });
//   }

//   getPatient(patientId) {
//     return this.request(`/doctor/patient/${patientId}`, {
//       method: 'GET',
//     });
//   }

//   addNote(data) {
//     return this.request('/doctor/notes', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   getStats() {
//     return this.request('/doctor/stats', { method: 'GET' });
//   }

//   getMyUploads() {
//     return this.request('/doctor/my-uploads', { method: 'GET' });
//   }

//   // ==================== Medical Files ====================

//   async uploadMedicalFile(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     formData.append('patient_id', fileData.patientId);
//     formData.append('file_type', fileData.fileType);

//     if (fileData.title) formData.append('title', fileData.title);
//     if (fileData.description) formData.append('description', fileData.description);
//     if (fileData.doctorId) formData.append('doctor_id', fileData.doctorId);

//     const response = await fetch(`${this.baseURL}/medical-files/upload`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(), // 👈 مهم
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     return response.json();
//   }

//   async analyzeMedicalImage(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);

//     if (fileData.symptoms) formData.append('symptoms', fileData.symptoms);
//     if (fileData.patientId) formData.append('patient_id', fileData.patientId);

//     const response = await fetch(`${this.baseURL}/medical-files/analyze`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     return response.json();
//   }

//   async downloadMedicalFile(fileId) {
//     const response = await fetch(
//       `${this.baseURL}/medical-files/${fileId}/download`,
//       {
//         headers: this.getAuthHeaders(),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Download failed: ${response.status}`);
//     }

//     return response.blob();
//   }

//   deleteMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'DELETE',
//     });
//   }

//   getPatientFiles(patientId, fileType = null) {
//     const params = fileType ? `?file_type=${fileType}` : '';
//     return this.request(`/medical-files/patient/${patientId}${params}`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Appointments ====================

//   cancelAppointment(id) {
//     return this.request(`/appointments/${id}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   getPatientAppointments(patientId) {
//     return this.request(`/patients/${patientId}/appointments`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Queue (Patient Side) ====================

//   joinQueue(data) {
//     return this.request('/queue/join', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   getQueueStatus(queueId) {
//     return this.request(`/queue/status/${queueId}`, {
//       method: 'GET',
//     });
//   }

//   getPatientActiveQueue(patientId) {
//     return this.request(`/queue/patient/${patientId}/active`, {
//       method: 'GET',
//     });
//   }

//   cancelQueue(queueId) {
//     return this.request(`/queue/${queueId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   getPatientNotifications(patientId) {
//     return this.request(`/queue/notifications/${patientId}`, {
//       method: 'GET',
//     });
//   }
// }

// export default new DoctorAPI();



// const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// class DoctorAPI {
//   constructor() {
//     this.baseURL = BASE_URL;
//   }

//   // ==================== Helpers ====================

//   getToken() {
//     return localStorage.getItem("token");
//   }

//   getAuthHeaders(extraHeaders = {}) {
//     const token = this.getToken();

//     return {
//       'ngrok-skip-browser-warning': 'true',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...extraHeaders,
//     };
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;

//     const config = {
//       ...options,
//       headers: this.getAuthHeaders({
//         'Content-Type': 'application/json',
//         ...options.headers,
//       }),
//     };

//     try {
//       const response = await fetch(url, config);
//       const contentType = response.headers.get('content-type');

//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;

//         try {
//           if (contentType?.includes('application/json')) {
//             const error = await response.json();
//             errorMessage = error.message || error.detail || errorMessage;
//           } else {
//             const text = await response.text();
//             errorMessage = text || errorMessage;
//           }
//         } catch {}

//         // لو Unauthorized رجعيه login
//         if (response.status === 401) {
//           localStorage.removeItem("token");
//           window.location.href = "/login";
//         }

//         throw new Error(errorMessage);
//       }

//       if (contentType?.includes('application/json')) {
//         return await response.json();
//       }

//       return await response.text();

//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   }

//   // ==================== Doctor APIs ====================

//   getProfile() {
//     return this.request('/doctor/profile', { method: 'GET' });
//   }

//   updateProfile(data) {
//     return this.request('/doctor/profile', {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   updateStatus(data) {
//     const statusValue = data.available ? 'available' : 'break';
//     return this.request('/doctor/status', {
//       method: 'PUT',
//       body: JSON.stringify({ status: statusValue }),
//     });
//   }

//   getQueue() {
//     return this.request('/doctor/queue', { method: 'GET' });
//   }

//   callNext() {
//     return this.request('/doctor/queue/next', { method: 'POST' });
//   }

//   completeConsultation(queueId, data) {
//     return this.request(`/doctor/queue/${queueId}/complete`, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   markNoShow(queueId) {
//     return this.request(`/doctor/queue/${queueId}/no-show`, {
//       method: 'POST',
//     });
//   }

//   getPatient(patientId) {
//     return this.request(`/doctor/patient/${patientId}`, {
//       method: 'GET',
//     });
//   }

//   addNote(data) {
//     return this.request('/doctor/notes', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   getStats() {
//     return this.request('/doctor/stats', { method: 'GET' });
//   }

//   getMyUploads() {
//     return this.request('/doctor/my-uploads', { method: 'GET' });
//   }

//   // ==================== Medical Files ====================

//   async uploadMedicalFile(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     formData.append('patient_id', fileData.patientId);
//     formData.append('file_type', fileData.fileType);

//     if (fileData.title) formData.append('title', fileData.title);
//     if (fileData.description) formData.append('description', fileData.description);
//     if (fileData.doctorId) formData.append('doctor_id', fileData.doctorId);

//     const response = await fetch(`${this.baseURL}/medical-files/upload`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(), // 👈 مهم
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     return response.json();
//   }

//   async analyzeMedicalImage(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);

//     if (fileData.symptoms) formData.append('symptoms', fileData.symptoms);
//     if (fileData.patientId) formData.append('patient_id', fileData.patientId);

//     const response = await fetch(`${this.baseURL}/medical-files/analyze`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }

//     return response.json();
//   }

//   async downloadMedicalFile(fileId) {
//     const response = await fetch(
//       `${this.baseURL}/medical-files/${fileId}/download`,
//       {
//         headers: this.getAuthHeaders(),
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Download failed: ${response.status}`);
//     }

//     return response.blob();
//   }

//   deleteMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, {
//       method: 'DELETE',
//     });
//   }

//   getPatientFiles(patientId, fileType = null) {
//     const params = fileType ? `?file_type=${fileType}` : '';
//     return this.request(`/medical-files/patient/${patientId}${params}`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Appointments ====================

//   cancelAppointment(id) {
//     return this.request(`/appointments/${id}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   getPatientAppointments(patientId) {
//     return this.request(`/patients/${patientId}/appointments`, {
//       method: 'GET',
//     });
//   }

//   // ==================== Queue (Patient Side) ====================

//   joinQueue(data) {
//     return this.request('/queue/join', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   getQueueStatus(queueId) {
//     return this.request(`/queue/status/${queueId}`, {
//       method: 'GET',
//     });
//   }

//   getPatientActiveQueue(patientId) {
//     return this.request(`/queue/patient/${patientId}/active`, {
//       method: 'GET',
//     });
//   }

//   cancelQueue(queueId) {
//     return this.request(`/queue/${queueId}/cancel`, {
//       method: 'PUT',
//     });
//   }

//   getPatientNotifications(patientId) {
//     return this.request(`/queue/notifications/${patientId}`, {
//       method: 'GET',
//     });
//   }
// }

// export default new DoctorAPI();











// const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// class DoctorAPI {
//   constructor() {
//     this.baseURL = BASE_URL;
//   }

//   // ==================== Helpers ====================

//   getToken() {
//     return localStorage.getItem("token");
//   }

//   getAuthHeaders(extraHeaders = {}) {
//     const token = this.getToken();
//     return {
//       'ngrok-skip-browser-warning': 'true',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...extraHeaders,
//     };
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       ...options,
//       headers: this.getAuthHeaders({
//         'Content-Type': 'application/json',
//         ...options.headers,
//       }),
//     };

//     try {
//       const response = await fetch(url, config);
//       const contentType = response.headers.get('content-type');

//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;
//         try {
//           if (contentType?.includes('application/json')) {
//             const error = await response.json();
//             // ✅ FIX: handle nested objects و كل formats ممكنة
//             if (typeof error === 'string') {
//               errorMessage = error;
//             } else if (error.message && typeof error.message === 'string') {
//               errorMessage = error.message;
//             } else if (error.detail && typeof error.detail === 'string') {
//               errorMessage = error.detail;
//             } else {
//               errorMessage = JSON.stringify(error);
//             }
//           } else {
//             const text = await response.text();
//             errorMessage = text || errorMessage;
//           }
//         } catch (parseErr) {
//           console.warn('Could not parse error response:', parseErr);
//         }

//         if (response.status === 401) {
//           localStorage.removeItem("token");
//           window.location.href = "/login";
//         }

//         throw new Error(errorMessage);
//       }

//       if (contentType?.includes('application/json')) {
//         return await response.json();
//       }
//       return await response.text();

//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   }

//   // ==================== Doctor APIs ====================

//   getProfile() {
//     return this.request('/doctor/profile', { method: 'GET' });
//   }

//   updateProfile(data) {
//     return this.request('/doctor/profile', {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }

//   // ✅ الـ API بتتوقع { status: "available" | "break" } بالظبط
//   updateStatus(data) {
//     const statusValue = data.available ? 'available' : 'on_break';
//     return this.request('/doctor/status', {
//       method: 'PUT',
//       body: JSON.stringify({ status: statusValue }),
//     });
//   }

//   getQueue() {
//     return this.request('/doctor/queue', { method: 'GET' });
//   }

//   callNext() {
//     return this.request('/doctor/queue/next', { method: 'POST' });
//   }

//   completeConsultation(queueId, data) {
//     return this.request(`/doctor/queue/${queueId}/complete`, {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   markNoShow(queueId) {
//     return this.request(`/doctor/queue/${queueId}/no-show`, {
//       method: 'POST',
//     });
//   }

//   getPatient(patientId) {
//     return this.request(`/doctor/patient/${patientId}`, {
//       method: 'GET',
//     });
//   }

//   addNote(data) {
//     return this.request('/doctor/notes', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   getStats() {
//     return this.request('/doctor/stats', { method: 'GET' });
//   }

//   getMyUploads() {
//     return this.request('/doctor/my-uploads', { method: 'GET' });
//   }

//   // ==================== Medical Files ====================

//   async uploadMedicalFile(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     formData.append('patient_id', fileData.patientId);
//     formData.append('file_type', fileData.fileType);
//     if (fileData.title) formData.append('title', fileData.title);
//     if (fileData.description) formData.append('description', fileData.description);
//     if (fileData.doctorId) formData.append('doctor_id', fileData.doctorId);

//     const response = await fetch(`${this.baseURL}/medical-files/upload`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }
//     return response.json();
//   }

//   async analyzeMedicalImage(fileData) {
//     const formData = new FormData();
//     formData.append('file', fileData.file);
//     if (fileData.symptoms) formData.append('symptoms', fileData.symptoms);
//     if (fileData.patientId) formData.append('patient_id', fileData.patientId);

//     const response = await fetch(`${this.baseURL}/medical-files/analyze`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }
//     return response.json();
//   }

//   async downloadMedicalFile(fileId) {
//     const response = await fetch(`${this.baseURL}/medical-files/${fileId}/download`, {
//       headers: this.getAuthHeaders(),
//     });
//     if (!response.ok) {
//       throw new Error(`Download failed: ${response.status}`);
//     }
//     return response.blob();
//   }

//   deleteMedicalFile(fileId) {
//     return this.request(`/medical-files/${fileId}`, { method: 'DELETE' });
//   }

//   getPatientFiles(patientId, fileType = null) {
//     const params = fileType ? `?file_type=${fileType}` : '';
//     return this.request(`/medical-files/patient/${patientId}${params}`, { method: 'GET' });
//   }

//   // ==================== Appointments ====================

//   cancelAppointment(id) {
//     return this.request(`/appointments/${id}/cancel`, { method: 'PUT' });
//   }

//   getPatientAppointments(patientId) {
//     return this.request(`/patients/${patientId}/appointments`, { method: 'GET' });
//   }

//   // ==================== Queue (Patient Side) ====================

//   joinQueue(data) {
//     return this.request('/queue/join', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }

//   getQueueStatus(queueId) {
//     return this.request(`/queue/status/${queueId}`, { method: 'GET' });
//   }

//   getPatientActiveQueue(patientId) {
//     return this.request(`/queue/patient/${patientId}/active`, { method: 'GET' });
//   }

//   cancelQueue(queueId) {
//     return this.request(`/queue/${queueId}/cancel`, { method: 'PUT' });
//   }

//   getPatientNotifications(patientId) {
//     return this.request(`/queue/notifications/${patientId}`, { method: 'GET' });
//   }
// }

// export default new DoctorAPI();








const BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

class DoctorAPI {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // ==================== Helpers ====================

  getToken() {
    return localStorage.getItem("token");
  }

  getAuthHeaders(extraHeaders = {}) {
    const token = this.getToken();
    return {
      'ngrok-skip-browser-warning': 'true',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...extraHeaders,
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getAuthHeaders({
        'Content-Type': 'application/json',
        ...options.headers,
      }),
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          if (contentType?.includes('application/json')) {
            const error = await response.json();
            // ✅ FIX: handle nested objects و كل formats ممكنة
            if (typeof error === 'string') {
              errorMessage = error;
            } else if (error.message && typeof error.message === 'string') {
              errorMessage = error.message;
            } else if (error.detail && typeof error.detail === 'string') {
              errorMessage = error.detail;
            } else {
              errorMessage = JSON.stringify(error);
            }
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (parseErr) {
          console.warn('Could not parse error response:', parseErr);
        }

        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        throw new Error(errorMessage);
      }

      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      return await response.text();

    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ==================== Doctor APIs ====================

  getProfile() {
    return this.request('/doctor/profile', { method: 'GET' });
  }

  updateProfile(data) {
    return this.request('/doctor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ✅ الـ API بتتوقع { status: "available" | "break" } بالظبط
  updateStatus(data) {
    const statusValue = data.available ? 'available' : 'on_break';
    return this.request('/doctor/status', {
      method: 'PUT',
      body: JSON.stringify({ status: statusValue }),
    });
  }

  getQueue() {
    return this.request('/doctor/queue', { method: 'GET' });
  }

  callNext() {
    return this.request('/doctor/queue/next', { method: 'POST' });
  }

  completeConsultation(queueId, data) {
    return this.request(`/doctor/queue/${queueId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  markNoShow(queueId) {
    return this.request(`/doctor/queue/${queueId}/no-show`, {
      method: 'POST',
    });
  }

  getPatient(patientId) {
    return this.request(`/doctor/patient/${patientId}`, {
      method: 'GET',
    });
  }

  addNote(data) {
    return this.request('/doctor/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getStats() {
    return this.request('/doctor/stats', { method: 'GET' });
  }

  getMyUploads() {
    return this.request('/doctor/my-uploads', { method: 'GET' });
  }

  // ==================== Medical Files ====================

  async uploadMedicalFile(fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('patient_id', fileData.patientId);
    formData.append('file_type', fileData.fileType);
    if (fileData.title) formData.append('title', fileData.title);
    if (fileData.description) formData.append('description', fileData.description);
    if (fileData.doctorId) formData.append('doctor_id', fileData.doctorId);

    const response = await fetch(`${this.baseURL}/medical-files/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async analyzeMedicalImage(fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    if (fileData.symptoms) formData.append('symptoms', fileData.symptoms);
    if (fileData.patientId) formData.append('patient_id', fileData.patientId);

    const response = await fetch(`${this.baseURL}/medical-files/analyze`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();

    // لو الـ backend رجع success: false، استخدم الـ suggested_title كـ fallback
    if (!result.success) {
      console.warn('⚠️ AI analysis returned success:false:', result.error);
      // رجّع الـ result زي ما هو، الـ Dashboard هيتعامل معاه
      return result;
    }

    return result;
  }

  async downloadMedicalFile(fileId) {
    const response = await fetch(`${this.baseURL}/medical-files/${fileId}/download`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    return response.blob();
  }

  deleteMedicalFile(fileId) {
    return this.request(`/medical-files/${fileId}`, { method: 'DELETE' });
  }

  getPatientFiles(patientId, fileType = null) {
    const params = fileType ? `?file_type=${fileType}` : '';
    return this.request(`/medical-files/patient/${patientId}${params}`, { method: 'GET' });
  }

  // ==================== Appointments ====================

  cancelAppointment(id) {
    return this.request(`/appointments/${id}/cancel`, { method: 'PUT' });
  }

  getPatientAppointments(patientId) {
    return this.request(`/patients/${patientId}/appointments`, { method: 'GET' });
  }

  // ==================== Queue (Patient Side) ====================

  joinQueue(data) {
    return this.request('/queue/join', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getQueueStatus(queueId) {
    return this.request(`/queue/status/${queueId}`, { method: 'GET' });
  }

  getPatientActiveQueue(patientId) {
    return this.request(`/queue/patient/${patientId}/active`, { method: 'GET' });
  }

  cancelQueue(queueId) {
    return this.request(`/queue/${queueId}/cancel`, { method: 'PUT' });
  }

  getPatientNotifications(patientId) {
    return this.request(`/queue/notifications/${patientId}`, { method: 'GET' });
  }
}

export default new DoctorAPI();