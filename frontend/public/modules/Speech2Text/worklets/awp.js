class RecorderProcessor extends AudioWorkletProcessor{
  constructor(options) {
      super();

      this.prop_= 0;

      if (options && options.processorOptions) {

          const {
            prop,
          } = options.processorOptions;
          this.prop_ = prop; 

      }

      this.current_bufferLength = 0;
      this.recording_buffer = new Float32Array(60*48000);
      this.max_visVal = 0;
      this.min_visVal = 0;

  }
  process(inputs, outputs){

    if (this.isStartRecord == true){
        for (let sample = 0; sample < inputs[0][0].length; sample++){
            this.recording_buffer[this.current_bufferLength+sample] = inputs[0][0][sample];
            if(inputs[0][0][sample] > this.max_visVal){
                this.max_visVal = inputs[0][0][sample];
            }
            if(inputs[0][0][sample] < this.min_visVal) {
                this.min_visVal = inputs[0][0][sample];
            }
        }
        if(this.current_bufferLength%8192 == 0){
            this.port.postMessage({
                message: 'get_vis_value',
                vis_value_max: this.max_visVal,//Math.max.apply(Math,inputs[0][0]),
                vis_value_min: this.min_visVal,//Math.min.apply(Math,inputs[0][0]),
            });
            this.max_visVal = 0;
            this.min_visVal = 0;

        }
        this.current_bufferLength+=128;
        
    }

    this.port.onmessage  = (event) => {
        if (event.data.message == 'start_recording'){
            this.isStartRecord = true;
        }
        if (event.data.message == 'get_audio_buffer'){
            this.isStartRecord = false;
            this.port.postMessage({
                message: 'get_audio_buffer',
                buffer_array: this.recording_buffer.slice(0, this.current_bufferLength),
                buffer_length: this.current_bufferLength,
            });
        }
        if (event.data.message == 'clear_session'){
            this.isStartRecord = false;
            this.recording_buffer = new Float32Array(60*48000);
            this.current_bufferLength = 0;
            this.max_visVal = 0;
            this.min_visVal = 0;
        }


    }

      return true;
  }
}

registerProcessor("recorder_worklet", RecorderProcessor);