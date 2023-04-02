import React from 'react'
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const Speech2Text_case = (note) => {
    let [buffer_array_state,buffer_array_state_set] = useState(null);
    useEffect(()=>{
        var recNode;
        var micNode;
        var context;
        async function startMicro () {
            
            document.getElementById("run-micro-button").disabled = true;
            let actx = new (window.AudioContext || window.webkitAudioContext)();

            if (actx.state === 'suspended') {
                await actx.resume();
            }
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            const micSourceNode = await actx.createMediaStreamSource(micStream);
            const recordingProperties = {
                prop: null,

            };
            const recordingNode =  await setupRecordingWorkletNode(recordingProperties, actx);

            micSourceNode
            .connect(recordingNode)
            //.connect(monitorNode)
            .connect(actx.destination);

            recNode = recordingNode;
            micNode = micSourceNode;
            context = actx;

            document.getElementById("start-record-button").disabled = false;

            async function setupRecordingWorkletNode(recordingProperties, actx) {
                
                await actx.audioWorklet.addModule('../modules/Speech2Text/worklets/awp.js');
            
                const WorkletRecordingNode = new AudioWorkletNode(
                    actx,
                    'recorder_worklet',
                    {
                        processorOptions: recordingProperties,
                    },
                );
            
                return WorkletRecordingNode;
            }
            
            
        }
        async function startRecord(){
            //console.log(recNode);
            //const recordingCallback = handleRecording(recNode.port);
            console.log('start');

            recNode.port.postMessage({
                message: 'start_recording',
                //buffer_array: this._recording_buffer,
                //sample: outputs[0][0],
                //mfcc_count: this.mfcc_count,
            })
            document.getElementById("start-record-button").disabled = true;
            document.getElementById("stop-record-button").disabled = false;
            /*
            recNode.port.onmessage = (event) => {
                //console.log(event.data);
                recordingCallback(event);
                //visualizerCallback(event);
            }
            */
        }
        async function stopRecord(){
            const recordingCallback = handleRecording(recNode.port);
            recNode.port.postMessage({
                message: 'get_audio_buffer',
                //buffer_array: this._recording_buffer,
                //sample: outputs[0][0],
                //mfcc_count: this.mfcc_count,
            })
            recNode.port.onmessage = (event) => {
                //console.log(event.data);
                recordingCallback(event);
                //visualizerCallback(event);
            }
            document.getElementById("stop-record-button").disabled = true;
            document.getElementById("predict-record-button").disabled = false;
        }
        function handleRecording(recording_port){

            const recordingEventCallback = async (event) => {
                if (event.data.message == 'get_audio_buffer'){
                    console.log(event.data.buffer_array);
                    buffer_array_state_set(event.data.buffer_array); 
                }
                
            };
            return recordingEventCallback;
        
        }
        return () => {
            var buttonElemRunMicro = document.getElementById("run-micro-button");
            buttonElemRunMicro.addEventListener("click", startMicro);
            var buttonElemStart = document.getElementById("start-record-button");
            buttonElemStart.addEventListener("click", startRecord);
            var buttonElemStop = document.getElementById("stop-record-button");
            buttonElemStop.addEventListener("click", stopRecord);
        }
    },[buffer_array_state]);

    return (
        <div className="container">
                <div className="row p-3 border">
                    <div className="container" id="recorder-app-interface">
                        <div className="col">
                            <div className="row border" id="div-labelWindow">
                                <div className="col border"><h3 align="center" id="labelWindow">Lets start recording</h3></div>
                            </div>
                            <div className="row border" id="div-RecVisPred" align="center">
                                <div className="col border" id="div-recorder-log"></div>
                                <div className="col border">
                                    <canvas className="vis" align="center" style={{width:'100%', height:'100%', border: 'solid 1px black'}} ></canvas>
                                </div>
                                <div className="col border" id="div-prediction-log">
                                    <div className="container">
                                        <div className="row border">
                                            <h3 align="center">Prediction:</h3>
                                        </div>
                                        <div className="row p-3"><h4 id="predicted-text"></h4></div>
                                    </div>
                                </div>
                            </div>
                            <div className="row border" id="div-button-menu">
                                <div className="col p-1" align="center" id="div-start-record-button">
                                    <div className=" p-1" align="center" style={{width:'50%'}} >
                                        <button type="button" className="btn btn-success" id="run-micro-button">Run Micro</button>
                                    </div>
                                </div>
                                <div className="col p-1" align="center" id="div-start-record-button">
                                    <div className=" p-1" align="center" style={{width:'50%'}} >
                                        <button type="button" className="btn btn-success" id="start-record-button" disabled>Start</button>
                                    </div>
                                </div>
                                <div className="col p-1" align="center" id="div-stop-record-button">
                                    <div className=" p-1" align="center" style={{width:'50%'}} >
                                        <button type="button" className="btn btn-danger" id="stop-record-button" disabled>Stop</button>
                                    </div>
                                </div>
                                <div className="col p-1" align="center" id="div-predict-record-button">
                                    <div className=" p-1" align="center" style={{width:'50%'}} >
                                        <button type="button" className="btn btn-secondary" id="predict-record-button" disabled>Predict</button>
                                    </div>
                                </div>
                                <div className="col p-1" align="center" id="div-clear-record-button">
                                    <div className=" p-1" align="center" style={{width:'50%'}} >
                                        <button type="button" className="btn btn-secondary" id="clear-record-button" disabled>Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Speech2Text_case