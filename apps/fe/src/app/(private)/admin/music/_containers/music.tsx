'use client';

import { ExternalLink, Music2, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/atoms';
import { GhibliCard } from '@/components/molecules/ghibli-card';
import { PageHeader } from '@/components/molecules/page-header';
import { GhibliEmptyState } from '@/components/template/ghibli-empty-state';
import { useCreatePlaylist, useDeletePlaylist, usePlaylists } from '@/hooks/useApi/music';
import { useGsapStagger } from '@/hooks/useGsapStagger';

const DEFAULT_PLAYLISTS = [
  {
    title: "Joe Hisaishi — One Summer's Day",
    url: 'https://www.youtube.com/watch?v=TK1IjBko6kE',
  },
  {
    title: 'Ghibli Lo-Fi Beats',
    url: 'https://www.youtube.com/watch?v=BiqlZZddZEI',
  },
  {
    title: 'Merry-Go-Round of Life',
    url: 'https://www.youtube.com/watch?v=Ab8C8c7i15E',
  },
];

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes('spotify.com')) {
      return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    return null;
  } catch {
    return null;
  }
}

export default function MusicContainer() {
  const { data: playlists = [], isLoading } = usePlaylists();
  const createPlaylist = useCreatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const gridRef = useGsapStagger<HTMLDivElement>([playlists.length]);

  const embedUrl = useMemo(() => (activeUrl ? toEmbedUrl(activeUrl) : null), [activeUrl]);

  const handleAddDefaults = () => {
    DEFAULT_PLAYLISTS.forEach((p) => createPlaylist.mutate(p));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    createPlaylist.mutate(
      { title: title.trim(), url: url.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setUrl('');
        },
      },
    );
  };

  return (
    <div className="animate-in fade-in duration-700">
      <PageHeader
        title="Musik & Fokus"
        description="Playlist Joe Hisaishi dan lo-fi Ghibli untuk menemani sesi kerja."
      />

      {embedUrl && (
        <div className="ghibli-glass sticky top-20 z-30 mb-6 overflow-hidden rounded-2xl border-2 border-primary/20 p-3 md:static">
          <div className="mb-2 flex items-center gap-2 font-serif text-sm font-medium">
            <Music2 className="size-4 text-primary" /> Sedang diputar
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/20">
            <iframe
              src={embedUrl}
              title="Music player"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <GhibliCard className="mb-6">
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nama playlist"
            className="rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL YouTube / Spotify"
            className="rounded-xl border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            className="ghibli-btn sm:col-span-2"
            disabled={createPlaylist.isPending}
          >
            <Plus className="size-4" /> Tambah Playlist
          </Button>
        </form>
      </GhibliCard>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <GhibliEmptyState
          emoji="🎻"
          title="Belum ada playlist"
          description="Tambahkan musik favoritmu atau muat playlist Ghibli default."
        >
          <Button onClick={handleAddDefaults} className="ghibli-btn mt-4">
            Muat Playlist Ghibli
          </Button>
        </GhibliEmptyState>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <GhibliCard
              key={playlist.id}
              data-stagger-item
              className="cursor-pointer"
              onClick={() => setActiveUrl(playlist.url)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-medium">{playlist.title}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{playlist.url}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={playlist.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist.mutate(playlist.id);
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </GhibliCard>
          ))}
        </div>
      )}
    </div>
  );
}
