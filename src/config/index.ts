interface Config {
  api: {
    baseUrl: string;
    useMock: boolean;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    userKey: string;
    tokenExpiryThreshold: number; // in seconds
  };
}

const config: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    useMock: import.meta.env.VITE_USE_MOCK === 'true',
  },
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
    tokenExpiryThreshold: 5 * 60, // 5 minutes
  },
};

export default config;
