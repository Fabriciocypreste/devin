/**
 * M3U Parser Service
 * Parses M3U playlist files and extracts channel information
 */

export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

/**
 * Parse M3U file from URL and return array of channels
 * @param fileUrl - URL to the M3U file
 * @returns Promise<Channel[]> - Array of parsed channels
 */
export async function parseM3U(fileUrl: string): Promise<Channel[]> {
  try {
    console.log('📺 Parsing M3U file from:', fileUrl);
    
    // Fetch the M3U file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U file: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log('✅ M3U file loaded, size:', content.length, 'bytes');
    
    // Parse the M3U content
    const channels = parseM3UContent(content);
    console.log('✅ Parsed', channels.length, 'channels');
    
    return channels;
  } catch (error) {
    console.error('❌ Error parsing M3U file:', error);
    throw error;
  }
}

/**
 * Parse M3U file content and extract channel information
 * @param content - M3U file content as string
 * @returns Channel[] - Array of parsed channels
 */
function parseM3UContent(content: string): Channel[] {
  const channels: Channel[] = [];
  const lines = content.split('\n');
  
  let currentChannel: Partial<Channel> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments (except EXTINF)
    if (!line || line.startsWith('#EXT-X-')) {
      continue;
    }
    
    // Parse EXTINF line (channel metadata)
    if (line.startsWith('#EXTINF:')) {
      currentChannel = parseExtinfLine(line);
    }
    // Parse URL line (stream URL)
    else if (currentChannel && (line.startsWith('http://') || line.startsWith('https://'))) {
      currentChannel.url = line;
      
      // Generate unique ID
      currentChannel.id = generateChannelId(currentChannel as Channel);
      
      // Add channel to list if it has required fields
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel as Channel);
      }
      
      currentChannel = null;
    }
  }
  
  return channels;
}

/**
 * Parse EXTINF line to extract channel metadata
 * Format: #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..." group-title="...",Channel Name
 * @param line - EXTINF line from M3U file
 * @returns Partial<Channel> - Parsed channel metadata
 */
function parseExtinfLine(line: string): Partial<Channel> {
  const channel: Partial<Channel> = {
    name: '',
    logo: '',
    group: '',
    url: ''
  };
  
  // Extract tvg-name attribute
  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
  if (tvgNameMatch) {
    channel.name = tvgNameMatch[1];
  }
  
  // Extract tvg-logo attribute
  const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
  if (tvgLogoMatch) {
    channel.logo = tvgLogoMatch[1];
  }
  
  // Extract group-title attribute
  const groupTitleMatch = line.match(/group-title="([^"]*)"/);
  if (groupTitleMatch) {
    channel.group = groupTitleMatch[1];
  }
  
  // If no tvg-name, try to extract name from end of line (after comma)
  if (!channel.name) {
    const commaIndex = line.lastIndexOf(',');
    if (commaIndex !== -1) {
      channel.name = line.substring(commaIndex + 1).trim();
    }
  }
  
  return channel;
}

/**
 * Generate unique ID for channel
 * @param channel - Channel object
 * @returns string - Unique channel ID
 */
function generateChannelId(channel: Channel): string {
  // Use a combination of name and URL to create a unique but deterministic ID
  const str = `${channel.name}-${channel.url}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `channel-${Math.abs(hash)}`;
}
