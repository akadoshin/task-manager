/**
 * define all the API routes
 *
 * @enum {string}
 *
 * @example
 * ```ts
 * Controller(ERoutes.Auth)
 * export class Controller {}
 * ```
 */
export enum ERoutes {
  Auth = 'auth',
  Workspaces = 'workspaces',
}

export enum EAuthRoutes {
  Login = 'login',
  Register = 'register',
  Suggestions = 'suggestions',
}
