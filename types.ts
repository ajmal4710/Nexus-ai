// App Views
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CAMPAIGNS = 'CAMPAIGNS',
  SOCIAL_MANAGER = 'SOCIAL_MANAGER',
  PPC_MANAGER = 'PPC_MANAGER',
  BRAND_KIT = 'BRAND_KIT',
  COPYWRITER = 'COPYWRITER',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  SETTINGS = 'SETTINGS',
}

// Copy Tones
export enum CopyTone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  FRIENDLY = 'Friendly',
  URGENT = 'Urgent',
  LUXURY = 'Luxury',
  PLAYFUL = 'Playful',
}

// Strategy Interface
export interface Strategy {
  id: string;
  businessName?: string;
  name?: string;
  goal?: string;
  date?: string;
  status: 'Active' | 'Draft' | 'Paused';
  mode?: 'simple' | 'advanced';
  content?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Post Interface
export interface Post {
  id: string | number;
  content: string;
  date?: string;
  time?: string;
  platforms?: string[];
  status: 'Scheduled' | 'Published' | 'Draft';
  platform?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
}

// Social Account Interface
export interface SocialAccount {
  id: string;
  platform: string;
  name?: string;
  username?: string;
  handle?: string;
  avatar?: string;
  connected: boolean;
  followers?: number;
  brandColor?: string;
  permissions?: string[];
}

// Activity Stats Interface
export interface ActivityStats {
  copyGenerated: number;
  imagesGenerated: number;
  videosGenerated: number;
}
