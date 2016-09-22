import createEffects from 'webaudio-effect-units-collection';

export default class Chnl {
  input;
  output;
  effects;

  constructor(audioCtx) {
    this.input = audioCtx.createGain();
    this.output = audioCtx.createGain();
    this.effects = createEffects(audioCtx);
    this.setupGraph();
  }

  setupGraph() {
    const keys = Object.keys(this.effects);
    // Connect input to first effect
    this.input.connect( this.effects[keys[0]] );

    // Connect each effect to his 'neighbour'
    keys.forEach((key, i) => {
      const currEffect = this.effects[key];
      if(i < (keys.length - 1))
        currEffect.connect(this.effects[keys[i + 1]]);

      if(i > 0)
        currEffect.disable(); // Disable all effects but the gain (first effect) per default
    });

    // Connect the last effect to the output
    this.effects[keys[ keys.length - 1 ]].connect(this.output);


  }

  connect(node) {
    this.output.connect(node);
  }

}
