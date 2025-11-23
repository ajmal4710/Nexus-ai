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
  name: string;
  status: 'Active' | 'Draft' | 'Paused';
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Post Interface
export interface Post {
  id: string;
  content: string;
  status: 'Scheduled' | 'Published' | 'Draft';
  platform?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
}

// Social Account Interface
export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  followers?: number;
}

// Activity Stats Interface
export interface ActivityStats {
  copyGenerated: number;
  imagesGenerated: number;
  videosGenerated: number;
}
