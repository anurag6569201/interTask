from django.shortcuts import render
from .forms import EventForm
from .models import EventShow
from django.shortcuts import redirect

# Create your views here.
def index(request):
    eventShows=EventShow.objects.all()
    context={
        'eventShow':eventShows,
    }
    return render(request,"main/index.html",context)

def ErrorPage(request):
    return render(request,"main/error.html")

def addShow(request):
    if request.method == 'POST':
        Eform = EventForm(request.POST, request.FILES)
        if Eform.is_valid():
            Eform.save()
            return redirect('core:index') 
    else:
        Eform = EventForm()

    context = {
        'Eform': Eform,
    }
    return render(request, "main/addShow.html", context)