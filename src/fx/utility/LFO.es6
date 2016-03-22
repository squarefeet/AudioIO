import "../../core/AudioIO.es6";
import Node from "../../core/Node.es6";

class LFO extends Node {
    constructor( io, cutoff = 5 ) {
        super( io, 1, 1 );

        var graph = this.getGraph();

        // Create nodes.
        graph.oscillator = this.io.createOscillatorBank();
        graph.phaseOffset = this.io.createPhaseOffset();
        graph.depth = this.context.createGain();
        graph.jitterDepth = this.context.createGain();
        // graph.jitterOscillator = this.io.createWhiteNoiseOscillator();

        // Zero-out the depth gain nodes so the value 
        // of the depth controls aren't multiplied.
        graph.depth.gain.value = 0;
        graph.jitterDepth.gain.value = 0;

        // Create controls
        this.controls.frequency = graph.oscillator.controls.frequency;
        this.controls.detune = graph.oscillator.controls.detune;
        this.controls.waveform = graph.oscillator.controls.waveform;
        this.controls.depth = this.io.createParam();
        this.controls.offset = graph.phaseOffset.controls.phase;
        this.controls.jitter = this.io.createParam();

        // Control connections.
        this.controls.frequency.connect( graph.phaseOffset.controls.frequency );
        this.controls.depth.connect( graph.depth.gain );
        this.controls.jitter.connect( graph.jitterDepth.gain );

        // Main LFO osc connections
        graph.oscillator.connect( graph.phaseOffset );
        graph.phaseOffset.connect( graph.depth );
        graph.depth.connect( this.outputs[ 0 ] );

        // Jitter connections
        // graph.jitterOscillator.connect( graph.jitterDepth );
        // graph.jitterDepth.connect( this.outputs[ 0 ] );


        this.setGraph( graph );
    }

    start( delay = 0 ) {
        this.getGraph().oscillator.start( delay );
    }
    stop( delay = 0 ) {
        this.getGraph().oscillator.stop( delay );
    }
}

AudioIO.prototype.createLFO = function( cutoff ) {
    return new LFO( this, cutoff );
};