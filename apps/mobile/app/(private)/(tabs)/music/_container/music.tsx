import { useEffect, useState } from 'react';

import { MusicSection } from '@/components/section/private/music/music.section';
import { useMusic } from '@/hooks/service/Music/useMusic';
import { nativeAudioService } from '@/service/audio.service';

const FALLBACK_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export function MobileMusicContainer() {
  const { query } = useMusic();
  const { data: playlists = [], isLoading, isError, refetch, isFetching } = query.getPlayList();

  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    void nativeAudioService.setupAudioMode();
    return () => {
      void nativeAudioService.stopTrack();
    };
  }, []);

  const handlePlaySample = (id: string, audioUrl?: string | null) => {
    if (currentTrack === id && isPlaying) {
      void nativeAudioService.pauseTrack();
      setIsPlaying(false);
    } else if (currentTrack === id && !isPlaying) {
      void nativeAudioService.resumeTrack();
      setIsPlaying(true);
    } else {
      setCurrentTrack(id);
      setIsPlaying(true);
      // Sample audio stream untuk demonstrasi audio player native
      void nativeAudioService.playTrack(audioUrl ?? FALLBACK_AUDIO_URL);
    }
  };

  const handleStop = () => {
    void nativeAudioService.stopTrack();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <MusicSection
      service={{
        playlists,
        isLoading,
        isError,
        isFetching,
        onRetry: () => refetch(),
        onPlaySample: handlePlaySample,
        onStop: handleStop,
      }}
      state={{
        currentTrack,
        isPlaying,
      }}
    />
  );
}
