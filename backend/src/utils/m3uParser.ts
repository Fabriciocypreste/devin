export interface ParsedChannel {
  name: string;
  logo: string | null;
  url: string;
  format: 'ts' | 'm3u8';
  group: string;
}

export interface ParsedPlaylist {
  channels: ParsedChannel[];
  categories: string[];
}

export function parseM3U(content: string): ParsedPlaylist {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const channels: ParsedChannel[] = [];
  const categoriesSet = new Set<string>();

  let currentChannel: Partial<ParsedChannel> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#EXTINF:')) {
      currentChannel = parseExtinf(line);
    } else if (line.startsWith('#EXTGRP:')) {
      if (currentChannel) {
        currentChannel.group = line.replace('#EXTGRP:', '').trim();
      }
    } else if (!line.startsWith('#') && currentChannel) {
      const url = line.trim();
      if (url && (url.endsWith('.ts') || url.endsWith('.m3u8') || url.includes('.ts?') || url.includes('.m3u8?'))) {
        currentChannel.url = url;
        currentChannel.format = url.includes('.m3u8') ? 'm3u8' : 'ts';
        
        if (!currentChannel.group) {
          currentChannel.group = 'OUTROS';
        }
        
        categoriesSet.add(currentChannel.group);
        
        channels.push({
          name: currentChannel.name || 'Canal Sem Nome',
          logo: currentChannel.logo || null,
          url: currentChannel.url,
          format: currentChannel.format,
          group: currentChannel.group
        });
      }
      currentChannel = null;
    }
  }

  return {
    channels,
    categories: Array.from(categoriesSet).sort()
  };
}

function parseExtinf(line: string): Partial<ParsedChannel> {
  const channel: Partial<ParsedChannel> = {};

  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
  if (tvgNameMatch) {
    channel.name = tvgNameMatch[1];
  }

  const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/i);
  if (tvgLogoMatch) {
    channel.logo = tvgLogoMatch[1];
  }

  const groupTitleMatch = line.match(/group-title="([^"]*)"/i);
  if (groupTitleMatch) {
    channel.group = groupTitleMatch[1].toUpperCase();
  }

  if (!channel.name) {
    const commaIndex = line.lastIndexOf(',');
    if (commaIndex !== -1) {
      channel.name = line.substring(commaIndex + 1).trim();
    }
  }

  return channel;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
