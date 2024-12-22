const config = {
  api: {
    useMock: true,
    baseUrl: 'http://localhost:3000/api'
  },
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'user'
  }
};

export default config;
