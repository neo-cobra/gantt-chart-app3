/**
 * ユーティリティヘルパー関数
 */

/**
 * 日付を標準フォーマット（YYYY-MM-DD）に変換する
 * @param dateString 日付文字列
 * @returns フォーマットされた日付文字列
 */
export const formatDateToInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * 日本語表示用の日付フォーマット（YYYY/MM/DD）に変換する
 * @param dateString 日付文字列
 * @returns 日本語フォーマットの日付文字列
 */
export const formatDateJP = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

/**
 * プロジェクト全体の進捗率を計算する
 * @param tasks タスクの配列
 * @returns 進捗率（0-1の範囲）
 */
export const calculateProjectProgress = (tasks: any[]): number => {
  if (!tasks || tasks.length === 0) return 0;
  
  const total = tasks.length;
  const progressSum = tasks.reduce((sum, task) => sum + task.progress, 0);
  return progressSum / (total * 100);
};

/**
 * 文字列を省略形に変換する（長いテキストを表示する際に使用）
 * @param text 元の文字列
 * @param maxLength 最大長
 * @returns 省略された文字列
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * ベース64にエンコードする
 * @param str エンコードする文字列
 * @returns エンコードされた文字列
 */
export const encodeBase64 = (str: string): string => {
  return btoa(str);
};

/**
 * ベース64からデコードする
 * @param base64 デコードするベース64文字列
 * @returns デコードされた文字列
 */
export const decodeBase64 = (base64: string): string => {
  return atob(base64);
};

/**
 * 配列をシャッフルする
 * @param array シャッフルする配列
 * @returns シャッフルされた新しい配列
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * キャメルケースからスネークケースに変換
 * @param str キャメルケースの文字列
 * @returns スネークケースの文字列
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * スネークケースからキャメルケースに変換
 * @param str スネークケースの文字列
 * @returns キャメルケースの文字列
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * 適切なエラーメッセージを取得する
 * @param error エラーオブジェクト
 * @param fallback フォールバックメッセージ
 * @returns エラーメッセージ
 */
export const getErrorMessage = (error: any, fallback: string = '操作に失敗しました'): string => {
  if (typeof error === 'string') return error;
  if (error && error.message) return error.message;
  if (error && error.response && error.response.data && error.response.data.error) {
    return error.response.data.error;
  }
  return fallback;
};