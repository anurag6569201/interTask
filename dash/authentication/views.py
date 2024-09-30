from django.shortcuts import render, redirect
from .forms import UserRegisterForm
from django.contrib.auth import login, authenticate, get_user_model
from django.contrib import messages
from django.conf import settings
from django.contrib.auth import logout
from .utils import generate_otp, send_otp_email
from django.utils import timezone
from .models import OTP, OptionalEmail

User = get_user_model()
def login_view(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        
        user = authenticate(request, email=email, password=password)
        
        if user is None:
            try:
                optional_email = OptionalEmail.objects.get(email=email)
                user = optional_email.user
                
                if user.check_password(password):
                    otp_code = generate_otp()
                    OTP.objects.create(user=user, otp_code=otp_code)
                    email_sent = send_otp_email(user.email, otp_code)
                    
                    if email_sent:
                        request.session['user_id'] = user.id
                        messages.info(request, "OTP sent to your email")
                    else:
                        messages.warning(request, "Failed to send OTP. You can use your secret number to login.")
                        request.session['user_id'] = user.id  
                        return redirect('authentication:verify_otp')
                        
                    return redirect('authentication:verify_otp')
                else:
                    messages.warning(request, "Invalid email or password")
            except OptionalEmail.DoesNotExist:
                messages.warning(request, "Invalid email or password")
        else:
            otp_code = generate_otp()
            OTP.objects.create(user=user, otp_code=otp_code)
            email_sent = send_otp_email(user.email, otp_code)
            
            if email_sent:
                request.session['user_id'] = user.id
                messages.info(request, "OTP sent to your email")
            else:
                messages.warning(request, "Failed to send OTP. You can use your secret number to login.")
                request.session['user_id'] = user.id  
                return redirect('authentication:verify_otp')

            return redirect('authentication:verify_otp')

    return render(request, "accounts/login.html")

def logout_view(request):
    logout(request)
    messages.success(request, "You have logged out successfully.")
    return redirect("authentication:login")


def verify_otp_view(request):
    if request.method == "POST":
        code = request.POST.get("code")
        user_id = request.session.get('user_id')

        if user_id:
            try:
                user = User.objects.get(id=user_id)
                otp = OTP.objects.filter(user=user).latest('created_at')

                # Check if OTP is valid
                if otp.is_valid() and otp.otp_code == code:
                    login(request, user)
                    messages.success(request, "Logged in successfully using OTP.")
                    return redirect('home:home')
                
                # Check if secret number is valid
                if user.secret_number == code:
                    login(request, user)
                    messages.success(request, "Logged in successfully using Secret Number.")
                    return redirect('home:home')

                # If both validations fail
                messages.error(request, "Invalid OTP or Secret Number")
            except User.DoesNotExist:
                messages.error(request, "User not found.")
        else:
            messages.error(request, "Session expired. Please log in again.")
            return redirect('authentication:login')

    return render(request, 'accounts/verify_otp.html')
