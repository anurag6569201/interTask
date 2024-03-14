from django.shortcuts import render
from .forms import EventForm
from .models import EventShow
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.urls import reverse

# Create your views here.
def index(request):
    eventShows = EventShow.objects.all()
    eventShowsUser = EventShow.objects.filter(user=request.user)
    liked_events = []
    
    if request.user.is_authenticated:
        liked_events = EventShow.objects.filter(likes=request.user)
    
    context = {
        'eventShow': eventShows,
        'eventShowsUser': eventShowsUser,
        'liked_events': liked_events,
    }

    return render(request, "main/index.html", context)

def ErrorPage(request):
    return render(request,"main/error.html")

def addShow(request):
    if request.method == 'POST':
        Eform = EventForm(request.POST, request.FILES)
        if Eform.is_valid():
            event = Eform.save(commit=False)
            event.user = request.user
            event.save()
            return redirect('core:index') 
    else:
        Eform = EventForm()

    context = {
        'Eform': Eform,
    }
    return render(request, "main/addShow.html", context)

class LikeEvent(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        event = get_object_or_404(EventShow, pk=self.kwargs['event_id'])
        event.like(request.user)
        return HttpResponseRedirect(reverse('core:index'))