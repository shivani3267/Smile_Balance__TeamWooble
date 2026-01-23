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

  const [modelsReady, setModelsReady] = useState(false);
  const [scanning, setScanning] = useState(false);

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
        setStatus("Models ready ✅ Start camera");
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


  const handleScan = async () => {
    if (scanning) return;
    setScanning(true);

    try {
      if (!rawFile || !captured) {
        setStatus("Capture or upload an image first");
        return;
      }

      if (!modelsReady) {
        setStatus("AI not ready • Check internet");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in!");
        return;
      }

      setStatus("Checking your expression... 🤖");

      const img = await faceapi.fetchImage(captured);

      const result = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!result) {
        setStatus("No face found ❌ Try clearer selfie");
        return;
      }

      const happy = result.expressions?.happy ?? 0;
      const sad = result.expressions?.sad ?? 0;
      const angry = result.expressions?.angry ?? 0;

      console.log("EXPRESSIONS:", result.expressions);

      const SMILE_THRESHOLD = 0.6;
      const EMOTION_THRESHOLD = 0.15;

      //  Open chatbot if sad/angry
      if (sad >= EMOTION_THRESHOLD || angry >= EMOTION_THRESHOLD) {
        setStatus("You seem upset 😟 Opening support chat...");
        setTimeout(() => nav("/support-chat"), 500);
        return;
      }

      //  Smile reward only if smiling enough
      if (happy < SMILE_THRESHOLD) {
        setStatus(`Not smiling enough ❌ Score: ${happy.toFixed(2)}`);
        return;
      }

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

      setStatus(data.reward ? `Verified 🎉 +🪙${data.reward}` : "Smile verified 🎉");
    } catch (err) {
      console.error(err);
      setStatus("Server error. Check your connection.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
      {/* Dashboard-like Orbs */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
      <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
      <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Smile Scan</p>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              AI Camera Verification ✨
            </h1>
            <p className="text-gray-300 mt-2 text-sm max-w-xl">
              Capture a selfie using camera. AI checks expressions and verifies reward.
            </p>
          </div>

          <button
            onClick={() => nav("/dashboard")}
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
          >
            ← Back
          </button>
        </div>

        {/* Main Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camera Card */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 md:p-7 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-fuchsia-500/10 blur-2xl" />

            <div className="relative z-10">
              {/* Status Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isCameraOn ? "bg-green-400" : "bg-gray-500"
                    }`}
                  />
                  <p className="text-sm text-gray-200 font-semibold">
                    {status} {!modelsReady ? "(AI not ready)" : ""}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!isCameraOn ? (
                    <button
                      onClick={startCamera}
                      disabled={!modelsReady}
                      className="px-4 py-2 rounded-2xl bg-white text-black font-extrabold hover:scale-[1.02] transition disabled:opacity-50"
                    >
                      Start Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 font-extrabold hover:bg-white/15 transition"
                    >
                      Stop
                    </button>
                  )}

                  {}
                </div>
              </div>

              {/* Preview Box */}
              <div className="mt-5 relative rounded-3xl overflow-hidden border border-white/15 bg-black/40">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-yellow-300/70 rounded-tl-2xl" />
                  <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-fuchsia-400/60 rounded-tr-2xl" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-emerald-300/60 rounded-bl-2xl" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-cyan-300/60 rounded-br-2xl" />
                </div>

                <div className="aspect-square w-full flex items-center justify-center">
                  {!captured ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                  ) : (
                    <img
                      src={captured}
                      alt="captured"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col md:flex-row gap-3">
                <button
                  onClick={capture}
                  disabled={!isCameraOn || !!captured}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.01] transition disabled:opacity-40 disabled:hover:scale-100"
                >
                  Capture Selfie
                  <p className="text-xs font-medium opacity-80 mt-1">
                    (Requires camera on)
                  </p>
                </button>

                <button
                  onClick={resetCapture}
                  disabled={!captured}
                  className="flex-1 py-4 rounded-2xl bg-white/10 border border-white/15 font-extrabold hover:bg-white/15 transition disabled:opacity-40"
                >
                  Reset
                </button>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* Scan Panel */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
            <h3 className="text-xl font-bold">AI Scan Panel</h3>

            <div className="mt-5 space-y-3">
              <InfoCard
                title="AI Models"
                value={modelsReady ? "Loaded ✅" : "Loading/Failed ❌"}
                accent="from-yellow-300/20 to-orange-500/10"
              />
              <InfoCard
                title="Verification"
                value={captured ? "Ready to Scan ✅" : "Waiting for selfie…"}
                accent="from-fuchsia-500/18 to-purple-600/10"
              />
              <InfoCard
                title="Scan Status"
                value={scanning ? "Scanning..." : "Idle"}
                accent="from-emerald-400/16 to-cyan-500/10"
              />

              {userStats.balance !== undefined && (
                <InfoCard
                  title="Reward Balance"
                  value={`${userStats.balance} 🪙`}
                  accent="from-emerald-400/16 to-cyan-500/10"
                />
              )}

              {userStats.streak !== undefined && (
                <InfoCard
                  title="Streak"
                  value={`${userStats.streak} days 🔥`}
                  accent="from-yellow-300/18 to-orange-500/10"
                />
              )}
            </div>

            <button
              className={`mt-6 w-full py-4 rounded-2xl font-extrabold transition ${
                captured && modelsReady && !scanning
                  ? "bg-white text-black hover:scale-[1.02]"
                  : "bg-white/10 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!captured || !modelsReady || scanning}
              onClick={handleScan}
            >
              {scanning ? "Scanning..." : "Start AI Scan ✨"}
            </button>

            {}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-black/25 p-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} blur-2xl`} />
      <div className="relative z-10">
        <p className="text-xs text-gray-400">{title}</p>
        <p className="mt-1 font-extrabold">{value}</p>
      </div>
    </div>
  );
}

