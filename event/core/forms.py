from django import forms
from .models import EventShow

class EventForm(forms.ModelForm):
    class Meta:
        model = EventShow
        fields = ['eventImage', 'showName','showPrice','showVenue']
