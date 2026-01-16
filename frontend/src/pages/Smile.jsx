import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Smile() {
    const nav = useNavigate()
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    const [isCameraOn, setIsCameraOn] = useState(false)
    const [stream, setStream] = useState(null)
    const [captured, setCaptured] = useState(null)
    const [status, setStatus] = useState("Ready for scan")

    useEffect(() => {
        // Cleanup camera on page leave
        return () => {
            stopCamera()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const startCamera = async () => {
        try {
            setStatus("Starting camera...")
            const media = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            })

            setStream(media)
            if (videoRef.current) {
                videoRef.current.srcObject = media
                await videoRef.current.play()
            }
            setIsCameraOn(true)
            setStatus("Camera ready • Show your best smile 😊")
        } catch (err) {
            console.error(err)
            setStatus("Camera blocked • Please allow permission or use Upload")
            setIsCameraOn(false)
        }
    }

    const stopCamera = () => {
        try {
            if (stream) {
                stream.getTracks().forEach((t) => t.stop())
            }
        } catch (e) {
            // ignore
        }
        setStream(null)
        setIsCameraOn(false)
    }

    const capture = () => {
        if (!videoRef.current || !canvasRef.current) return
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        canvas.width = video.videoWidth || 720
        canvas.height = video.videoHeight || 720
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const data = canvas.toDataURL("image/png")
        setCaptured(data)
        setStatus("Captured ✅ (AI scan UI demo)")
    }

    const resetCapture = () => {
        setCaptured(null)
        setStatus("Ready for scan")
    }

    const onUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setCaptured(url)
        setStatus("Uploaded ✅ (AI scan UI demo)")
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
            {/* Animated Orbs */}
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
            <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
            <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

            <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-300 text-sm">Smile Scan</p>
                        <h1 className="text-3xl md:text-4xl font-extrabold">
                            AI Camera Verification ✨
                        </h1>
                        <p className="text-gray-300 mt-2 text-sm max-w-xl">
                            Frontend demo: capture a selfie using camera or upload. Next step we’ll plug AI
                            smile detection.
                        </p>
                    </div>

                    <button
                        onClick={() => nav("/dashboard")}
                        className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
                    >
                        ← Back
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Camera Panel */}
                    <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 md:p-7 glow-border relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 via-transparent to-fuchsia-500/10 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-block w-2.5 h-2.5 rounded-full ${isCameraOn ? "bg-green-400" : "bg-gray-400"
                                            }`}
                                    />
                                    <p className="text-sm text-gray-200 font-semibold">
                                        {status}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!isCameraOn ? (
                                        <button
                                            onClick={startCamera}
                                            className="px-4 py-2 rounded-2xl bg-white text-black font-extrabold hover:scale-[1.02] transition"
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

                                    <label className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 font-extrabold hover:bg-white/15 transition cursor-pointer">
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={onUpload}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Futuristic Frame */}
                            <div className="mt-5 relative rounded-3xl overflow-hidden border border-white/15 bg-black/40">
                                {/* Corner accents */}
                                <div className="pointer-events-none absolute inset-0">
                                    <div className="absolute top-4 left-4 w-10 h-10 border-l-2 border-t-2 border-yellow-300/70 rounded-tl-2xl" />
                                    <div className="absolute top-4 right-4 w-10 h-10 border-r-2 border-t-2 border-fuchsia-400/60 rounded-tr-2xl" />
                                    <div className="absolute bottom-4 left-4 w-10 h-10 border-l-2 border-b-2 border-emerald-300/60 rounded-bl-2xl" />
                                    <div className="absolute bottom-4 right-4 w-10 h-10 border-r-2 border-b-2 border-cyan-300/60 rounded-br-2xl" />
                                </div>

                                {/* Video or captured image */}
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

                                {/* Scanning line (UI effect) */}
                                <div className="pointer-events-none absolute left-0 right-0 top-0 h-full">
                                    <div className="scanline absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-70" />
                                </div>

                                {/* Subtle vignette */}
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
                            </div>

                            {/* Actions */}
                            <div className="mt-5 flex flex-col md:flex-row gap-3">
                                <button
                                    onClick={capture}
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.01] transition disabled:opacity-40 disabled:hover:scale-100"
                                    disabled={!isCameraOn || !!captured}
                                >
                                    😊 Capture Selfie
                                    <p className="text-xs font-medium opacity-80 mt-1">
                                        (Requires camera on)
                                    </p>
                                </button>

                                <button
                                    onClick={resetCapture}
                                    className="flex-1 py-4 rounded-2xl bg-white/10 border border-white/15 font-extrabold hover:bg-white/15 transition disabled:opacity-40"
                                    disabled={!captured}
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Hidden canvas for capture */}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    </div>

                    {/* Right: AI Status + Rules */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
                        <h3 className="text-xl font-bold">AI Scan Panel</h3>
                        <p className="text-gray-300 text-sm mt-2">
                            This is the “wow” part. Next step: real smile detection.
                        </p>

                        <div className="mt-5 space-y-3">
                            <InfoCard
                                title="Verification"
                                value={captured ? "Ready to Scan ✅" : "Waiting for selfie…"}
                                accent="from-yellow-300/20 to-orange-500/10"
                            />
                            <InfoCard
                                title="Daily Limit"
                                value="2 smiles/day"
                                accent="from-fuchsia-500/18 to-purple-600/10"
                            />
                            <InfoCard
                                title="Gap Rule"
                                value="6-hour gap"
                                accent="from-emerald-400/16 to-cyan-500/10"
                            />
                        </div>

                        <button
                            className={`mt-6 w-full py-4 rounded-2xl font-extrabold transition ${captured
                                    ? "bg-white text-black hover:scale-[1.02]"
                                    : "bg-white/10 text-gray-400 cursor-not-allowed"
                                }`}
                            disabled={!captured}
                            onClick={() => setStatus("Scanning... (UI demo)")}
                        >
                            Start AI Scan ✨
                        </button>

                        <p className="mt-4 text-xs text-gray-400">
                            Tip: Camera works on localhost. On mobile, use HTTPS or LAN IP.
                        </p>
                    </div>
                </div>
            </div>

            {/* Scanline animation style (Tailwind friendly) */}
            <style>{`
        @keyframes scan {
          0% { transform: translateY(-10%); opacity: 0.0; }
          10% { opacity: 0.75; }
          50% { opacity: 0.35; }
          90% { opacity: 0.75; }
          100% { transform: translateY(110%); opacity: 0.0; }
        }
        .scanline {
          animation: scan 2.2s linear infinite;
          top: 0;
        }
      `}</style>
        </div>
    )
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
    )
}
