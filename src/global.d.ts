interface Window {
  wallpaperPropertyListener:
    | {
        applyUserProperties: Function;
      }
    | undefined;
  wallpaperRegisterAudioListener: Function;
}

declare let window: Window;
