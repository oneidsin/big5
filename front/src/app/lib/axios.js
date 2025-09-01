import axios from "axios";

// 환경 변수에서 API 기본 URL을 가져옵니다.
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// axios 인스턴스를 생성하고 기본 URL을 설정합니다.
const api = axios.create({
  baseURL: API_URL
});

// 요청 인터셉터: 모든 API 요청이 전송되기 전에 실행됩니다.
api.interceptors.request.use(
  (config) => {
    // 구글 로그인 요청의 경우 토큰 없이 요청을 보냅니다.
    if (config.url.includes("/api/auth/google")) {
      return config;
    }

    // 세션 스토리지에서 액세스 토큰을 가져옵니다.
    const token = sessionStorage.getItem("accessToken");
    // 토큰이 있으면 Authorization 헤더에 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 에러 발생 시 에러를 그대로 반환합니다.
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 모든 API 응답을 처리합니다.
api.interceptors.response.use(
  // 성공적인 응답은 그대로 반환합니다.
  (response) => response,
  // 에러 응답을 처리합니다.
  (error) => {
    // 401 인증 실패 시 처리
    if (error.response?.status === 401) {
      console.warn("인증이 만료되어 자동으로 로그아웃 처리됩니다.");
      // 세션 스토리지에서 토큰을 제거합니다.
      sessionStorage.removeItem("accessToken");
      // 로그인 페이지로 리다이렉트합니다.
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;