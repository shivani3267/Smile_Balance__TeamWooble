// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as faceapi from "face-api.js";


// export default function Smile() {
//   const nav = useNavigate();
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [captured, setCaptured] = useState(null);
//   const [rawFile, setRawFile] = useState(null);
//   const [status, setStatus] = useState("Ready for scan");

//   // ✅ Single source of truth
//   const [userStats, setUserStats] = useState({});

//   useEffect(() => {
//     return () => stopCamera();
//   }, []);

//   const startCamera = async () => {
//     try {
//       setStatus("Starting camera...");
//       const media = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "user" },
//         audio: false,
//       });
//       setStream(media);
//       if (videoRef.current) {
//         videoRef.current.srcObject = media;
//         await videoRef.current.play();
//       }
//       setIsCameraOn(true);
//       setStatus("Camera ready • Show your best smile 😊");
//     } catch (err) {
//       console.error(err);
//       setStatus("Camera blocked • Please allow permission or use Upload");
//       setIsCameraOn(false);
//     }
//   };

//   const stopCamera = () => {
//     try {
//       if (stream) stream.getTracks().forEach((t) => t.stop());
//     } catch {}
//     setStream(null);
//     setIsCameraOn(false);
//   };

//   const capture = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     canvas.width = video.videoWidth || 720;
//     canvas.height = video.videoHeight || 720;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const data = canvas.toDataURL("image/png");
//     setCaptured(data);

//     canvas.toBlob((blob) => {
//       const file = new File([blob], "smile.png", { type: "image/png" });
//       setRawFile(file);
//     }, "image/png");

//     setStatus("Captured ✅ Ready to scan");
//   };

//   const resetCapture = () => {
//     setCaptured(null);
//     setRawFile(null);
//     setStatus("Ready for scan");
//     setUserStats({});
//   };

//   const onUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setRawFile(file);
//     setCaptured(URL.createObjectURL(file));
//     setStatus("Uploaded ✅ Ready to scan");
//   };

// // 
// const handleScan = async () => {
//     if (!rawFile) return;
  
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("You must be logged in!");
//       return;
//     }
  
//     setStatus("Scanning your smile... 🤖");
  
//     const formData = new FormData();
//     formData.append("image", rawFile);
  
//     try {
//       const res = await fetch("http://localhost:5000/api/smile/add", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });
  
//       const data = await res.json();
  
//       if (!res.ok) {
//         setStatus(data.message || "Verification failed");
//         return;
//       }
  
//       setUserStats({
//         streak: data.streak,
//         balance: data.balance,
//         todaySmileCount: data.todaySmileCount,
//         activity: data.activity,
//       });
  
//       setStatus(data.message || "Smile verified 🎉");
//     } catch (err) {
//       console.error(err);
//       setStatus("Server error. Check your connection.");
//     }
//   };
  
//   return (
//     <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
//       <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-gray-300 text-sm">Smile Scan</p>
//             <h1 className="text-3xl md:text-4xl font-extrabold">
//               AI Camera Verification ✨
//             </h1>
//           </div>
//           <button
//             onClick={() => nav("/dashboard")}
//             className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15"
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2 bg-white/10 rounded-3xl p-5">
//             <div className="flex justify-between">
//               <p className="font-semibold">{status}</p>

//               <div className="flex gap-2">
//                 {!isCameraOn ? (
//                   <button onClick={startCamera}>Start Camera</button>
//                 ) : (
//                   <button onClick={stopCamera}>Stop</button>
//                 )}

//                 <label>
//                   Upload
//                   <input type="file" hidden onChange={onUpload} />
//                 </label>
//               </div>
//             </div>

//             <div className="mt-4 aspect-square bg-black">
//               {!captured ? (
//                 <video
//                   ref={videoRef}
//                   className="w-full h-full object-cover"
//                   playsInline
//                   muted
//                 />
//               ) : (
//                 <img src={captured} className="w-full h-full object-cover" />
//               )}
//             </div>

//             <div className="mt-4 flex gap-3">
//               <button onClick={capture} disabled={!isCameraOn || !!captured}>
//                 😊 Capture
//               </button>
//               <button onClick={resetCapture} disabled={!captured}>
//                 Reset
//               </button>
//             </div>

//             <canvas ref={canvasRef} className="hidden" />
//           </div>

//           <div className="bg-white/10 rounded-3xl p-6">
//             <h3 className="text-xl font-bold">AI Scan Panel</h3>

//             <div className="mt-4 space-y-3">
//               <InfoCard
//                 title="Verification"
//                 value={captured ? "Ready to Scan ✅" : "Waiting for selfie…"}
//               />

//               {userStats.balance !== undefined && (
//                 <InfoCard
//                   title="Balance"
//                   value={`₹${userStats.balance}`}
//                 />
//               )}

//               {userStats.streak !== undefined && (
//                 <InfoCard
//                   title="Streak"
//                   value={`${userStats.streak} days`}
//                 />
//               )}
//             </div>

//             <button
//               className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold"
//               disabled={!rawFile}

//               onClick={handleScan}
//             >
//               Start AI Scan ✨
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoCard({ title, value }) {
//   return (
//     <div className="rounded-xl bg-black/30 p-4">
//       <p className="text-xs text-gray-400">{title}</p>
//       <p className="font-bold">{value}</p>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

export default function Smile() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [status, setStatus] = useState("Ready for scan");

  // ✅ FaceAPI models state
  const [modelsReady, setModelsReady] = useState(false);
  const [scanning, setScanning] = useState(false);

  // ✅ Single source of truth
  const [userStats, setUserStats] = useState({});

  const MODEL_URL =
    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus("Loading AI models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsReady(true);
        setStatus("Models ready ✅ Start camera or upload");
      } catch (e) {
        console.error("FaceAPI model load error:", e);
        setModelsReady(false);
        setStatus("AI model load failed ❌ Check internet");
      }
    };

    loadModels();

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      setStatus("Starting camera...");
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play();
      }

      setIsCameraOn(true);
      setStatus("Camera ready • Show your best smile 😊");
    } catch (err) {
      console.error(err);
      setStatus("Camera blocked • Please allow permission or use Upload");
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    try {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    } catch {}
    setStream(null);
    setIsCameraOn(false);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    setCaptured(data);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "smile.png", { type: "image/png" });
        setRawFile(file);
      },
      "image/png",
      1
    );

    setStatus("Captured ✅ Ready to scan");
  };

  const resetCapture = () => {
    setCaptured(null);
    setRawFile(null);
    setStatus("Ready for scan");
    setUserStats({});
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawFile(file);
    setCaptured(URL.createObjectURL(file));
    setStatus("Uploaded ✅ Ready to scan");
  };

  // // ✅ Smile detection + backend call
  // const handleScan = async () => {
  //   if (!rawFile) return;

  //   if (!modelsReady) {
  //     setStatus("AI not ready • Check internet");
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("You must be logged in!");
  //     return;
  //   }

  //   try {
  //     setStatus("Checking smile... 🤖");

  //     // ✅ Detect face + expressions
  //     const img = await faceapi.fetchImage(captured);

  //     const result = await faceapi
  //       .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
  //       .withFaceExpressions();

  //     if (!result) {
  //       setStatus("No face found ❌ Try clearer selfie");
  //       return;
  //     }

  //     const happy = result.expressions?.happy ?? 0;
  //     const THRESHOLD = 0.6;

  //     if (happy < THRESHOLD) {
  //       setStatus(`Not smiling enough ❌ Score: ${happy.toFixed(2)}`);
  //       return;
  //     }

  //     // ✅ Only if smile is valid -> call backend
  //     setStatus("Smile verified ✅ Uploading...");

  //     const formData = new FormData();
  //     formData.append("image", rawFile);

  //     const res = await fetch("http://localhost:5000/api/smile/add", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       setStatus(data.message || "Verification failed");
  //       return;
  //     }

  //     setUserStats({
  //       streak: data.streak,
  //       balance: data.balance,
  //       todaySmileCount: data.todaySmileCount,
  //       activity: data.activity,
  //     });

  //     setStatus(data.message || "Smile verified 🎉");
  //   } catch (err) {
  //     console.error(err);
  //     setStatus("Server error. Check your connection.");
  //   }
  // };

  const handleScan = async () => {
    // ✅ prevent multiple clicks
    if (scanning) return;
    setScanning(true);
  
    try {
      if (!rawFile) return;
  
      if (!modelsReady) {
        setStatus("AI not ready • Check internet");
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in!");
        return;
      }
  
      setStatus("Checking smile... 🤖");
  
      // ✅ Detect face + expressions
      const img = await faceapi.fetchImage(captured);
  
      const result = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
  
      if (!result) {
        setStatus("No face found ❌ Try clearer selfie");
        return;
      }
  
      const happy = result.expressions?.happy ?? 0;
      const THRESHOLD = 0.6;
  
      if (happy < THRESHOLD) {
        setStatus(`Not smiling enough ❌ Score: ${happy.toFixed(2)}`);
        return;
      }
  
      // ✅ Only if smile is valid -> call backend
      setStatus("Smile verified ✅ Uploading...");
  
      const formData = new FormData();
      formData.append("image", rawFile);
  
      const res = await fetch("http://localhost:5000/api/smile/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setStatus(data.message || "Verification failed");
        return;
      }
  
      setUserStats({
        streak: data.streak,
        balance: data.balance,
        todaySmileCount: data.todaySmileCount,
        activity: data.activity,
      });
  
      // ✅ show reward amount
      if (data.reward !== undefined) {
        setStatus(`Verified 🎉 +₹${data.reward}`);
      } else {
        setStatus(data.message || "Smile verified 🎉");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error. Check your connection.");
    } finally {
      setScanning(false);
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
      <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Smile Scan</p>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              AI Camera Verification ✨
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {modelsReady ? "AI Ready ✅" : "Loading AI..."}
            </p>
          </div>

          <button
            onClick={() => nav("/dashboard")}
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15"
          >
            ← Back
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/10 rounded-3xl p-5">
            <div className="flex justify-between">
              <p className="font-semibold">{status}</p>

              <div className="flex gap-2">
                {!isCameraOn ? (
                  <button onClick={startCamera} disabled={!modelsReady}>
                    Start Camera
                  </button>
                ) : (
                  <button onClick={stopCamera}>Stop</button>
                )}

                <label>
                  Upload
                  <input type="file" hidden accept="image/*" onChange={onUpload} />
                </label>
              </div>
            </div>

            <div className="mt-4 aspect-square bg-black">
              {!captured ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
              ) : (
                <img src={captured} className="w-full h-full object-cover" alt="smile" />
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={capture} disabled={!isCameraOn || !!captured}>
                😊 Capture
              </button>
              <button onClick={resetCapture} disabled={!captured}>
                Reset
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="bg-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold">AI Scan Panel</h3>

            <div className="mt-4 space-y-3">
              <InfoCard
                title="Verification"
                value={captured ? "Ready to Scan ✅" : "Waiting for selfie…"}
              />

              <InfoCard title="AI Models" value={modelsReady ? "Loaded ✅" : "Loading..."} />

              {userStats.balance !== undefined && (
                <InfoCard title="Balance" value={`₹${userStats.balance}`} />
              )}

              {userStats.streak !== undefined && (
                <InfoCard title="Streak" value={`${userStats.streak} days`} />
              )}
            </div>

            <button
              className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold"
              disabled={!rawFile || !modelsReady}
              onClick={handleScan}
            >
              Start AI Scan ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl bg-black/30 p-4">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
