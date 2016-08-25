import EffectUnit from './EffectUnit';



const main = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const gainEff = new EffectUnit(
  {
    gain: audioCtx.createGain()
  },
  {
    mute: effectChain => {
      effectChain.gain.gain.value = 0;
    },
    unmute: effectChain => {
      effectChain.gain.gain.value = 1;
    }
  }, audioCtx);

  const highpassEff = new EffectUnit(
    {
      highpass: () => {
        const hp = audioCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 1000;
        return hp;
      }
    },
    {
      more: effectChain => {
        effectChain.highpass.frequency.value += 100;
      },
      less: effectChain => {
        effectChain.highpass.frequency.value -= 100;
      }
    },
    audioCtx
  )

  const osci = audioCtx.createOscillator();
  osci.type = 'square';
  osci.frequency.value = 50;
  osci.connect(gainEff.input);

  gainEff.connect(highpassEff);

  highpassEff.connect(audioCtx.destination);

  //osci.start();

  let up = true;
  let c = 0;
  window.setInterval(() => {
    if(up) {
      c++;
      highpassEff.methods.more();
    } else {
      c--;
      highpassEff.methods.less();
    }

    if(c <= 0)
      up = true;

    if(c > 50)
      up = false;

  }, 100);

};

main();


export default EffectUnit;
