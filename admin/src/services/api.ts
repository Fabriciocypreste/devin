const API_URL = '/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  order: number;
  active: boolean;
  _count?: { channels: number };
}

export interface Channel {
  id: number;
  name: string;
  logo: string | null;
  url: string;
  format: string;
  active: boolean;
  order: number;
  categoryId: number;
  category?: { name: string; slug: string };
}

export async function getCategories(includeInactive = false): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories?includeInactive=${includeInactive}`);
  return res.json();
}

export async function getChannels(categoryId?: number, includeInactive = false): Promise<Channel[]> {
  let url = `${API_URL}/channels?includeInactive=${includeInactive}`;
  if (categoryId) url += `&categoryId=${categoryId}`;
  const res = await fetch(url);
  return res.json();
}

export async function updateChannel(id: number, data: Partial<Channel>): Promise<Channel> {
  const res = await fetch(`${API_URL}/channels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteChannel(id: number): Promise<void> {
  await fetch(`${API_URL}/channels/${id}`, { method: 'DELETE' });
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
}

export async function uploadM3U(file: File, clearExisting = false): Promise<{ channels: number; categories: number }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('clearExisting', String(clearExisting));
  
  const res = await fetch(`${API_URL}/upload/m3u`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function importFromUrl(url: string, clearExisting = false): Promise<{ channels: number; categories: number }> {
  const res = await fetch(`${API_URL}/upload/m3u/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, clearExisting })
  });
  return res.json();
}

export async function importJSON(channels: any[], clearExisting = false): Promise<{ channels: number; categories: number }> {
  const res = await fetch(`${API_URL}/upload/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channels, clearExisting })
  });
  return res.json();
}

export async function getSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_URL}/settings`);
  return res.json();
}

export async function setSetting(key: string, value: string): Promise<void> {
  await fetch(`${API_URL}/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  });
}

export async function deleteAllChannels(): Promise<void> {
  await fetch(`${API_URL}/channels`, { method: 'DELETE' });
}

export async function deleteAllCategories(): Promise<void> {
  await fetch(`${API_URL}/categories`, { method: 'DELETE' });
}

export interface KPIs {
  totalUsers: number;
  activeSubscriptions: number;
  newUsersThisMonth: number;
  userGrowth: number;
  totalContent: number;
  totalViews: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  cancelledThisMonth: number;
}

export interface TopContent {
  id: number;
  title: string;
  posterPath: string;
  type: string;
  views: number;
}

export interface Content {
  id: number;
  title: string;
  type: string;
  posterPath?: string;
  streamUrl?: string;
  active: boolean;
  featured: boolean;
  channelNumber?: number;
  isLive?: boolean;
  _count?: { viewHistory: number; favorites: number };
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  plan: string;
  createdAt: string;
  subscription?: { plan: string; status: string };
  _count?: { viewHistory: number; favorites: number; payments: number };
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  order: number;
  active: boolean;
}

export interface SiteConfig {
  key: string;
  value: string;
  type: string;
  category: string;
}

export async function getKPIs(): Promise<KPIs> {
  const res = await fetch(`${API_URL}/analytics/kpis`);
  return res.json();
}

export async function getTopContent(): Promise<TopContent[]> {
  const res = await fetch(`${API_URL}/analytics/top-content`);
  return res.json();
}

export async function getContents(page = 1, limit = 20): Promise<{ contents: Content[]; total: number }> {
  const res = await fetch(`${API_URL}/content?page=${page}&limit=${limit}`);
  return res.json();
}

export async function createContent(data: Partial<Content>): Promise<Content> {
  const res = await fetch(`${API_URL}/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateContent(id: number, data: Partial<Content>): Promise<Content> {
  const res = await fetch(`${API_URL}/content/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteContent(id: number): Promise<void> {
  await fetch(`${API_URL}/content/${id}`, { method: 'DELETE' });
}

export async function getUsers(page = 1, limit = 20): Promise<{ users: User[]; total: number }> {
  const res = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`);
  return res.json();
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
}

export async function getBanners(): Promise<Banner[]> {
  const res = await fetch(`${API_URL}/banners`);
  return res.json();
}

export async function createBanner(data: Partial<Banner>): Promise<Banner> {
  const res = await fetch(`${API_URL}/banners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateBanner(id: number, data: Partial<Banner>): Promise<Banner> {
  const res = await fetch(`${API_URL}/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteBanner(id: number): Promise<void> {
  await fetch(`${API_URL}/banners/${id}`, { method: 'DELETE' });
}

export async function getSiteConfigs(): Promise<SiteConfig[]> {
  const res = await fetch(`${API_URL}/siteconfig`);
  return res.json();
}

export async function setSiteConfig(key: string, value: string): Promise<void> {
  await fetch(`${API_URL}/siteconfig/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  });
}

export async function initSiteDefaults(): Promise<void> {
  await fetch(`${API_URL}/siteconfig/defaults/init`);
}

// Access Codes (Trial) API
export interface AccessCode {
  id: number;
  code: string;
  email?: string;
  userId?: number;
  expiresAt: string;
  usedAt?: string;
  status: string;
  createdBy: number;
  createdAt: string;
}

export interface AccessCodeStats {
  active: number;
  used: number;
  expired: number;
  total: number;
}

export async function getAccessCodes(status?: string, page = 1): Promise<{ codes: AccessCode[]; pagination: { total: number; pages: number } }> {
  let url = `${API_URL}/access-codes?page=${page}`;
  if (status) url += `&status=${status}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return res.json();
}

export async function generateAccessCode(email?: string, durationMinutes = 60): Promise<{ success: boolean; accessCode: AccessCode }> {
  const res = await fetch(`${API_URL}/access-codes/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify({ email, durationMinutes })
  });
  return res.json();
}

export async function revokeAccessCode(id: number): Promise<void> {
  await fetch(`${API_URL}/access-codes/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
}

export async function getAccessCodeStats(): Promise<AccessCodeStats> {
  const res = await fetch(`${API_URL}/access-codes/stats`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return res.json();
}

// Subscribers (Novos Assinantes) API
export interface Subscriber {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  plan: string;
  planPrice: number;
  planMonths: number;
  status: string;
  notes?: string;
  approvedBy?: number;
  approvedAt?: string;
  createdAt: string;
}

export interface SubscriberStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  pendingRevenue: number;
  approvedRevenue: number;
}

export async function getSubscribers(status?: string, page = 1): Promise<{ subscribers: Subscriber[]; pagination: { total: number; pages: number } }> {
  let url = `${API_URL}/subscribers?page=${page}`;
  if (status) url += `&status=${status}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return res.json();
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
  const res = await fetch(`${API_URL}/subscribers/stats`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return res.json();
}

export async function approveSubscriber(id: number, notes?: string): Promise<{ success: boolean; subscriber: Subscriber }> {
  const res = await fetch(`${API_URL}/subscribers/${id}/approve`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify({ notes })
  });
  return res.json();
}

export async function rejectSubscriber(id: number, notes?: string): Promise<{ success: boolean; subscriber: Subscriber }> {
  const res = await fetch(`${API_URL}/subscribers/${id}/reject`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify({ notes })
  });
  return res.json();
}

export async function deleteSubscriber(id: number): Promise<void> {
  await fetch(`${API_URL}/subscribers/${id}`, { 
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
}
