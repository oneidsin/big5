"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("APIURL:", API_URL);
    handleLogin();
  }, [router]);

  const handleLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/google`, { code });
        console.log(data);
        const token = data.token;
        sessionStorage.setItem("accessToken", token);
        router.replace("/");
      } catch (err) {
        console.log("구글 로그인 실패: ", err);
        router.replace("/login");
      }
    }
  };

  return (
    <p>로그인 처리 중...</p>
  );
}