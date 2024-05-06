from django.db import models
from userauths.models import User

# Create your models here.
class EventShow(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='EventUser')
    eventImage=models.ImageField(upload_to='Events')
    showName=models.CharField(max_length=200)
    showTiming=models.DateTimeField(auto_now_add=True)
    showPrice=models.IntegerField()
    showVenue=models.CharField(max_length=100)

    likes = models.ManyToManyField(User, related_name='event_likes', blank=True)

    def like(self, user):
        if user in self.likes.all():
            self.likes.remove(user)
        else:
            self.likes.add(user)