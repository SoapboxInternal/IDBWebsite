import { getChatGPTUser } from '../app/chatgpt-auth';
import { db } from './brands';
import { authorizeEditorIdentity } from './editor-policy';

export async function isEditor(claim = false) {
  const user = await getChatGPTUser();
  if (!user) return false;
  const d = db();
  return authorizeEditorIdentity(user, {
    async get(key) {
      return (await d.prepare('SELECT value FROM settings WHERE key=?').bind(key).first<{value:string}>())?.value ?? null;
    },
    async setIfAbsent(key, userId) {
      await d.prepare('INSERT OR IGNORE INTO settings (key,value) VALUES (?,?)').bind(key, userId).run();
    },
  }, claim, process.env.NODE_ENV === 'development');
}

export function sameOrigin(r: Request) {
  const origin = r.headers.get('origin');
  return !!origin && origin === new URL(r.url).origin;
}
