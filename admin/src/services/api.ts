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
