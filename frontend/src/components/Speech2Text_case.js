import React from 'react'
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const Speech2Text_case = (note) => {
    let [decoded_result,decoded_result_set] = useState(null);
    useEffect(()=>{
        var audio_buffer;
        var audio_buffer_length;
        var recNode;
        var micNode;
        var context;
        var length_index = 0;
        const canvas = document.querySelector(".vis");
        const canvasCtx = canvas.getContext("2d");
        var canvas_staus = 'continue';
        document.getElementById('recorder-log').style.color = "#E32484";
        document.getElementById('recorder-log').innerHTML ="Turn on the micro";
        async function startMicro () {
            
            document.getElementById("run-micro-button").disabled = true;
            document.getElementById('recorder-log').style.color = "#E32484";
            document.getElementById('recorder-log').innerHTML ="Fire away!";
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
            console.log('start');

            recNode.port.postMessage({
                message: 'start_recording',
            })
            document.getElementById("start-record-button").disabled = true;
            document.getElementById("stop-record-button").disabled = false;
            document.getElementById("predict-record-button").disabled = true;
            document.getElementById('recorder-log').style.color = "#E32484";
            document.getElementById('recorder-log').innerHTML ="Recording...";
            const visualizerCallback = visualizer(recNode.port);
            
            recNode.port.onmessage = (event) => {
                visualizerCallback(event);
            }
            
        }
        async function stopRecord(){
            const recordingCallback = handleRecording(recNode.port);
            recNode.port.postMessage({
                message: 'get_audio_buffer',
            })
            recNode.port.onmessage = (event) => {
                recordingCallback(event);
            }
            document.getElementById("stop-record-button").disabled = true;
            document.getElementById("predict-record-button").disabled = false;
            document.getElementById("start-record-button").disabled = false;
            document.getElementById("clear-record-button").disabled = false;
            document.getElementById('recorder-log').style.color = "#E32484";
            document.getElementById('recorder-log').innerHTML ="Let's recognize";
        }
        async function getPredict(){
            var fd = new FormData();
            fd.append('binary_data', new Blob([audio_buffer.buffer]));
            fd.append('waveform_length', audio_buffer_length);
            console.log(audio_buffer.buffer);
            const response = await fetch(`/api/note/${note.note}/`,
            {
                method: 'POST',
                body: fd,
            }).catch(error => {
                console.log(error)
            })
            await response.json().then((data) => {
                document.getElementById('decoded_result').style.color = "#491F99"
                document.getElementById('decoded_result').innerHTML = data.result;
                document.getElementById('recorder-log').style.color = "#E32484";
                document.getElementById('recorder-log').innerHTML ="Clear or continue session?";
            }).catch(error => {
                console.log(error)
            })
        }
        async function clearSession(){
            recNode.port.postMessage({
                message: 'clear_session',
            })
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            audio_buffer = null;
            audio_buffer_length = 0;
            length_index = 0;
            canvas_staus = 'clear';
            document.getElementById('decoded_result').innerHTML = '';
            document.getElementById("predict-record-button").disabled = true;
            document.getElementById("stop-record-button").disabled = true;
            document.getElementById('recorder-log').style.color = "#E32484";
            document.getElementById('recorder-log').innerHTML ="run 'Start' for recording";
        }
        function handleRecording(recording_port){

            const recordingEventCallback = async (event) => {
                if (event.data.message == 'get_audio_buffer'){
                    console.log(event.data);
                    audio_buffer = event.data.buffer_array;
                    audio_buffer_length = event.data.buffer_length;
                }
                
            };
            return recordingEventCallback;
        
        }
        function visualizer(recording_port){
            let width = canvas.width;
            let height = canvas.height;
            const visualizerEventCallback = async (event) => {
                if(event.data.message == "get_vis_value"){
                    let visdatamax = event.data.vis_value_max;
                    let visdatamin = event.data.vis_value_min;
                    draw(visdatamax,visdatamin,event);
                }

            };
            function draw(datamax, datamin,ev){
                if(canvas_staus == "clear"){
                    canvas_staus = "continue";
                    canvasCtx.beginPath();                    
                }
                canvasCtx.fillStyle = "rgb(255,255,255)"; 
                canvasCtx.fillRect(0,0,width,height);
                canvasCtx.lineWidth = 1;
                let freq_height_max = 0.05*(height/2)+Math.round((height/2) * datamax);
                let freq_height_min = -0.05*(height/2)+Math.round((height/2) * datamin);
                canvasCtx.moveTo(length_index, height/2);
                canvasCtx.lineTo(length_index, height/2-freq_height_max);
                canvasCtx.moveTo(length_index, height/2);
                canvasCtx.lineTo(length_index, height/2-freq_height_min);
                length_index+=1;
                canvasCtx.closePath();
                canvasCtx.stroke();
                //requestAnimationFrame(draw);
            }
            return visualizerEventCallback;
        }
        return () => {
            var buttonElemRunMicro = document.getElementById("run-micro-button");
            buttonElemRunMicro.addEventListener("click", startMicro);
            var buttonElemStart = document.getElementById("start-record-button");
            buttonElemStart.addEventListener("click", startRecord);
            var buttonElemStop = document.getElementById("stop-record-button");
            buttonElemStop.addEventListener("click", stopRecord);
            var buttonElemPredict = document.getElementById("predict-record-button");
            buttonElemPredict.addEventListener("click", getPredict);
            var buttonElemClear = document.getElementById("clear-record-button");
            buttonElemClear.addEventListener("click", clearSession);
        }
    },[]);

    return (
        <div className="container">
                <div className="row p-3 border">
                    <div className="container" id="recorder-app-interface">
                        <div className="col">
                            <div className="row border" id="div-labelWindow">
                                <div className="col border"><h3 align="center" id="labelWindow">Lets start recording</h3></div>
                            </div>
                            <div className="row border" id="div-RecVisPred" align="center">
                                <div className="col border" id="div-recorder-log">
                                    <h2 id="recorder-log"></h2>
                                </div>
                                <div className="col border">
                                    <canvas className="vis" align="center" style={{width:'100%', height:'100%', border: 'solid 1px black'}} ></canvas>
                                </div>
                                <div className="col border" id="div-prediction-log">
                                    <div className="container">
                                        <div className="row border">
                                            <div className="col">
                                                <h3 align="center">Prediction:</h3>
                                            </div>
                                        </div>
                                        <div className="row border">
                                            <div className="col">
                                                <h4 align="center" id="decoded_result"></h4>
                                            </div>
                                        </div>
                                        <div className="row p-3"><h4 id="predicted-text"></h4></div>
                                    </div>
                                </div>
                            </div>
                            <div className="row border" id="div-button-menu">
                                <div className="col p-1" align="center" id="div-start-record-button">
                                    <div className=" p-1" align="center" style={{width:'50%'}} >
                                        <button type="button" className="btn btn-success" id="run-micro-button">Micro</button>
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