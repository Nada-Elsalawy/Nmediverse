
// import React, { useState, useContext, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CameraContext } from "../../Contexts/CameraContext";

// async function blobFromDataUrlUpscaled(dataUrl, minLongestEdge = 800) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => {
//       try {
//         const iw = img.width;
//         const ih = img.height;
//         const longest = Math.max(iw, ih);
//         const scale = longest < minLongestEdge ? minLongestEdge / longest : 1;
//         const cw = Math.round(iw * scale);
//         const ch = Math.round(ih * scale);
//         const canvas = document.createElement("canvas");
//         canvas.width = cw;
//         canvas.height = ch;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, cw, ch);
//         canvas.toBlob((blob) => {
//           if (!blob) return reject(new Error("Failed to create blob"));
//           resolve(blob);
//         }, "image/jpeg", 0.92);
//       } catch (err) {
//         reject(err);
//       }
//     };
//     img.onerror = () => reject(new Error("Failed to load image for upscaling"));
//     img.src = dataUrl;
//   });
// }

// export default function FormPage() {
//   const { capturedImage: contextImage } = useContext(CameraContext);
//   const navigate = useNavigate();

//   const [capturedImage, setCapturedImage] = useState(() => {
//     const storedImage = localStorage.getItem("capturedFaceImage");
//     return storedImage || contextImage || null;
//   });

//   useEffect(() => {
//     if (contextImage) setCapturedImage(contextImage);
//   }, [contextImage]);

//   const [schemaError, setSchemaError] = useState(null);

//   const schema = useMemo(() => {
//     try {
//       const nameAndJobRegex = /^[A-Za-z\u0621-\u064A\s]+$/;

//       return z.object({
//         fullname: z
//           .string()
//           .min(3, "Full name must be at least 3 characters")
//           .regex(nameAndJobRegex, "Full name must contain letters only"),
//         nationalId: z.string().regex(/^\d{14}$/, "National ID must be 14 digits"),
//         Gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Please select gender" }) }),
//         dateOfBirth: z.string().min(1, "Date of birth is required"),
//         materialStatus: z.string().optional(),
//         job: z
//           .string()
//           .optional()
//           .refine((v) => !v || nameAndJobRegex.test(v), "Job must contain letters only"),
//         Weight: z.coerce.number().optional(),
//         height: z.coerce.number().optional(),
//         BMI: z.coerce.number().optional(),
//         address: z.string().optional(),
//         bloodType: z.string().optional(),
//         phone: z.string().optional().refine((v) => !v || /^01[0-9]{9}$/.test(v), "Phone must be a valid Egyptian number"),
//         chronic: z.string().optional(),
//         allergies: z.string().optional(),
//         medication: z.string().optional(),
//       });
//     } catch (err) {
//       console.error("Schema build error", err);
//       setSchemaError(err.message || String(err));
//       return null;
//     }
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     setFocus,
//     setValue,
//     watch,
//   } = useForm({
//     resolver: schema ? zodResolver(schema) : undefined,
//     mode: "onSubmit",
//     defaultValues: { Gender: "male" },
//   });

//   const watchedWeight = watch("Weight");
//   const watchedHeight = watch("height");

//   useEffect(() => {
//     const w = typeof watchedWeight === "number" ? watchedWeight : Number(watchedWeight);
//     const h = typeof watchedHeight === "number" ? watchedHeight : Number(watchedHeight);
//     if (Number.isFinite(w) && Number.isFinite(h) && h > 0) {
//       const hm = h / 100;
//       const bmi = +(w / (hm * hm));
//       if (Number.isFinite(bmi)) {
//         const rounded = Math.round(bmi * 100) / 100;
//         setValue("BMI", rounded, { shouldDirty: true, shouldValidate: true });
//         return;
//       }
//     }
//     setValue("BMI", undefined, { shouldDirty: true, shouldValidate: false });
//   }, [watchedWeight, watchedHeight, setValue]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [fieldErrorsList, setFieldErrorsList] = useState([]);

//   const showServerError = (respData) => {
//     if (!respData) return "Unknown server error";
//     if (Array.isArray(respData.detail)) {
//       return respData.detail.map((d) => d.msg || JSON.stringify(d)).join("\n");
//     }
//     if (typeof respData.detail === "string") return respData.detail;
//     if (typeof respData.message === "string") return respData.message;
//     return JSON.stringify(respData);
//   };

//   const onSubmit = async (formValues) => {
//     setSuccessMsg("");
//     setErrorMsg("");
//     setFieldErrorsList([]);
//     setIsLoading(true);

//     try {
//       if (!formValues.nationalId && !capturedImage) {
//         const msg = "You must enter your national ID OR take a photo.";
//         setErrorMsg(msg);
//         setIsLoading(false);
//         return;
//       }

//       let gender = formValues.Gender;
//       if (gender === "Male") gender = "male";
//       if (gender === "Female") gender = "female";

//       if (!formValues.dateOfBirth) {
//         const msg = "Date of birth is required.";
//         setErrorMsg(msg);
//         setIsLoading(false);
//         return;
//       }

//       let file = null;
//       if (capturedImage) {
//         const blob = await blobFromDataUrlUpscaled(capturedImage, 800);
//         file = new File([blob], "patient.jpg", { type: blob.type || "image/jpeg" });
//       }

//       const weightNumber = typeof formValues.Weight === "number" ? formValues.Weight : undefined;
//       const heightCm = typeof formValues.height === "number" ? formValues.height : undefined;
//       const heightM = heightCm ? heightCm / 100 : undefined;
//       const bmi =
//         Number.isFinite(weightNumber) && Number.isFinite(heightM) && heightM > 0
//           ? +(weightNumber / (heightM * heightM)).toFixed(2)
//           : undefined;

//       const payload = {
//         full_name: formValues.fullname,
//         national_id: formValues.nationalId,
//         gender: gender,
//         date_of_birth: formValues.dateOfBirth,
//         phone_number: formValues.phone || "",
//         address: formValues.address || "",
//         blood_type: formValues.bloodType || "",
//         chronic_diseases: formValues.chronic || "",
//         allergies: formValues.allergies || "",
//         current_medications: formValues.medication || "",
//         marital_status: formValues.materialStatus || "",
//         job: formValues.job || "",
//         weight: weightNumber,
//         height: heightCm,
//         BMI: bmi,
//       };

//       const formData = new FormData();
//       if (file) formData.append("image", file);
//       formData.append("data", JSON.stringify(payload));

//       for (let pair of formData.entries()) {
//         console.log("[FORM DEBUG] key:", pair[0], "len:", pair[1]?.size ?? String(pair[1]).length);
//       }

//       const res = await axios.post("http://127.0.0.1:8004/register-patient", formData, {
//         onUploadProgress: (progressEvent) => {
//           if (progressEvent.total) {
//             const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             console.log("upload percent", percent);
//           }
//         },
//         timeout: 120000,
//       });

//       console.log("API response:", res?.data);
      
//       if (res && res.data) {
       
//         const patientData = {
//           ...payload,
//           patient_id: res.data.patient_id,
//           image: capturedImage // 
//         };
        
       
//         localStorage.setItem("patient", JSON.stringify(patientData));
        
//         // 
//         localStorage.removeItem("capturedFaceImage");
        
//         setSuccessMsg("✔ Form submitted successfully!");
        
//         // ✅ 
//         navigate("/patient-Details", { replace: true });
        
//         reset();
//         setCapturedImage(null);
//         setFieldErrorsList([]);
//       } else {
//         setErrorMsg("Unexpected API response.");
//       }
//     } catch (error) {
//       if (error.response) {
//         const serverMessage = showServerError(error.response.data);
//         setErrorMsg(`Server: ${serverMessage}`);
//         console.error("Server response", error.response.status, error.response.data);
//       } else if (error.request) {
//         setErrorMsg("No response from server. Check network or server.");
//       } else {
//         setErrorMsg(`Client error: ${error.message}`);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onError = (formErrors) => {
//     const list = Object.entries(formErrors).map(([key, err]) => {
//       return { field: key, message: err.message || JSON.stringify(err) };
//     });
//     setFieldErrorsList(list);
//     setErrorMsg("❌ Validation failed. Check required fields.");
//     if (list.length > 0) {
//       try {
//         setFocus(list[0].field);
//       } catch (e) {
//         console.warn("setFocus failed", e);
//       }
//     }
//     console.log("validation errors:", formErrors);
//   };

//   if (schemaError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#a9d3f2]">
//         <div className="max-w-lg p-6 bg-white rounded shadow">
//           <h3 className="text-lg font-bold mb-2">Error initializing form</h3>
//           <p className="text-sm text-red-700 mb-3">{schemaError}</p>
//           <p className="text-sm text-gray-700">Open DevTools console for more details.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-start bg-[#a9d3f2] font-[Poppins] py-8">
//       <div className="w-full max-w-4xl px-6">
//         <div className="flex items-center justify-between gap-6 mb-6">
//           <div className="flex-1">
//             <h2 className="text-[#003366] text-3xl mb-1 font-bold">Welcome To MediVerse Hospital</h2>
//             <p className="text-[white] text-xlg mb-1">Please fill in your information below to complete your registration.</p>
//           </div>
//           <div className="flex items-center gap-4">
//             {capturedImage ? (
//               <img src={capturedImage} alt="Patient" className="w-28 h-28 rounded-lg shadow-lg object-cover border-2 border-white" />
//             ) : (
//               <div className="w-28 h-28 bg-white/60 rounded-lg flex items-center justify-center text-gray-700 text-xs">No Image</div>
//             )}
//           </div>
//         </div>

//         {successMsg && <div className="bg-green-200 text-green-800 px-3 py-2 rounded mb-3">{successMsg}</div>}
//         {errorMsg && <div className="bg-red-200 text-red-800 px-3 py-2 rounded mb-3 whitespace-pre-wrap">{errorMsg}</div>}

//         {fieldErrorsList.length > 0 && (
//           <div className="mb-3 bg-pink-50 border border-pink-200 p-3 rounded">
//             <strong className="text-sm text-pink-700">Form Errors:</strong>
//             <ul className="mt-2 text-sm text-pink-700 list-disc list-inside">
//               {fieldErrorsList.map((e) => (
//                 <li key={e.field}>
//                   <span className="font-medium">{e.field}:</span> {e.message}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit, onError)} className="bg-white/40 p-4 rounded-lg shadow-sm">
//           <div className="space-y-3">
//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">full name</label>
//               <input type="text" {...register("fullname")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//             </div>
//             {errors.fullname && <div className="text-red-700 text-xs">{errors.fullname.message}</div>}

//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">National id</label>
//               <input type="text" {...register("nationalId")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" placeholder="14 digits" />
//             </div>
//             {errors.nationalId && <div className="text-red-700 text-xs">{errors.nationalId.message}</div>}

//             <div className="flex gap-4">
//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[195px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Weight</label>
//                 <input type="number" step="0.1" {...register("Weight", { valueAsNumber: true })} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//               </div>

//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[180px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">height</label>
//                 <input type="number" step="0.1" {...register("height", { valueAsNumber: true })} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//               </div>
//             </div>
//             {(errors.Weight || errors.height) && <div className="text-red-700 text-xs">{errors.Weight?.message || errors.height?.message}</div>}

//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">BMI</label>
//               <input type="number" step="0.01" {...register("BMI", { valueAsNumber: true })} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//             </div>
//             {errors.BMI && <div className="text-red-700 text-xs">{errors.BMI.message}</div>}

//             <div className="flex gap-4">
//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[190px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Gender</label>
//                 <select {...register("Gender")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded">
//                   <option value="">Select</option>
//                   <option value="male">male</option>
//                   <option value="female">female</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[195px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Date of Birth</label>
//                 <input type="date" {...register("dateOfBirth")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//               </div>
//             </div>
//             {errors.dateOfBirth && <div className="text-red-700 text-xs">{errors.dateOfBirth.message}</div>}

//             <div className="flex gap-4">
//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[190px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Material Status</label>
//                 <select {...register("materialStatus")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded">
//                   <option value="">Select</option>
//                   <option>Single</option>
//                   <option>Married</option>
//                   <option>Divorced</option>
//                   <option>Widowed</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[180px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Job</label>
//                 <input type="text" {...register("job")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Address</label>
//               <input type="text" {...register("address")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//             </div>

//             <div className="flex gap-4">
//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[195px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Blood Type</label>
//                 <select {...register("bloodType")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded">
//                   <option value="">Select</option>
//                   <option>A+</option>
//                   <option>A-</option>
//                   <option>B+</option>
//                   <option>B-</option>
//                   <option>AB+</option>
//                   <option>AB-</option>
//                   <option>O+</option>
//                   <option>O-</option>
//                 </select>
//               </div>

//               <div className="flex items-center gap-4 w-1/2">
//                 <label className="w-[190px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Phone Number</label>
//                 <input type="text" {...register("phone")} className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Chronic Diseases</label>
//               <input type="text" {...register("chronic")} placeholder="Diabetes|High blood pressure" className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Allergies</label>
//               <input type="text" {...register("allergies")} placeholder="Dust|pollen|peanuts" className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//             </div>

//             <div className="flex items-center gap-4">
//               <label className="w-[140px] bg-[#5ea0dd] text-white px-3 py-2 border border-black/40 text-sm font-medium text-left">Current Medication</label>
//               <input type="text" {...register("medication")} placeholder="Panadol|Hibiotec|Augmantin" className="flex-1 border border-black/30 text-sm px-3 py-2 outline-none bg-white rounded" />
//             </div>

//             <div className="flex justify-center gap-10 mt-4">
//               <button type="submit" disabled={isSubmitting} className="bg-[#1a4b82] text-white font-bold px-8 py-3 rounded-md shadow-md hover:opacity-90 disabled:bg-gray-400">
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>

//               <button type="button" onClick={() => { reset(); setCapturedImage(null); localStorage.removeItem("capturedFaceImage"); setErrorMsg(""); setSuccessMsg(""); setFieldErrorsList([]); }} className="bg-white text-[#1a4b82] font-bold px-8 py-2 rounded-md shadow-md hover:opacity-90">
//                 Clear Form
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraContext } from "../../Contexts/CameraContext";

async function blobFromDataUrlUpscaled(dataUrl, minLongestEdge = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const iw = img.width;
        const ih = img.height;
        const longest = Math.max(iw, ih);
        const scale = longest < minLongestEdge ? minLongestEdge / longest : 1;
        const cw = Math.round(iw * scale);
        const ch = Math.round(ih * scale);
        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, cw, ch);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Failed to create blob"));
          resolve(blob);
        }, "image/jpeg", 0.92);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for upscaling"));
    img.src = dataUrl;
  });
}

export default function FormPage() {
  const { capturedImage: contextImage } = useContext(CameraContext);
  const navigate = useNavigate();

  const [capturedImage, setCapturedImage] = useState(() => {
    const storedImage = localStorage.getItem("capturedFaceImage");
    return storedImage || contextImage || null;
  });

  useEffect(() => {
    if (contextImage) setCapturedImage(contextImage);
  }, [contextImage]);

  const [schemaError, setSchemaError] = useState(null);

  const schema = useMemo(() => {
    try {
      const nameAndJobRegex = /^[A-Za-z\u0621-\u064A\s]+$/;

      return z.object({
        fullname: z
          .string()
          .min(3, "Full name must be at least 3 characters")
          .regex(nameAndJobRegex, "Full name must contain letters only"),
        nationalId: z.string().regex(/^\d{14}$/, "National ID must be 14 digits"),
        Gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Please select gender" }) }),
        dateOfBirth: z.string().min(1, "Date of birth is required"),
        materialStatus: z.string().optional(),
        job: z
          .string()
          .optional()
          .refine((v) => !v || nameAndJobRegex.test(v), "Job must contain letters only"),
        Weight: z.coerce.number().optional(),
        height: z.coerce.number().optional(),
        BMI: z.coerce.number().optional(),
        address: z.string().optional(),
        bloodType: z.string().optional(),
        phone: z.string().optional().refine((v) => !v || /^01[0-9]{9}$/.test(v), "Phone must be a valid Egyptian number"),
        chronic: z.string().optional(),
        allergies: z.string().optional(),
        medication: z.string().optional(),
      });
    } catch (err) {
      console.error("Schema build error", err);
      setSchemaError(err.message || String(err));
      return null;
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
    setValue,
    watch,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: "onSubmit",
    defaultValues: { Gender: "male" },
  });

  const watchedWeight = watch("Weight");
  const watchedHeight = watch("height");

  useEffect(() => {
    const w = typeof watchedWeight === "number" ? watchedWeight : Number(watchedWeight);
    const h = typeof watchedHeight === "number" ? watchedHeight : Number(watchedHeight);
    if (Number.isFinite(w) && Number.isFinite(h) && h > 0) {
      const hm = h / 100;
      const bmi = +(w / (hm * hm));
      if (Number.isFinite(bmi)) {
        const rounded = Math.round(bmi * 100) / 100;
        setValue("BMI", rounded, { shouldDirty: true, shouldValidate: true });
        return;
      }
    }
    setValue("BMI", undefined, { shouldDirty: true, shouldValidate: false });
  }, [watchedWeight, watchedHeight, setValue]);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrorsList, setFieldErrorsList] = useState([]);

  const showServerError = (respData) => {
    if (!respData) return "Unknown server error";
    if (Array.isArray(respData.detail)) {
      return respData.detail.map((d) => d.msg || JSON.stringify(d)).join("\n");
    }
    if (typeof respData.detail === "string") return respData.detail;
    if (typeof respData.message === "string") return respData.message;
    return JSON.stringify(respData);
  };

  const onSubmit = async (formValues) => {
    setSuccessMsg("");
    setErrorMsg("");
    setFieldErrorsList([]);
    setIsLoading(true);

    try {
      if (!formValues.nationalId && !capturedImage) {
        const msg = "You must enter your national ID OR take a photo.";
        setErrorMsg(msg);
        setIsLoading(false);
        return;
      }

      let gender = formValues.Gender;
      if (gender === "Male") gender = "male";
      if (gender === "Female") gender = "female";

      if (!formValues.dateOfBirth) {
        const msg = "Date of birth is required.";
        setErrorMsg(msg);
        setIsLoading(false);
        return;
      }

      let file = null;
      if (capturedImage) {
        const blob = await blobFromDataUrlUpscaled(capturedImage, 800);
        file = new File([blob], "patient.jpg", { type: blob.type || "image/jpeg" });
      }

      const formData = new FormData();
      formData.append("full_name", formValues.fullname || "");
      formData.append("national_id", formValues.nationalId || "");
      formData.append("gender", gender || "");
      formData.append("date_of_birth", formValues.dateOfBirth || "");
      formData.append("marital_status", formValues.materialStatus || "");
      formData.append("job", formValues.job || "");
      formData.append("weight", formValues.Weight || "");
      formData.append("height", formValues.height || "");
      formData.append("bmi", formValues.BMI || "");
      formData.append("address", formValues.address || "");
      formData.append("blood_type", formValues.bloodType || "");
      formData.append("phone_number", formValues.phone || "");
      formData.append("chronic_diseases", formValues.chronic || "");
      formData.append("allergies", formValues.allergies || "");
      formData.append("current_medications", formValues.medication || "");
      if (file) formData.append("image", file);

      const res = await axios.post("http://127.0.0.1:8000/patients/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Patient registered successfully!");
      const patientData = res.data;
      localStorage.setItem("patient", JSON.stringify(patientData));
      localStorage.removeItem("capturedFaceImage");

      setTimeout(() => {
        navigate("/patient-Details", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Axios error:", err);
      if (err.response?.status === 422) {
        if (Array.isArray(err.response.data?.detail)) {
          const mapped = err.response.data.detail.map((d) => {
            const loc = Array.isArray(d.loc) ? d.loc.join(" → ") : String(d.loc || "");
            return { field: loc, message: d.msg || "" };
          });
          setFieldErrorsList(mapped);
        } else {
          const errText = showServerError(err.response.data);
          setErrorMsg(errText);
        }
      } else {
        const errText = err.response?.data ? showServerError(err.response.data) : err.message || "Network error";
        setErrorMsg(errText);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (reactHookFormErrors) => {
    console.log("onError →", reactHookFormErrors);
  };

  if (schemaError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-red-50 p-4">
        <div className="max-w-md text-center">
          <p className="text-red-700 font-bold mb-2">Schema Build Error</p>
          <p className="text-red-600 mb-3">{schemaError}</p>
          <p className="text-sm text-gray-700">Open DevTools console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-[#a9d3f2] font-[Poppins] py-8 max-sm:py-2">
      <div className="w-full max-w-4xl px-6 max-sm:px-2">
        <div className="flex max-sm:flex-col items-center max-sm:items-center justify-between gap-6 max-sm:gap-2 mb-6 max-sm:mb-3">
          <div className="flex-1 max-sm:text-center">
            <h2 className="text-[#003366] text-3xl max-sm:text-base mb-1 font-bold">Welcome To MediVerse Hospital</h2>
            <p className="text-[white] text-xl max-sm:text-[15px] mb-1">Please fill in your information below to complete your registration.</p>
          </div>
          <div className="flex items-center gap-4">
            {capturedImage ? (
              <img src={capturedImage} alt="Patient" className="w-28 h-28 max-sm:w-16 max-sm:h-16 rounded-lg shadow-lg object-cover border-2 border-white" />
            ) : (
              <div className="w-28 h-28 max-sm:w-16 max-sm:h-16 bg-white/60 rounded-lg flex items-center justify-center text-gray-700 text-xs max-sm:text-[9px]">No Image</div>
            )}
          </div>
        </div>

        {successMsg && <div className="bg-green-200 text-green-800 px-3 py-2 rounded mb-3 max-sm:text-xs">{successMsg}</div>}
        {errorMsg && <div className="bg-red-200 text-red-800 px-3 py-2 rounded mb-3 whitespace-pre-wrap max-sm:text-xs">{errorMsg}</div>}

        {fieldErrorsList.length > 0 && (
          <div className="mb-3 bg-pink-50 border border-pink-200 p-3 max-sm:p-2 rounded">
            <strong className="text-sm max-sm:text-xs text-pink-700">Form Errors:</strong>
            <ul className="mt-2 text-sm max-sm:text-xs text-pink-700 list-disc list-inside">
              {fieldErrorsList.map((e) => (
                <li key={e.field}>
                  <span className="font-medium">{e.field}:</span> {e.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit, onError)} className="bg-white/40 p-4 max-sm:p-2 rounded-lg shadow-sm">
          <div className="space-y-3 max-sm:space-y-1.5">
            
            {/* Full Name */}
            <div className="flex items-center gap-4 max-sm:gap-1.5">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-2 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">full name</label>
              <input type="text" {...register("fullname")} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
            </div>
            {errors.fullname && <div className="text-red-700 text-xs">{errors.fullname.message}</div>}

            {/* National ID */}
            <div className="flex items-center gap-4 max-sm:gap-1.5">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-2 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">National id</label>
              <input type="text" {...register("nationalId")} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" placeholder="14 digits" />
            </div>
            {errors.nationalId && <div className="text-red-700 text-xs">{errors.nationalId.message}</div>}

            {/* Weight & Height */}
            <div className="flex gap-4 max-sm:gap-4">
              <div className="flex items-center gap-4 max-sm:gap-1.5 w-1/2">
                <label className="w-[195px] max-sm:w-16 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">Weight</label>
                <input type="number" step="0.1" {...register("Weight", { valueAsNumber: true })} className="max-sm:w-16 flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
              </div>
              <div className="flex items-center gap-4 max-sm:gap-2 w-1/2">
                <label className="w-[180px] max-sm:w-16 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">height</label>
                <input type="number" step="0.1" {...register("height", { valueAsNumber: true })} className="flex-1 border max-sm:w-1/2 border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
              </div>
            </div>
            {(errors.Weight || errors.height) && <div className="text-red-700 text-xs">{errors.Weight?.message || errors.height?.message}</div>}

            {/* BMI */}
            <div className="flex items-center gap-4 max-sm:gap-1.5">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-2 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">BMI</label>
              <input type="number" step="0.01" {...register("BMI", { valueAsNumber: true })} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
            </div>
            {errors.BMI && <div className="text-red-700 text-xs">{errors.BMI.message}</div>}

            {/* Gender & Date of Birth */}
            <div className="flex gap-4 max-sm:gap-1.5">
              <div className="flex items-center gap-4 max-sm:gap-1.5 w-1/2">
                <label className="w-[190px] max-sm:w-16 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">Gender</label>
                <select {...register("Gender")} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 outline-none bg-white rounded">
                  <option value="">Select</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </div>
              <div className="flex items-center gap-4 max-sm:gap-1 w-1/2">
                <label className="w-[195px] max-sm:w-20 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-[10px] font-medium text-left rounded max-sm:whitespace-nowrap">Date of Birth</label>
                <input type="date" {...register("dateOfBirth")} className="flex-1 border border-black/30 text-sm max-sm:text-[10px] px-3 py-2 max-sm:px-1 max-sm:py-1.5 outline-none bg-white rounded" />
              </div>
            </div>
            {errors.dateOfBirth && <div className="text-red-700 text-xs">{errors.dateOfBirth.message}</div>}

            {/* Material Status & Job */}
            <div className="flex gap-4 max-sm:gap-1.5">
              <div className="flex items-center gap-4 max-sm:gap-1 w-1/2">
                <label className="w-[190px] max-sm:w-20 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-[10px] font-medium text-left rounded max-sm:whitespace-nowrap">Material Status</label>
                <select {...register("materialStatus")} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 outline-none bg-white rounded">
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </div>
              <div className="flex items-center gap-4 max-sm:gap-1.5 w-1/2">
                <label className="w-[180px] max-sm:w-14 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">Job</label>
                <input type="text" {...register("job")} className="max-sm:w-16 flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 max-sm:gap-1.5">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-2 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">Address</label>
              <input type="text" {...register("address")} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
            </div>

            {/* Blood Type & Phone Number */}
            <div className="flex gap-4 max-sm:gap-1.5">
              <div className="flex items-center gap-4 max-sm:gap-1 w-1/2">
                <label className="w-[195px] max-sm:w-20 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-[10px] font-medium text-left rounded max-sm:whitespace-nowrap">Blood Type</label>
                <select {...register("bloodType")} className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 outline-none bg-white rounded">
                  <option value="">Select</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
              <div className="flex items-center gap-4 max-sm:gap-1 w-1/2">
                <label className="w-[190px] max-sm:w-20 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-[10px] font-medium text-left rounded max-sm:whitespace-nowrap">Phone Number</label>
                <input type="text" {...register("phone")} className="max-sm:w-16 flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 outline-none bg-white rounded" />
              </div>
            </div>

            {/* Chronic Diseases */}
            <div className="flex items-center gap-4 max-sm:gap-1">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-[10px] font-medium text-left rounded max-sm:whitespace-nowrap">Chronic Diseases</label>
              <input type="text" {...register("chronic")} placeholder="Diabetes|High blood pressure" className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 outline-none bg-white rounded" />
            </div>

            {/* Allergies */}
            <div className="flex items-center gap-4 max-sm:gap-1.5">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-2 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-xs font-medium text-left rounded">Allergies</label>
              <input type="text" {...register("allergies")} placeholder="Dust|pollen|peanuts" className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-2 max-sm:py-1.5 outline-none bg-white rounded" />
            </div>

            {/* Current Medication */}
            <div className="flex items-center gap-4 max-sm:gap-1">
              <label className="w-[140px] max-sm:w-24 bg-[#5ea0dd] text-white px-3 py-2 max-sm:px-1 max-sm:py-1.5 border border-black/40 text-sm max-sm:text-[10px] font-medium text-left rounded max-sm:whitespace-nowrap">Current Medication</label>
              <input type="text" {...register("medication")} placeholder="Panadol|Hibiotec|Augmantin" className="flex-1 border border-black/30 text-sm max-sm:text-xs px-3 py-2 max-sm:px-1.5 max-sm:py-1.5 outline-none bg-white rounded" />
            </div>

            {/* Buttons */}
            <div className="flex max-sm:flex-col justify-center gap-10 max-sm:gap-2.5 mt-4 max-sm:mt-3">
              <button type="submit" disabled={isSubmitting} className="bg-[#1a4b82] text-white font-bold px-8 max-sm:px-6 py-3 max-sm:py-2 max-sm:w-full rounded-md shadow-md hover:opacity-90 disabled:bg-gray-400 text-sm">
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>

              <button type="button" onClick={() => { reset(); setCapturedImage(null); localStorage.removeItem("capturedFaceImage"); setErrorMsg(""); setSuccessMsg(""); setFieldErrorsList([]); }} className="bg-white text-[#1a4b82] font-bold px-8 max-sm:px-6 py-2 max-sm:w-full rounded-md shadow-md hover:opacity-90 text-sm">
                Clear Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}