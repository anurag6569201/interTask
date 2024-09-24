import random
from django.core.mail import send_mail
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(user_email, otp_code):
    subject = 'Your OTP Code'
    message = f'Your OTP is {otp_code}. It will expire in 10 minutes.'
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user_email]
    send_mail(subject, message, email_from, recipient_list)
