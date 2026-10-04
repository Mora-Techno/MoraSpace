import { Audio } from 'expo-av';

class NativeAudioService {
  private sound: Audio.Sound | null = null;
  private isPlaying = false;

  public async setupAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (e) {
      if (__DEV__) console.warn('Gagal konfigurasi audio mode', e);
    }
  }

  public async playTrack(url: string) {
    try {
      await this.stopTrack();
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      this.sound = sound;
      this.isPlaying = true;
    } catch (error) {
      if (__DEV__) console.error('Gagal memutar audio track', error);
    }
  }

  public async pauseTrack() {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (e) {
      if (__DEV__) console.warn('Gagal pause audio track', e);
    }
  }

  public async resumeTrack() {
    try {
      if (this.sound && !this.isPlaying) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (e) {
      if (__DEV__) console.warn('Gagal resume audio track', e);
    }
  }

  public async stopTrack() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (e) {
        if (__DEV__) console.warn('Gagal stop audio track', e);
      }
      this.sound = null;
      this.isPlaying = false;
    }
  }

  public getPlaybackStatus() {
    return { isPlaying: this.isPlaying };
  }
}

export const nativeAudioService = new NativeAudioService();
