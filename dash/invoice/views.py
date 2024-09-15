from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url="/login/")
def invoice(request):
    return render(request, 'invoice/invoice.html')
