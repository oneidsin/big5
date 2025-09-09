import axios from "axios";

// 환경 변수에서 API 기본 URL을 가져옵니다.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// axios 인스턴스를 생성하고 기본 URL과 쿠키 전송 설정을 추가합니다.
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 모든 요청에 쿠키를 포함시킵니다.
});

// 응답 인터셉터: 모든 API 응답을 처리합니다.
api.interceptors.response.use(
  // 성공적인 응답은 그대로 반환합니다.
  (response) => response,
  // 에러 응답을 처리합니다.
  (error) => {
    // 401 인증 실패 시 처리 (쿠키가 유효하지 않거나 만료된 경우)
    if (error.response?.status === 401) {
      console.warn("인증 정보가 유효하지 않아 로그인 페이지로 이동합니다.");
      // 로그인 페이지로 리다이렉트합니다.
      // 현재 위치가 로그인 페이지가 아닐 경우에만 리다이렉트
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
