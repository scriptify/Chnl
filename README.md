# Chnl - one channel, all effects.

## Why would I ever want a _Chnl_?

I needed something with a LOT of audio effects integrated which can be manipulated in many different aspects. And I needed to use this in many different ways: Every native AudioNode should be able to connect to it as it would be a normal AudioNode, but also other Chnls should be able to connect to another Chnl.
So I could simply and intuitively create audio graphs with a set of effects.
No matter if I connect a song, mic input or even a synthesizer.

__Therefore I created _Chnl_.__
## Installation
Via npm
```
npm i webaudio-chnl -S
```


## Usage
It's really simple. And intuitive.
### Creating a __Chnl__
You can create a new _Chnl_ instance by constructing the _Chnl_-class with your _AudioContext object_ as the 1° parameter.
```javascript
new Channel(audioCtx)
```

### Effects
You have access to __a lot of effects__.
Under the hood, _Chnl_ uses the [webaudio-effect-units-collection](https://github.com/scriptify/webaudio-effect-units-collection) module. So you have access to a lot of effects which can be enabled and disabled.

You can access the effects with the _effects_ property of your _Chnl_ instance.


_Example_
```javascript
const channel = new Chnl(audioCtx);
const {
  gain,
  chorus,
  delay,
  phaser,
  overdrive,
  compressor,
  lowpass,
  highpass,
  tremolo,
  wahwah,
  bitcrusher,
  moog,
  pingPongDelay
} = channel.effects;
gain.methods.set(0.35);
```

### Connecting
#### Connect to a Chnl
You can connect any _normal AudioNode_ to a _Chnl_:
```javascript
const channel = new Chnl(audioCtx);
const gain = audioCtx.createGain();
gain.connect(channel);
```
But you can also connect a _Chnl_ to a _normal AudioNode_:
```javascript
const channel = new Chnl(audioCtx);
const gain = audioCtx.createGain();
channel.connect(gain);
```
You can even connect one _Chnl_ to another one:
```javascript
const channel1 = new Chnl(audioCtx);
const channel2 = new Chnl(audioCtx);
channel1.connect(channel2);
```
Have fun connecting!
