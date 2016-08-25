# webaudio effect unit
Simply create effects or other audio processors with the Web Audio API which can be enabled and disabled.

## Why?
Sometimes you want to include some effects or other audioprocessors in an audio graph which can be enabled and disabled.
E.g. a lowpass which can be toggled by the user.
This is currently not directly possile with the Web Audio API.
So The effect unit does this for you.

## How?
It's quite simple.
### Constructor
The constructor of the EffectUnit has the following signature:

    EffectUnit(effectChain: Object, methods: Object, audioCtx: AudioContext)

##### The effectChain-object
Each member of the effectChain-object will be a part of the audio graph, so they need to be a valid AudioNode. Note: You can also specify a function which returns one.
See the example at the bottom for more details.

##### The methods-object
Each member of the methods-object needs to be a function with exactly one argument: The effectChain object.
Here, you can alter the state of the AudioNodes you specified before.
See the example at the bottom for more details.

#### The AudioContext
As the 3° argument you need to specify the AudioContext you want to be used.

### Methods
Now, there are three simple methods which can be executed on an EffectUnit-object:

#### Enabling

    .enable()
  Enable the effect unit.

#### Disabling

    .disable()
  Disable the effect unit.

#### Connecting from an EffectUnit

    .connect(node: AudioNode || EffectUnit)
  Connect the EffectUnit to an AudioNode or to another EffectUnit-object.

#### Connecting to an EffectUnit

Ok, good to know. But how can I connect a simple AudioNode to the EffectUnit.
That's also quite simple.
Just use the input field of your EffectUnit-object.

    anAudioNode.connect( anEffectUnit.input  );

## Installation
Simple. Just type:

    npm i webaudio-effect-unit

## Example
Here a more advanced exampled to clarify everything:

```javascript
import EffectUnit from 'webaudio-effect-unit'; // Import the effect unit



const main = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Create an AudioContext

  const gainEff = new EffectUnit( // A simple gain node in an EffectUnit
  { // This is the effect chain
    gain: audioCtx.createGain() // It's only member is a simple gain node
  },
  { // Here, the methods can be specified
    mute: effectChain => { // All functions get passed the effectChain as the only argument
      effectChain.gain.gain.value = 0; // Here, you can do with the effectChain whatever you want. This is also the best place to change external, e.g. UI, state.
    },
    unmute: effectChain => { // Another method
      effectChain.gain.gain.value = 1;
    }
  }, audioCtx);

  const highpassEff = new EffectUnit(
    {
      highpass: () => { // This member of the effectChain is a function because some setup is needed. This is possible as long as the function returns a valid AudioNode
        const hp = audioCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 1000;
        return hp;
      }
    },
    { // Some more methods
      more: effectChain => {
        effectChain.highpass.frequency.value += 100;
      },
      less: effectChain => {
        effectChain.highpass.frequency.value -= 100;
      }
    },
    audioCtx
  )

  // Now I create an oscillator for a dummy input
  const osci = audioCtx.createOscillator();
  osci.type = 'square';
  osci.frequency.value = 50;
  // As you can see here, connecting to the EffectUnit is fairly simple:
  osci.connect(gainEff.input);

  // Now, this EffectUnit can be connected to another EffectUnit. In this case a gain is connected to a highpass.
  gainEff.connect(highpassEff);

  // Here, the last EffectUnit is connected to the speakers. Just as you are used to it:
  highpassEff.connect(audioCtx.destination);

  // Now start the oscillator and see if everything works
  osci.start();

  // This code isn't important for the example, it just creates a fading effect to the oscillator by constantly changing the frequency value of the highpass.
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

```
