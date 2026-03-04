import { cookies } from 'next/headers';
import AdminConfig from '@/models/AdminConfig';

const ADMIN_COOKIE = 'awo_admin_auth';

export async function getOrCreateAdminConfig() {
  let config = await AdminConfig.findOne();
  if (!config) {
    config = await AdminConfig.create({ username: 'hiipraise', password: 'deaa0da01614' });
  }
  return config;
}

export function buildAdminToken(username: string, password: string): string {
  return Buffer.from(`${username}:${password}`).toString('base64url');
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const config = await getOrCreateAdminConfig();
  return token === buildAdminToken(config.username, config.password);
}

export { ADMIN_COOKIE };
