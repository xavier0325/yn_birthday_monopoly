// 在文件顶部添加这个函数来获取正确的资源路径
function getAssetPath(path: string): string {
  // 使用 import.meta.env.BASE_URL 获取基础路径
  const base = import.meta.env.BASE_URL || '/';
  // 确保路径以 / 开头
  const assetPath = path.startsWith('./') ? path.slice(2) : path;
  // 组合基础路径和资源路径
  return `${base}${assetPath}`;
}

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private bgm: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private bgmEnabled: boolean = true;

  constructor() {
    this.initSounds();
    this.initBGM();
  }

  private initSounds() {
    // 游戏音效素材说明
    const soundFiles = {
      // 使用 getAssetPath 处理所有音频文件路径
      roll: getAssetPath('./sounds/roll.mp3'),
      move: getAssetPath('./sounds/move.mp3'),
      buy: getAssetPath('./sounds/buy.mp3'),
      money: getAssetPath('./sounds/money.mp3'),
      chance: getAssetPath('./sounds/chance.mp3'),
      birthday: getAssetPath('./sounds/birthday.mp3'),
      tax: getAssetPath('./sounds/tax.mp3'),
      win: getAssetPath('./sounds/win.mp3'),
      lose: getAssetPath('./sounds/win.mp3'),
      click: getAssetPath('./sounds/click.mp3'),
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';  // 预加载音频文件
      this.sounds[key] = audio;
    });
  }

  private initBGM() {
    // 使用 getAssetPath 处理背景音乐路径
    this.bgm = new Audio(getAssetPath('./sounds/bgm.mp3'));
    this.bgm.loop = true;  // 循环播放
    this.bgm.volume = 0.3; // 设置背景音乐音量为30%
  }

  // 播放指定音效
  play(sound: string) {
    if (!this.enabled) return;
    
    const audio = this.sounds[sound];
    if (audio) {
      audio.currentTime = 0;  // 重置播放位置
      audio.play().catch(() => {
        // 忽略自动播放限制错误
        // 注：某些浏览器限制自动播放，需要用户交互后才能播放声音
      });
    }
  }

  // 播放背景音乐
  playBGM() {
    if (!this.bgmEnabled || !this.bgm) return;
    this.bgm.play().catch(() => {
      // 忽略自动播放限制错误
    });
  }

  // 暂停背景音乐
  pauseBGM() {
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  // 切换背景音乐开关
  toggleBGM() {
    if (this.bgm) {
      if (this.bgm.paused) {
        this.bgmEnabled = true;
        this.bgm.play().catch(() => {});
      } else {
        this.bgmEnabled = false;
        this.bgm.pause();
      }
    }
    return this.bgmEnabled;
  }

  // 切换所有音效开关
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // 设置音效开关状态
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // 设置背景音乐开关状态
  setBGMEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (enabled) {
      this.playBGM();
    } else {
      this.pauseBGM();
    }
  }

  // 停止指定音效
  stop(sound: string) {
    const audio = this.sounds[sound];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

// 导出单例实例
export const soundManager = new SoundManager(); 