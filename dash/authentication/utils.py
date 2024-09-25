import random
from django.conf import settings
from pprint import pprint

def generate_otp():
    return str(random.randint(100000, 999999))

from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import os

def send_otp_email(user_email, otp_code=generate_otp()):
    subject = 'Your OTP Code'
    from_email = settings.EMAIL_HOST_USER
    to_email = user_email
    
    # Create the HTML content for the OTP email
    html_content = f"<html><body><p>Your OTP is {otp_code}. It will expire in 10 minutes.</p></body></html>"
    
    msg = EmailMultiAlternatives(subject, '', from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    
    try:
        # Attempt to send the email
        msg.send()
        return True  # Return True if email is sent successfully
    except Exception as e:
        print(f"Error sending email: {e}")  # Log the error (you can use logging instead)
        return False  # Return False if sending fails
