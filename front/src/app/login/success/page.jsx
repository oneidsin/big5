"use client"

import { useEffect } from "react";
import api from '@/app/lib/axios';

export default function SuccessPage() {
  useEffect(() => {
    handleLogin();
  }, []);

  const handleLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      try {
        const { data } = await api.post("/api/auth/google", { code });
        const token = data.token;
        sessionStorage.setItem("accessToken", token);
        window.location.href = "/";
      } catch (err) {
        alert("로그인 실패");
        console.log(err);
        window.location.href = "/login";
      }
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "100px", fontSize: "2rem" }}>로그인 처리 중...</div>
  );
}