import {
  createRouter,
  type RouterHistory,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    trailingSlash: 'never',
  });
}

export const router = createAppRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
