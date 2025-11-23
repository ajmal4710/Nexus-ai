import React from 'react';
import { Post, SocialAccount } from '../types';

interface SocialManagerProps {
  accounts?: SocialAccount[];
  setAccounts?: React.Dispatch<React.SetStateAction<SocialAccount[]>>;
  posts?: Post[];
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>;
  onNavigate?: (view: any) => void;
}

const SocialManager: React.FC<SocialManagerProps> = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Social Media Manager</h2>
      <p className="text-slate-400">Social media management features coming soon...</p>
    </div>
  );
};

export default SocialManager;