from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader, TemplateDoesNotExist
from django.urls import reverse
from django.shortcuts import render,redirect
import logging
from authentication.models import OptionalEmail

logger = logging.getLogger(__name__)

@login_required(login_url='authentication:login')
def index(request):
    return render(request, 'home/index.html')

@login_required(login_url='authentication:login')
def pages(request):
    context = {}
    try:
        load_template = request.path.strip('/').split('/')[-1]
        
        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        
        context['segment'] = load_template
        
        # Load and render the template
        html_template = loader.get_template(f'home/{load_template}')
        return HttpResponse(html_template.render(context, request))

    except TemplateDoesNotExist:
        # Handle case where the template does not exist
        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except Exception as e:
        # Log the exception (for debugging purposes) and return a server error page
        logger.error(f"An error occurred: {e}", exc_info=True)
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))


def profile(request):
    optional_emails = OptionalEmail.objects.filter(user=request.user)
    return render(request, 'home/profile.html',{'optional_emails': optional_emails})


from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib import messages

@login_required
def update_email_view(request):
    if request.method == "POST":
        new_email = request.POST.get("email")
        request.user.email = new_email
        request.user.save()
        messages.success(request, "Email updated successfully!")
        return redirect('home:profile')  # Redirect to profile view

    return render(request, 'home/profile.html')


@login_required
def change_password_view(request):
    if request.method == "POST":
        secret_number = request.POST.get("secret_number")
        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")

        user = request.user

        # Check if the secret number is correct
        if user.secret_number != secret_number:
            messages.error(request, "Invalid secret number.")
            return redirect('home:profile')

        # Check if new passwords match
        if new_password != confirm_password:
            messages.error(request, "New passwords do not match.")
            return redirect('home:profile')

        # Change the password
        user.set_password(new_password)
        user.save()
        messages.success(request, "Password changed successfully!")
        return redirect('home:profile')

    return render(request, 'home/profile.html')


@login_required
def add_optional_email_view(request):
    if request.method == "POST":
        optional_email = request.POST.get("optional_email")

        # Check if the email already exists
        if OptionalEmail.objects.filter(user=request.user, email=optional_email).exists():
            messages.error(request, "This email is already added.")
            return redirect('home:profile')

        # Create a new OptionalEmail entry
        OptionalEmail.objects.create(user=request.user, email=optional_email)
        messages.success(request, "Optional email added successfully!")
        return redirect('home:profile')

    return render(request, 'home/profile.html')
