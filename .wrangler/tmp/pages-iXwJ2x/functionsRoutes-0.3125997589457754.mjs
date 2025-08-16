import { onRequestGet as __api_health_ts_onRequestGet } from "/Users/bradharris/Developer/wb-site/wizardbrad/functions/api/health.ts"

export const routes = [
    {
      routePath: "/api/health",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_health_ts_onRequestGet],
    },
  ]