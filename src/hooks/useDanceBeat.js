import { useCallback, useEffect, useRef } from "react";

function createNoiseBuffer(context) {
  const buffer = context.createBuffer(
    1,
    context.sampleRate,
    context.sampleRate,
  );
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playKick(context, output, time) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(132, time);
  oscillator.frequency.exponentialRampToValueAtTime(44, time + 0.13);
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(0.7, time + 0.006);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.17);
  oscillator.connect(envelope);
  envelope.connect(output);
  oscillator.start(time);
  oscillator.stop(time + 0.18);
}

function playNoise(context, buffer, output, time, frequency, volume, duration) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.setValueAtTime(frequency, time);
  envelope.gain.setValueAtTime(volume, time);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(output);
  source.start(time);
  source.stop(time + duration);
}

function playBass(context, output, time, frequency) {
  const oscillator = context.createOscillator();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, time);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(220, time);
  envelope.gain.setValueAtTime(0.0001, time);
  envelope.gain.exponentialRampToValueAtTime(0.16, time + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.24);
  oscillator.connect(filter);
  filter.connect(envelope);
  envelope.connect(output);
  oscillator.start(time);
  oscillator.stop(time + 0.25);
}

export default function useDanceBeat() {
  const contextRef = useRef(null);
  const outputRef = useRef(null);
  const timerRef = useRef(0);
  const closeTimerRef = useRef(0);

  const stopBeat = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = 0;

    const context = contextRef.current;
    const output = outputRef.current;
    contextRef.current = null;
    outputRef.current = null;

    if (!context || context.state === "closed") return;

    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    if (output) {
      output.gain.cancelScheduledValues(context.currentTime);
      output.gain.setTargetAtTime(0, context.currentTime, 0.025);
    }
    closeTimerRef.current = window.setTimeout(() => {
      if (context.state !== "closed") context.close();
      closeTimerRef.current = 0;
    }, 140);
  }, []);

  const startBeat = useCallback(async () => {
    const AudioContextConstructor =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return false;
    if (contextRef.current) return true;

    try {
      const context = new AudioContextConstructor();
      const output = context.createGain();
      const limiter = context.createDynamicsCompressor();
      const noiseBuffer = createNoiseBuffer(context);
      limiter.threshold.setValueAtTime(-4, context.currentTime);
      limiter.knee.setValueAtTime(6, context.currentTime);
      limiter.ratio.setValueAtTime(8, context.currentTime);
      limiter.attack.setValueAtTime(0.003, context.currentTime);
      limiter.release.setValueAtTime(0.15, context.currentTime);
      output.gain.setValueAtTime(1.5, context.currentTime);
      output.connect(limiter);
      limiter.connect(context.destination);
      contextRef.current = context;
      outputRef.current = output;

      await context.resume();

      let step = 0;
      let nextTime = context.currentTime + 0.04;
      const stepLength = 60 / 104 / 2;
      const bassNotes = [55, 55, 65.41, 73.42];

      function schedule() {
        if (context.state !== "running") return;
        const horizon = context.currentTime + 0.12;

        while (nextTime < horizon) {
          const position = step % 8;
          if (position === 0 || position === 4) {
            playKick(context, output, nextTime);
          }
          if (position === 2 || position === 6) {
            playNoise(context, noiseBuffer, output, nextTime, 1400, 0.16, 0.15);
          }
          if (position % 2 === 0) {
            const note = bassNotes[Math.floor(position / 2)];
            playBass(context, output, nextTime, note);
            playNoise(
              context,
              noiseBuffer,
              output,
              nextTime,
              7200,
              0.035,
              0.045,
            );
          }
          step += 1;
          nextTime += stepLength;
        }

        timerRef.current = window.setTimeout(schedule, 45);
      }

      schedule();
      return true;
    } catch {
      stopBeat();
      return false;
    }
  }, [stopBeat]);

  useEffect(() => () => stopBeat(), [stopBeat]);

  return { startBeat, stopBeat };
}
