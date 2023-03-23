from rest_framework.serializers import ModelSerializer
from .models import Model_V1

class ModelV1Serializer(ModelSerializer):
    class Meta:
        model = Model_V1
        fields = '__all__'#['body', 'date']