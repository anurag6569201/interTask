from django.shortcuts import render, redirect
from .forms import UserRegisterForm
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.conf import settings
from django.contrib.auth import logout
from .utils import generate_otp, send_otp_email
from django.utils import timezone
from .models import OTP

User=settings.AUTH_USER_MODEL

def register_view(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST or None)
        if form.is_valid():
            new_user = form.save()
            username = form.cleaned_data.get("username")
            messages.success(request, f"Hey {username}, your account was created successfully")

            new_user = authenticate(username=form.cleaned_data['email'], 
                                    password=form.cleaned_data['password1'])
            
            login(request, new_user)
            return redirect("home:home")
    else:
        form=UserRegisterForm()

    context = {
        'form': form,
    }
    return render(request, 'accounts/register.html', context)

def login_view(request):
    if request.user.is_authenticated:
        messages.warning(request, "You are already logged in")
        return redirect('home:home')
    
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, email=email, password=password)
        if user is not None:
            # Generate OTP
            otp_code = generate_otp()
            OTP.objects.create(user=user, otp_code=otp_code)
            send_otp_email(user.email, otp_code)
            
            # Redirect to OTP verification page
            request.session['user_id'] = user.id
            return redirect('authentication:verify_otp')
        else:
            messages.warning(request, "Invalid email or password")

    return render(request, "accounts/login.html")

def logout_view(request):
    logout(request)
    messages.success(request, "You Logged-Out, successfully")
    return redirect("authentication:login")

from django.contrib.auth import get_user_model
User = get_user_model()
def verify_otp_view(request):
    if request.method == "POST":
        otp_code = request.POST.get("otp_code")
        user_id = request.session.get('user_id')

        if user_id:
            try:
                user = User.objects.get(id=user_id)
                otp = OTP.objects.filter(user=user).latest('created_at')

                if otp.is_valid() and otp.otp_code == otp_code:
                    login(request, user)
                    messages.success(request, "You are logged in")
                    return redirect('home:home')
                else:
                    messages.error(request, "Invalid or expired OTP")
            except User.DoesNotExist:
                messages.error(request, "User not found")
        else:
            messages.error(request, "Session expired. Please log in again.")
            return redirect('authentication:login')

    return render(request, 'accounts/verify_otp.html')
