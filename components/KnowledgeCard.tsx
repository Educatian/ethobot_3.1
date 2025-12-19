import React from 'react';
import type { KnowledgeSource } from '../types';
import { BookIcon, LinkIcon, YouTubeIcon, BlogIcon } from './icons';

interface KnowledgeCardProps {
  source: KnowledgeSource;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ source, onLogClick }) => {
  return (
    <div className="mt-4 mb-2 border border-alabama-crimson/30 bg-crimson-light/50 rounded-lg p-4 text-gray-800">
      <div className="flex items-center mb-3">
        <BookIcon className="h-6 w-6 text-alabama-crimson mr-3" />
        <div>
          <p className="text-xs font-semibold uppercase text-alabama-crimson">Deep Dive</p>
          <h4 className="font-bold text-gray-900">{source.title}</h4>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-4">{source.summary}</p>
      <div className="flex flex-wrap gap-2">
        <a
          id={`knowledge-link-primary-${source.id}`}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => onLogClick(`knowledge-link-primary-${source.id}`, 'a', e.currentTarget.textContent)}
          className="flex items-center text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
          title="Open the primary source document in a new tab"
        >
          <LinkIcon className="h-4 w-4 mr-2" /> Primary Source
        </a>
        {source.youtubeUrl && (
          <a
            id={`knowledge-link-youtube-${source.id}`}
            href={source.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => onLogClick(`knowledge-link-youtube-${source.id}`, 'a', e.currentTarget.textContent)}
            className="flex items-center text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
            title="Watch the related video on YouTube"
          >
            <YouTubeIcon className="h-4 w-4 mr-2" /> Watch on YouTube
          </a>
        )}
        {source.blogUrl && (
          <a
            id={`knowledge-link-blog-${source.id}`}
            href={source.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => onLogClick(`knowledge-link-blog-${source.id}`, 'a', e.currentTarget.textContent)}
            className="flex items-center text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
            title="Read more about this in the official blog post"
          >
            <BlogIcon className="h-4 w-4 mr-2" /> Read Blog Post
          </a>
        )}
      </div>
    </div>
  );
};

export default KnowledgeCard;