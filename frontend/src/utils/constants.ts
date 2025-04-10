/**
 * アプリケーション全体で使用される定数
 */

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ローカルストレージのキー
export const LOCAL_STORAGE_KEYS = {
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// 認証関連の定数
export const AUTH = {
  TOKEN_EXPIRY: '30d',
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },
};

// ユーザー関連の定数
export const USER = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
};

// プロジェクト関連の定数
export const PROJECT = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

// タスク関連の定数
export const TASK = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  TYPES: {
    TASK: 'task',
    MILESTONE: 'milestone',
    PROJECT: 'project',
  },
};

// ガントチャート関連の定数
export const GANTT = {
  VIEW_MODES: {
    HOUR: 'Hour',
    DAY: 'Day',
    WEEK: 'Week',
    MONTH: 'Month',
    YEAR: 'Year',
  },
  COLUMN_WIDTH: {
    HOUR: 50,
    DAY: 60,
    WEEK: 150,
    MONTH: 300,
    YEAR: 350,
  },
  COLORS: {
    TASK: {
      PROGRESS: '#2ecc71',
      PROGRESS_SELECTED: '#27ae60',
    },
    PROJECT: {
      PROGRESS: '#3498db',
      PROGRESS_SELECTED: '#2980b9',
    },
    MILESTONE: {
      PROGRESS: '#f39c12',
      PROGRESS_SELECTED: '#e67e22',
    },
  },
};

// 日付フォーマット
export const DATE_FORMATS = {
  DISPLAY: 'yyyy/MM/dd',
  INPUT: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy/MM/dd HH:mm',
};

// APIエンドポイント
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PROJECTS: {
    BASE: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    MEMBER: (id: string, userId: string) => `/projects/${id}/members/${userId}`,
  },
  TASKS: {
    BASE: '/tasks',
    DETAIL: (id: string) => `/tasks/${id}`,
    BY_PROJECT: (projectId: string) => `/tasks/project/${projectId}`,
    PROGRESS: (id: string) => `/tasks/${id}/progress`,
    ASSIGN: (id: string) => `/tasks/${id}/assign`,
    UNASSIGN: (id: string, userId: string) => `/tasks/${id}/assign/${userId}`,
  },
};

// ページルート
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROJECTS: {
    LIST: '/',
    NEW: '/projects/new',
    DETAIL: (id: string) => `/projects/${id}`,
    EDIT: (id: string) => `/projects/edit/${id}`,
  },
};

// ステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// エラーメッセージ
export const ERROR_MESSAGES = {
  DEFAULT: '操作に失敗しました。もう一度お試しください。',
  NETWORK: 'サーバーに接続できません。インターネット接続を確認してください。',
  UNAUTHORIZED: '認証に失敗しました。再度ログインしてください。',
  FORBIDDEN: 'この操作を実行する権限がありません。',
  NOT_FOUND: '要求されたリソースが見つかりませんでした。',
  VALIDATION: '入力データが正しくありません。修正してください。',
};

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  LOGIN: 'ログインしました',
  REGISTER: 'アカウントが作成されました',
  LOGOUT: 'ログアウトしました',
  PROJECT_CREATE: 'プロジェクトが作成されました',
  PROJECT_UPDATE: 'プロジェクトが更新されました',
  PROJECT_DELETE: 'プロジェクトが削除されました',
  TASK_CREATE: 'タスクが作成されました',
  TASK_UPDATE: 'タスクが更新されました',
  TASK_DELETE: 'タスクが削除されました',
  MEMBER_ADD: 'メンバーが追加されました',
  MEMBER_REMOVE: 'メンバーが削除されました',
};