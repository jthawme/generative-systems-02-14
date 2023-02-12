type GetAudioFunc = (
  amt?: number,
  onAudio?: (averages: number[]) => void,
) => Promise<false | (() => void)>;

export const getAudio: GetAudioFunc = async (amt = 10, onAudio = () => {}) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const audioStream = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 128;

    const frequencyArray = new Uint8Array(analyser.frequencyBinCount);

    const frame = () => {
      analyser.getByteFrequencyData(frequencyArray);

      let slices = Math.floor(frequencyArray.length / amt);
      const averages = [];

      for (let i = 0; i < amt; i++) {
        averages.push(
          frequencyArray
            .slice(i * slices, (i + 1) * slices)
            .reduce((p, c) => p + c, 0) /
            slices /
            128,
        );
      }

      onAudio(averages);
    };

    let interval = setInterval(frame, 30);

    return () => {
      stream.getAudioTracks().forEach((tr) => tr.stop());
      clearInterval(interval);
    };
  } catch {
    return false;
  }
};
