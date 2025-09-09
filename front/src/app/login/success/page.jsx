'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 백엔드에서 쿠키를 설정하고 이 페이지로 리디렉션했으므로,
    // 프론트엔드는 바로 홈페이지로 이동시켜주기만 하면 됩니다.
    router.replace("/");
  }, [router]);

  return (
    <div style={{ textAlign: "center", margin: "100px", fontSize: "2rem" }}>
      로그인 처리 중...
    </div>
  );
}