import React, { useEffect, useState } from 'react';

/**
 * مكون الإشعارات للحجز - يظهر عند الحجز مع طبيب
 */
export default function BookingNotification({ data, onClose }) {
  const [countdown, setCountdown] = useState(5);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation entrance
    setTimeout(() => setIsVisible(true), 100);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (data.type === 'available') {
    // الطبيب متاح الآن
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border-2 border-green-200 transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                ⭐
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-green-800 mb-3">
              🎉 الطبيب متاح الآن!
            </h2>
            <p className="text-xl text-gray-700 mb-2" dir="rtl">
              <strong className="text-green-700">د. {data.doctor.name}</strong> في انتظارك
            </p>
            <p className="text-gray-600" dir="rtl">
              التخصص: {data.doctor.specialty_ar || data.doctor.specialty}
            </p>
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-inner" dir="rtl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              توجه إلى:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                <span className="text-3xl">🏢</span>
                <div>
                  <p className="text-sm text-gray-500">الطابق</p>
                  <p className="text-lg font-bold text-blue-700">{data.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                <span className="text-3xl">🚪</span>
                <div>
                  <p className="text-sm text-gray-500">رقم الغرفة</p>
                  <p className="text-lg font-bold text-purple-700">{data.room}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                <path strokeLinecap="round" strokeWidth="4" d="M4 12a8 8 0 018-8" className="opacity-75" />
              </svg>
              <span className="font-semibold">
                الانتقال خلال {countdown} ثوانٍ...
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (data.type === 'queue') {
    // الطبيب مشغول - إضافة للقائمة
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border-2 border-orange-200 transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          {/* Queue Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                #{data.queuePosition}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-orange-800 mb-3">
              تم إضافتك للقائمة 📋
            </h2>
            <p className="text-xl text-gray-700 mb-2" dir="rtl">
              <strong className="text-orange-700">د. {data.doctor.name}</strong> مشغول حالياً
            </p>
            <p className="text-gray-600" dir="rtl">
              {data.doctor.specialty_ar || data.doctor.specialty}
            </p>
          </div>

          {/* Queue Info */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-inner" dir="rtl">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  #{data.queuePosition}
                </div>
                <p className="text-sm text-gray-600">ترتيبك في القائمة</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">
                  ~{data.estimatedWait}
                </div>
                <p className="text-sm text-gray-600">دقيقة (تقديرياً)</p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg mb-6" dir="rtl">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                سيتم إعلامك عندما يحين دورك. يمكنك متابعة حالة الانتظار في الصفحة التالية.
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-3 rounded-full shadow-lg">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                <path strokeLinecap="round" strokeWidth="4" d="M4 12a8 8 0 018-8" className="opacity-75" />
              </svg>
              <span className="font-semibold">
                الانتقال لصفحة الانتظار خلال {countdown} ثوانٍ...
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return null;
}