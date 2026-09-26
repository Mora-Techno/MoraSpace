import { Audio } from "expo-av";

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
      console.warn("Gagal konfigurasi audio mode", e);
    }
  }

  public async playTrack(url: string) {
    try {
      await this.stopTrack();
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
      );
      this.sound = sound;
      this.isPlaying = true;
    } catch (error) {
      console.error("Gagal memutar audio track", error);
    }
  }

  public async pauseTrack() {
    if (this.sound && this.isPlaying) {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    }
  }

  public async resumeTrack() {
    if (this.sound && !this.isPlaying) {
      await this.sound.playAsync();
      this.isPlaying = true;
    }
  }

  public async stopTrack() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch {}
      this.sound = null;
      this.isPlaying = false;
    }
  }

  public getPlaybackStatus() {
    return { isPlaying: this.isPlaying };
  }
}

export const nativeAudioService = new NativeAudioService();
