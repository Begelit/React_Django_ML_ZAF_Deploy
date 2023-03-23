from django.db import models

class Model_V1(models.Model):
    body = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.body
# Create your models here.
