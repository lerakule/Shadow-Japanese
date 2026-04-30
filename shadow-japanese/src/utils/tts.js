// 日语语音合成工具 - 使用 Web Speech API
class JapaneseTTS {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.japaneseVoice = null;
    this.isInitialized = false;
  }

  // 初始化 - 获取可用的语音列表
  init() {
    return new Promise((resolve) => {
      if (this.isInitialized) {
        resolve(this.japaneseVoice);
        return;
      }

      const loadVoices = () => {
        this.voices = this.synth.getVoices();
        // 优先选择日语语音
        this.japaneseVoice = this.voices.find(v => v.lang.includes('ja')) ||
                             this.voices.find(v => v.lang.includes('JP')) ||
                             this.voices[0];
        this.isInitialized = true;
        resolve(this.japaneseVoice);
      };

      // Chrome 需要等待 voiceschanged 事件
      if (this.voices.length === 0) {
        this.synth.addEventListener('voiceschanged', loadVoices);
        // 超时处理
        setTimeout(() => {
          if (!this.isInitialized) {
            loadVoices();
          }
        }, 1000);
      } else {
        loadVoices();
      }
    });
  }

  // 朗读文本
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      const {
        rate = 0.85,      // 播放速率（0.1 - 10）
        pitch = 1,        // 音调（0 - 2）
        volume = 1,       // 音量（0 - 1）
        onStart = null,
        onEnd = null,
        onError = null
      } = options;

      if (!this.synth) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // 停止当前朗读
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.japaneseVoice) {
        utterance.voice = this.japaneseVoice;
      }
      
      utterance.lang = 'ja-JP';
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = (event) => {
        if (event.error !== 'canceled') {
          if (onError) onError(event);
          reject(event);
        } else {
          resolve(); // 被取消不算错误
        }
      };

      this.synth.speak(utterance);
    });
  }

  // 停止朗读
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // 暂停朗读
  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  // 恢复朗读
  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  // 检查是否正在朗读
  isSpeaking() {
    return this.synth?.speaking || false;
  }

  // 获取估算的朗读时长（秒）
  estimateDuration(text, rate = 0.85) {
    // 日语平均语速：约 350字符/分钟（正常语速）
    // 考虑减速后，每分钟字符数 = 350 * rate
    const charsPerMinute = 350 * rate;
    const minutes = text.length / charsPerMinute;
    return Math.ceil(minutes * 60);
  }
}

// 导出单例
export const japaneseTTS = new JapaneseTTS();

// 导出类
export default JapaneseTTS;
