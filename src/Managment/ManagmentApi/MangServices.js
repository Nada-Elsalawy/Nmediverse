// import axios from 'axios';

// // Base URL
// const API_BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'ngrok-skip-browser-warning': 'true',  // ✅ Fix: Skip ngrok warning page
//   },
// });

// // Add token to requests automatically
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle token expiration
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token expired, try to refresh
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (refreshToken) {
//         try {
//           const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//             refresh_token: refreshToken,
//           }, {
//             headers: {
//               'ngrok-skip-browser-warning': 'true',  // ✅ Fix: also on refresh call
//             },
//           });
//           const { access_token } = response.data;
//           localStorage.setItem('access_token', access_token);
          
//           // Retry original request
//           error.config.headers.Authorization = `Bearer ${access_token}`;
//           return axios(error.config);
//         } catch (refreshError) {
//           // Refresh failed, logout
//           localStorage.clear();
//           window.location.href = '/login';
//         }
//       } else {
//         localStorage.clear();
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ==================== AUTHENTICATION ====================

// export const managerLogin = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/auth/manager/login`, {
//       email,
//       password,
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',  // ✅ Fix: also on login call
//       },
//     });
    
//     const { access_token, refresh_token, user } = response.data;
    
//     // Store tokens
//     localStorage.setItem('access_token', access_token);
//     localStorage.setItem('refresh_token', refresh_token);
//     localStorage.setItem('user', JSON.stringify(user));
    
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

// export const logout = () => {
//   localStorage.clear();
//   window.location.href = '/login';
// };

// // ==================== DASHBOARD ====================

// export const getDashboardOverview = async () => {
//   try {
//     const response = await apiClient.get('/manager/dashboard');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dashboard:', error);
//     throw error;
//   }
// };

// export const getDailyReport = async (date) => {
//   try {
//     const response = await apiClient.get('/manager/reports/daily', {
//       params: { date },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching daily report:', error);
//     throw error;
//   }
// };

// export const getLiveQueue = async () => {
//   try {
//     const response = await apiClient.get('/manager/queue/live');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching live queue:', error);
//     throw error;
//   }
// };

// // ==================== DOCTORS ====================

// export const getAllDoctors = async () => {
//   try {
//     const response = await apiClient.get('/manager/doctors');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching doctors:', error);
//     throw error;
//   }
// };

// export const createDoctor = async (doctorData) => {
//   try {
//     const response = await apiClient.post('/manager/doctors', doctorData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating doctor:', error);
//     throw error;
//   }
// };

// export const updateDoctor = async (doctorId, doctorData) => {
//   try {
//     const response = await apiClient.put(`/manager/doctors/${doctorId}`, doctorData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating doctor:', error);
//     throw error;
//   }
// };

// export const toggleDoctorActivation = async (doctorId, active = true) => {
//   try {
//     const response = await apiClient.put(`/manager/doctors/${doctorId}/activate`, null, {
//       params: { active },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error toggling doctor activation:', error);
//     throw error;
//   }
// };

// // ==================== PATIENTS ====================

// export const getAllPatients = async (page = 1, size = 20, search = '') => {
//   try {
//     const response = await apiClient.get('/manager/patients', {
//       params: { page, size, search },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching patients:', error);
//     throw error;
//   }
// };

// // ==================== HELPER FUNCTIONS ====================

// export const isAuthenticated = () => {
//   return !!localStorage.getItem('access_token');
// };

// export const getUser = () => {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };
import axios from 'axios';

const API_BASE_URL = 'https://subrhombical-akilah-interproglottidal.ngrok-free.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          }, {
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const { access_token } = response.data;
          localStorage.setItem('token', access_token);
          
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return axios(error.config);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const managerLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/manager/login`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    const { access_token, refresh_token, user } = response.data;
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

export const getDashboardOverview = async () => {
  try {
    const response = await apiClient.get('/manager/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};

export const getDailyReport = async (date) => {
  try {
    const response = await apiClient.get('/manager/reports/daily', {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily report:', error);
    throw error;
  }
};

export const getLiveQueue = async () => {
  try {
    const response = await apiClient.get('/manager/queue/live');
    return response.data;
  } catch (error) {
    console.error('Error fetching live queue:', error);
    throw error;
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await apiClient.get('/manager/doctors');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const createDoctor = async (doctorData) => {
  try {
    const response = await apiClient.post('/manager/doctors', doctorData);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (doctorId, doctorData) => {
  try {
    const response = await apiClient.put(`/manager/doctors/${doctorId}`, doctorData);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

export const toggleDoctorActivation = async (doctorId, active = true) => {
  try {
    const response = await apiClient.put(`/manager/doctors/${doctorId}/activate`, null, {
      params: { active },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling doctor activation:', error);
    throw error;
  }
};

export const getAllPatients = async (page = 1, size = 20, search = '') => {
  try {
    const response = await apiClient.get('/manager/patients', {
      params: { page, size, search },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
