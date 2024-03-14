from django.db import models

# Create your models here.
class EventShow(models.Model):
    eventImage=models.ImageField(upload_to='Events')
    showName=models.CharField(max_length=200)
    showTiming=models.DateTimeField(auto_now_add=True)
    showPrice=models.IntegerField()
    showVenue=models.CharField(max_length=100)