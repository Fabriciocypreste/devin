import prisma from './database';
import { parseM3U, slugify, ParsedPlaylist } from '../utils/m3uParser';

interface JsonChannel {
  id?: string;
  name: string;
  title?: string;
  logo?: string | null;
  group: string;
  url: string;
}

export async function importJSON(channels: JsonChannel[]): Promise<{ channels: number; categories: number }> {
  const categoriesSet = new Set<string>();
  channels.forEach(ch => categoriesSet.add(ch.group.toUpperCase()));
  
  let categoriesCreated = 0;
  let channelsCreated = 0;

  for (const categoryName of categoriesSet) {
    const slug = slugify(categoryName);
    
    await prisma.category.upsert({
      where: { slug },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug,
        order: categoriesCreated
      }
    });
    categoriesCreated++;
  }

  for (const channel of channels) {
    const categorySlug = slugify(channel.group.toUpperCase());
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (category) {
      const format = channel.url.includes('.m3u8') ? 'm3u8' : 'ts';
      await prisma.channel.create({
        data: {
          name: channel.name || channel.title || 'Canal Sem Nome',
          logo: channel.logo || null,
          url: channel.url,
          format,
          categoryId: category.id,
          order: channelsCreated
        }
      });
      channelsCreated++;
    }
  }

  return { channels: channelsCreated, categories: categoriesCreated };
}

export async function importM3U(content: string): Promise<{ channels: number; categories: number }> {
  const parsed: ParsedPlaylist = parseM3U(content);
  
  let categoriesCreated = 0;
  let channelsCreated = 0;

  for (const categoryName of parsed.categories) {
    const slug = slugify(categoryName);
    
    await prisma.category.upsert({
      where: { slug },
      update: { name: categoryName },
      create: {
        name: categoryName,
        slug,
        order: categoriesCreated
      }
    });
    categoriesCreated++;
  }

  for (const channel of parsed.channels) {
    const categorySlug = slugify(channel.group);
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (category) {
      await prisma.channel.create({
        data: {
          name: channel.name,
          logo: channel.logo,
          url: channel.url,
          format: channel.format,
          categoryId: category.id,
          order: channelsCreated
        }
      });
      channelsCreated++;
    }
  }

  return { channels: channelsCreated, categories: categoriesCreated };
}

export async function getAllCategories(includeInactive = false) {
  return prisma.category.findMany({
    where: includeInactive ? {} : { active: true },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { channels: true }
      }
    }
  });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      channels: {
        where: { active: true },
        orderBy: { order: 'asc' }
      }
    }
  });
}

export async function updateCategory(id: number, data: { name?: string; icon?: string; order?: number; active?: boolean }) {
  const updateData: any = { ...data };
  if (data.name) {
    updateData.slug = slugify(data.name);
  }
  return prisma.category.update({
    where: { id },
    data: updateData
  });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({
    where: { id }
  });
}

export async function getAllChannels(categoryId?: number, includeInactive = false) {
  return prisma.channel.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(includeInactive ? {} : { active: true })
    },
    orderBy: { order: 'asc' },
    include: {
      category: {
        select: { name: true, slug: true }
      }
    }
  });
}

export async function getChannelById(id: number) {
  return prisma.channel.findUnique({
    where: { id },
    include: {
      category: true
    }
  });
}

export async function updateChannel(id: number, data: { name?: string; logo?: string; url?: string; format?: string; active?: boolean; order?: number; categoryId?: number }) {
  return prisma.channel.update({
    where: { id },
    data
  });
}

export async function deleteChannel(id: number) {
  return prisma.channel.delete({
    where: { id }
  });
}

export async function deleteAllChannels() {
  return prisma.channel.deleteMany();
}

export async function deleteAllCategories() {
  await prisma.channel.deleteMany();
  return prisma.category.deleteMany();
}

export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({
    where: { key }
  });
  return setting?.value || null;
}

export async function setSetting(key: string, value: string) {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
}

export async function getAllSettings() {
  return prisma.setting.findMany();
}
