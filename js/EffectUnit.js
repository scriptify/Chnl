import { functionsToValues, bindMethods, objToArray } from './util';


class EffectUnit {

  constructor(effectChain = {}, methods = {}, audioCtx) {
    this.audioCtx = audioCtx;
    this.effectChain = functionsToValues(effectChain);

    // Give all custom methods the effect chain as a default argument
    this.methods = bindMethods(methods, this.effectChain);
    this.isEffectUnit = true;

    this.setupEffectChain();
  }

  enable() {
    this.effectGain.gain.value = 1;
    this.directGain.gain.value = 0;
  }

  disable() {
    this.effectGain.gain.value = 0;
    this.directGain.gain.value = 1;
  }

  connect(node) {
    if(node.isEffectUnit) {
      this.output.connect(node.input);
    } else {
      // Common audioNode
      this.output.connect(node);
    }
  }

  setupEffectChain() {

    this.effectGain = this.audioCtx.createGain(); // Set to 1 ==> Effect is on; Set to 0 ==> Effect is off
    this.directGain = this.audioCtx.createGain(); // Set to 0 ==> Effect is on; Set to 1 ==> Effect is off

    this.output = this.audioCtx.createGain();
    this.input = this.audioCtx.createGain();

    this.input.connect(this.effectGain);
    this.input.connect(this.directGain);

    // Connect direct gain to ouput
    this.directGain.connect(this.output);

    // Initially turn on
    this.enable();

    // Connect the effectChain
    let effects = objToArray(this.effectChain);

    // Effect chain not empty?
    if(effects.length >= 1) {
      // Connect effect gain to first effect
      this.effectGain.connect( effects[0] );
      // Connect all other effect to the following effect
      for(let i = 0; i < (effects.length - 1); i++) {
        effects[i].connect(effects[i + 1]);
      }

      // Connect the last effect to the output gain
      effects[effects.length - 1].connect( this.output );
    }


  }

}

export default EffectUnit;
