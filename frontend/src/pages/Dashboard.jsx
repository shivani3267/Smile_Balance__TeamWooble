

// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Badge from "../components/ui/Badge";
// import StatCard from "../components/ui/StatCard";
// import TopBar from "../components/layout/TopBar";

// export default function Dashboard() {
//   const nav = useNavigate();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return nav("/login");

//       try {
//         const res = await fetch("http://localhost:5000/api/auth/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           localStorage.removeItem("token");
//           return nav("/login");
//         }

//         setUser(data.user);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         localStorage.removeItem("token");
//         nav("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, [nav]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#070711] flex items-center justify-center">
//         <div className="text-xl font-bold text-white animate-pulse">
//           Loading Dashboard...
//         </div>
//       </div>
//     );
//   }

//   // ✅ DB field mapping fixed
//   const userData = {
//     name: user?.fullName || "User",
//     balance: user?.balance ?? 0,
//     smiles: user?.totalSmileCount ?? 0,
//     streak: user?.streak ?? 0,
//     todaySmiles: user?.todaySmileCount ?? 0,
//     nextSmileIn: "02h 18m", // static for now (you can make dynamic later)
//   };

//   // ✅ Recent activity from DB (fallback to empty)
//   const activity = (user?.activity || []).slice(-6).reverse();

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
//       {/* Animated Orbs Background */}
//       <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
//       <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
//       <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />
//       <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

//       <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
//         <TopBar />

//         <div className="flex items-center justify-between mt-6">
//           <div>
//             <p className="text-gray-300 text-sm">Welcome back</p>
//             <h1 className="text-3xl md:text-4xl font-extrabold capitalize">
//               {userData.name} 👋
//             </h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <Link
//               to="/withdraw"
//               className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
//             >
//               Wallet
//             </Link>

//             <button
//               onClick={() => {
//                 localStorage.removeItem("token");
//                 nav("/login");
//               }}
//               className="w-24 h-11 rounded-3xl bg-gradient-to-br from-yellow-300/40 to-fuchsia-500/30 border border-white/15 hover:scale-105 transition"
//             >
//               LogOut
//             </button>
//           </div>
//         </div>

//         {/* Hero Wallet Card */}
//         <div className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-8 glow-border">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div>
//               <p className="text-gray-300">Total Earnings</p>

//               <h2 className="text-5xl font-extrabold mt-2">
//                 <span className="text-green-300">₹</span>
//                 <span className="bg-gradient-to-r from-green-200 to-emerald-400 bg-clip-text text-transparent">
//                   {userData.balance}
//                 </span>
//               </h2>

//               <div className="mt-4 flex flex-wrap gap-3">
//                 <Badge label="AI Verified" />
//                 <Badge label={`${userData.smiles} Smiles`} />
//                 <Badge label={`🔥 ${userData.streak} Day Streak`} />
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => nav("/smile")}
//                 className="px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
//               >
//                 Give a Smile
//                 <p className="text-xs font-medium opacity-80 mt-1">Earn +₹10</p>
//               </button>

//               <button
//                 onClick={() => nav("/withdraw")}
//                 className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
//               >
//                 Withdraw
//                 <p className="text-xs font-medium opacity-80 mt-1">Min ₹100</p>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <StatCard
//             title="Today’s Limit"
//             value={`${userData.todaySmiles}/2 Smiles`}
//             sub={`Next smile in ${userData.nextSmileIn}`}
//             accent="from-yellow-300/25 to-orange-500/10"
//           />
//           <StatCard
//             title="Streak Power"
//             value={`${userData.streak} Days 🔥`}
//             sub="Keep smiling daily"
//             accent="from-fuchsia-500/20 to-purple-600/10"
//           />
//           <StatCard
//             title="Smile History"
//             value={`${userData.smiles} Total`}
//             sub="Consistency pays"
//             accent="from-emerald-400/18 to-cyan-500/10"
//           />
//         </div>

//         {/* Activity & Mission Section */}
//         <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
//           <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold">Recent Activity</h3>
//               <button className="text-sm text-gray-300 hover:text-white underline underline-offset-4">
//                 View all
//               </button>
//             </div>

//             <div className="mt-5 space-y-3">
//               {activity.length === 0 ? (
//                 <p className="text-gray-400 text-sm">
//                   No activity yet. Upload your first smile 😊
//                 </p>
//               ) : (
//                 activity.map((a, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between bg-black/25 border border-white/10 rounded-2xl p-4 hover:bg-black/35 transition"
//                   >
//                     <div>
//                       <p className="font-semibold">
//                         {a.action || "Activity"}
//                       </p>
//                       <p className="text-xs text-gray-300 mt-1">
//                         {a.time ? new Date(a.time).toLocaleString() : ""}
//                       </p>
//                     </div>

//                     <p className="font-extrabold text-green-300">
//                       +₹{a.creditsEarned ?? 0}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 glow-border">
//             <h3 className="text-xl font-bold">Today’s Mission</h3>
//             <p className="text-gray-300 mt-2">
//               Smile twice today and keep the streak alive.
//             </p>

//             <div className="mt-5 bg-black/25 border border-white/10 rounded-2xl p-4">
//               <p className="text-sm text-gray-300">Progress</p>

//               <div className="mt-3 w-full h-3 bg-white/10 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500"
//                   style={{ width: `${(userData.todaySmiles / 2) * 100}%` }}
//                 />
//               </div>

//               <p className="mt-3 text-sm">
//                 {userData.todaySmiles >= 2
//                   ? "✅ Limit reached!"
//                   : `✅ ${2 - userData.todaySmiles} smile left today`}
//               </p>
//             </div>

//             <button
//               onClick={() => nav("/smile")}
//               className="mt-6 w-full py-4 rounded-2xl bg-white text-black font-extrabold hover:scale-[1.02] transition"
//             >
//               Start AI Scan ✨
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import StatCard from "../components/ui/StatCard";
import TopBar from "../components/layout/TopBar";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Format milliseconds -> "02h 15m"
  const formatMs = (ms) => {
    const totalMinutes = Math.ceil(ms / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
  };

  // ✅ Calculate next smile time from DB lastSmileTime
  const getNextSmileIn = (lastSmileTime) => {
    if (!lastSmileTime) return "Now";

    const SIX_HOURS = 6 * 60 * 60 * 1000;
    const last = new Date(lastSmileTime).getTime();
    const left = SIX_HOURS - (Date.now() - last);

    if (left <= 0) return "Now";
    return formatMs(left);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return nav("/login");

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          return nav("/login");
        }

        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        nav("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [nav]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070711] flex items-center justify-center">
        <div className="text-xl font-bold text-white animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const userData = {
    name: user?.fullName || "User",
    balance: user?.balance ?? 0,
    smiles: user?.totalSmileCount ?? 0,
    streak: user?.streak ?? 0,
    todaySmiles: user?.todaySmileCount ?? 0,
    nextSmileIn: getNextSmileIn(user?.lastSmileTime),
  };

  const activity = (user?.activity || []).slice(-6).reverse();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#070711] text-white">
      {/* Animated Orbs Background */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-yellow-300/25 to-orange-500/15 blur-3xl blob" />
      <div className="absolute top-40 -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-500/20 to-purple-600/15 blur-3xl blob2" />
      <div className="absolute -bottom-56 left-24 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-emerald-400/18 to-cyan-500/10 blur-3xl blob" />
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

      <div className="relative z-10 p-6 md:p-10 max-w-[1200px] mx-auto">
        <TopBar />

        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-gray-300 text-sm">Welcome back</p>
            <h1 className="text-3xl md:text-4xl font-extrabold capitalize">
              {userData.name} 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/withdraw"
              className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              Wallet
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                nav("/login");
              }}
              className="w-24 h-11 rounded-3xl bg-gradient-to-br from-yellow-300/40 to-fuchsia-500/30 border border-white/15 hover:scale-105 transition"
            >
              LogOut
            </button>
          </div>
        </div>

        {/* Hero Wallet Card */}
        <div className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-8 glow-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-gray-300">Total Earnings</p>
              <h2 className="text-5xl font-extrabold mt-2">
                <span className="text-green-300">🪙</span>
                <span className="bg-gradient-to-r from-green-200 to-emerald-400 bg-clip-text text-transparent">
                  {userData.balance}
                </span>
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <Badge label="AI Verified" />
                <Badge label={`${userData.smiles} Smiles`} />
                <Badge label={`🔥 ${userData.streak} Day Streak`} />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => nav("/smile")}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
              >
                Give a Smile
                <p className="text-xs font-medium opacity-80 mt-1">Earn rewards</p>
              </button>

              <button
                onClick={() => nav("/withdraw")}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-300 to-green-400 text-black font-extrabold hover:scale-[1.02] transition shadow-xl"
              >
                Withdraw
                <p className="text-xs font-medium opacity-80 mt-1">Min ₹100</p>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Today’s Limit"
            value={`${userData.todaySmiles}/2 Smiles`}
            sub={`Next smile in ${userData.nextSmileIn}`}
            accent="from-yellow-300/25 to-orange-500/10"
          />
          <StatCard
            title="Streak Power"
            value={`${userData.streak} Days 🔥`}
            sub="Keep smiling daily"
            accent="from-fuchsia-500/20 to-purple-600/10"
          />
          <StatCard
            title="Smile History"
            value={`${userData.smiles} Total`}
            sub="Consistency pays"
            accent="from-emerald-400/18 to-cyan-500/10"
          />
        </div>

        {/* Activity & Mission Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <button className="text-sm text-gray-300 hover:text-white underline underline-offset-4">
                View all
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {activity.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No activity yet. Upload your first smile 😊
                </p>
              ) : (
                activity.map((a, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-black/25 border border-white/10 rounded-2xl p-4 hover:bg-black/35 transition"
                  >
                    <div>
                      <p className="font-semibold">{a.action || "Activity"}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {a.time ? new Date(a.time).toLocaleString() : ""}
                      </p>
                    </div>

                    <p className="font-extrabold text-green-300">
                      +₹{a.creditsEarned ?? 0}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 glow-border">
            <h3 className="text-xl font-bold">Today’s Mission</h3>
            <p className="text-gray-300 mt-2">
              Smile twice today and keep the streak alive.
            </p>

            <div className="mt-5 bg-black/25 border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-300">Progress</p>

              <div className="mt-3 w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500"
                  style={{ width: `${(userData.todaySmiles / 2) * 100}%` }}
                />
              </div>

              <p className="mt-3 text-sm">
                {userData.todaySmiles >= 2
                  ? "✅ Limit reached!"
                  : `✅ ${2 - userData.todaySmiles} smile left today`}
              </p>
            </div>

            <button
              onClick={() => nav("/smile")}
              className="mt-6 w-full py-4 rounded-2xl bg-white text-black font-extrabold hover:scale-[1.02] transition"
            >
              Start AI Scan ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
