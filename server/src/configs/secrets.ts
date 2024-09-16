type AppConfig = {
  host: string;
  port: number;
  cookieSecret: string;
  reverseProxyIP: string | boolean;
};

type JWT = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiration: number;
  refreshTokenExpiration: number;
};

type Secrets = {
  node_env: string;
  jwt: JWT;
  app: AppConfig;
};

export const secrets: Secrets = {
  node_env: process.env.NODE_ENV ?? "development",
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET ?? "secret",
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET ?? "secretRefresh",
    accessTokenExpiration: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? "900",
      10
    ), // 900 seconds = 15 minutes
    refreshTokenExpiration: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? "259200",
      10
    ), // 259200 seconds = 3 days
  },
  app: {
    host: process.env.APP_HOST ?? "127.0.0.1",
    port: parseInt(process.env.APP_PORT ?? "8080", 10),
    cookieSecret: process.env.APP_COOKIE_SECRET ?? "cookieSecret",
    reverseProxyIP: process.env.APP_REVERSE_PROXY_IP ?? true,
  },
};
