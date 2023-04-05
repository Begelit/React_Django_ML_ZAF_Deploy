import numpy as np
#from PIL import Image
import cv2
from tensorflow import keras
import struct
import torchaudio
import torch
import torchaudio.transforms as T
from omegaconf import OmegaConf
from Models.Seech2Text.lib_stt.src.silero.utils import (init_jit_model, 
                       split_into_batches,
                       read_audio,
                       read_batch,
                       prepare_model_input)

from rest_framework.parsers import JSONParser
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Model_V1 
from .serializer import ModelV1Serializer

#brain_tumor_model = keras.models.load_model('Models/Brain Tumor Detection/model/tf_model.h5')

device = torch.device('cpu')  # gpu also works, but our models are fast enough for CPU
s2t_models = OmegaConf.load('Models/Seech2Text/lib_stt/models.yml')
s2t_model, s2t_decoder = init_jit_model(s2t_models.stt_models.en.latest.jit, device=device)

# Create your views here.
@api_view(['GET'])
def getRouters(request):
    modelv1_obj = Model_V1.objects.all()
    print(modelv1_obj)
    serializer = ModelV1Serializer(modelv1_obj, many = True)
    return Response(serializer.data)
@api_view(['GET','POST'])
def getModelNote(request, pk):
    if request.method == 'GET':
        modelv1_obj = Model_V1.objects.filter(id=pk)
        serializer = ModelV1Serializer(modelv1_obj, many = True)
        return Response(serializer.data)
    elif request.method == 'POST':
        ### BRAIN TUMOR DETECTION ###
        if pk == '4':
            print("KEY", pk, type(pk))
            global brain_tumor_model
            buf_arr = request.FILES['image'].read()
            dec_arr  = cv2.imdecode(np.fromstring(buf_arr, np.uint8), cv2.IMREAD_COLOR)
            cv2.imwrite('test.jpg', dec_arr)
            cv2_img_no = cv2.imread('test.jpg')
            resized_arr = cv2.resize(cv2_img_no, dsize=(200, 200), interpolation=cv2.INTER_CUBIC)
            input_tensor_no = resized_arr[np.newaxis,...]
            print(input_tensor_no)
            output_tensor = brain_tumor_model.predict(input_tensor_no, batch_size=1)
            print(output_tensor)
            armax_result = np.argmax(output_tensor, axis=1)[0]
            decoded_result = 'No Tumor' if armax_result == 0 else 'Yes Tumor'
            print(decoded_result)
            return Response({'status': 'success', 'result': decoded_result})
        ### SPEECH TO TEXT ###
        if pk == '6':
            global s2t_model, s2t_decoder
            buffer_bytes_array = request.FILES['binary_data'].read()
            buffer_length = int(request.data['waveform_length'])
            waveform_signal = signal_chunk_list = [struct.unpack("f",buffer_bytes_array[index*4:index*4+4])[0] for index in range(buffer_length)]
            waveform_signal_tensor=torch.Tensor([waveform_signal])
            resampler = T.Resample(48000, 16000, dtype=waveform_signal_tensor.dtype)
            resampled_waveform = resampler(waveform_signal_tensor)
            output = s2t_model(resampled_waveform)
            for example in output:
                decoded_output = s2t_decoder(example.cpu())
                print(decoded_output)
            return Response({'status': 'success', 'result': decoded_output})
