import numpy as np
#from PIL import Image
import cv2
from tensorflow import keras

from rest_framework.parsers import JSONParser
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Model_V1 
from .serializer import ModelV1Serializer

brain_tumor_model = keras.models.load_model('Models/Brain Tumor Detection/model/tf_model.h5')

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