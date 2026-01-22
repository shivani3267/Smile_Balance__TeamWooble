import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Smile from "./pages/Smile"
import Withdraw from "./pages/Withdraw"
import SupportChat from "./pages/SupportChat";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/smile" element={<Smile />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/support-chat" element={<SupportChat />} />

      </Routes>
    </BrowserRouter>
  )
}
