class RecorderProcessor extends AudioWorkletProcessor{
  constructor(options) {
      super();

      //this.sample_rate = 0;
      //this.buffer_length = 0;
      //this.number_of_channels = 0;
      //this.visualizer_bufferLength = 0;
      this.prop_= 0;

      if (options && options.processorOptions) {

          const {
            prop,
          } = options.processorOptions;
          this.prop_ = prop; 

      }

      
      this.recording_chunk = new Float32Array(128);
      this.current_buffer = new Float32Array(128);
      this.new_arr = new Float32Array(128);
      this.current_bufferLength = 0;
      /*
      this.current_recording_buffer = new Array(1).fill(new Float32Array(1));
      this.current_bufferLength = 1;
      this.isStartRecord = false;
      this.new_recording_buffer;
      */
  }
  process(inputs, outputs){
    /*
    for (let input = 0; input < 1; input++) {
        for (let channel = 0; channel < this.number_of_channels; channel++) {
            for (let sample = 0; sample < inputs[input][channel].length; sample++) {
                this.recording_chunk[channel][sample] = inputs[input][channel][sample];
            }
        }
    }*/
    if (this.isStartRecord == true){
        for (let sample = 0; sample < inputs[0][0].length; sample++){
            this.recording_chunk[sample] = inputs[0][0][sample];
        }
        if (this.current_bufferLength == 0){
            this.current_buffer.set(this.recording_chunk, this.current_bufferLength);
            this.current_bufferLength+=128;
        } else {
            this.new_arr = new Float32Array(this.current_bufferLength);
            this.new_arr.set(this.current_buffer,0);
            this.current_buffer = new Float32Array(this.current_bufferLength+128);
            this.current_buffer.set(this.new_arr,0);
            this.current_buffer.set(this.recording_chunk,this.current_bufferLength);//.set(this.recording_chunk,this.current_bufferLength+128);
            this.new_arr = null;
            //this.new_arr.set(this.recording_chunk,this.current_bufferLength+128);
            this.current_bufferLength+=128;
            /*
            if (this.current_bufferLength%24000 == 0){
                this.port.postMessage({
                    message: 'send_ready_bufferArray',
                    //buffer_array: this.recording_chunk,
                    buffer_array_v2: this.current_buffer,
                })
            }
            */

        }
    }

    /*
    this.port.postMessage({
        message: 'send_ready_bufferArray',
        buffer_elem: this.recording_chunk,
    });
    */
    this.port.onmessage  = (event) => {
        if (event.data.message == 'start_recording'){
            this.isStartRecord = true;
        }
        if (event.data.message == 'get_audio_buffer'){
            this.isStartRecord = false;
            this.port.postMessage({
                message: 'get_audio_buffer',
                buffer_array: this.current_buffer,
            });
        }
        /*
        if (event.data.message == 'end_recording'){
            this.isStartRecord = false;
            this.port.postMessage({
                message: 'send_ready_bufferArray',
                buffer_array: this.current_recording_buffer,
            })
        }*/

    }
/*
    if(this.isStartRecord == true){
        if (this.current_bufferLength == 0){
            this.current_buffer.set(this.recording_chunk, this.current_bufferLength);
            this.current_bufferLength+=128;
        } else {
            this.new_arr = new Float32Array(this.current_bufferLength);
            this.new_arr.set(this.current_buffer,0);
            this.current_buffer = new Float32Array(this.current_bufferLength+128);
            this.current_buffer.set(this.new_arr,0);
            this.current_buffer.set(this.recording_chunk,this.current_bufferLength);//.set(this.recording_chunk,this.current_bufferLength+128);
            this.new_arr = null;
            this.current_bufferLength+=128;

        }
        // = new Array(1).fill(new Float32Array(128));
        //Создали новый массив
        //this.new_recording_buffer = new Array(1).fill(new Float32Array(this.current_bufferLength+128));

        //this.new_recording_buffer[0].set(this.current_recording_buffer[0],this.current_bufferLength);
        //this.new_recording_buffer[0].set(this.recording_chunk[0],this.current_bufferLength+128);
        //this.current_recording_buffer = new Array(1).fill(this.new_recording_buffer[0]); //= new Array(1).fill(new Float32Array(128));
        //this.current_bufferLength+=128;

    }
*/
    





      /*
      if(this.current_bufferLength+128 < this.buffer_length){
          this.current_bufferLength += 128;
      } else {
          this.port.postMessage({
              message: 'MAX_BUFFER_LENGTH',
              buffer_array: this._recording_buffer,
              //sample: outputs[0][0],
              //mfcc_count: this.mfcc_count,
          });
          this.current_bufferLength = 0;
          this._recording_buffer = null;
          this._recording_buffer = new Array(this.number_of_channels)
              .fill(new Float32Array(this.buffer_length));
      }
      
      if (this.current_visualizer_bufferLength + 128 < this.visualizer_bufferLength){
          this.current_visualizer_bufferLength += 128;
      } else {
          this.port.postMessage({
              message: 'MAX_VISUALIZER_BUFFER_LENGTH',
              recording_length: this.current_visualizer_bufferLength + 128,
              buffer_array: this.visualizer_recording_buffer,
          });
          this.current_visualizer_bufferLength = 0;
          this.visualizer_recording_buffer = null;
          this.visualizer_recording_buffer = new Array(this.number_of_channels)
              .fill(new Float32Array(this.visualizer_bufferLength));
      }*/

      return true;
  }
}

registerProcessor("recorder_worklet", RecorderProcessor);