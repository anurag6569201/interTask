from django import forms
from .models import Order

class OrderForm(forms.ModelForm):
    order_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})
    )
    completion_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'})
    )
    class Meta:
        model = Order
        fields = ['order_id', 'email', 'service', 'charges', 'client_inputs', 'status', 'completion_date', 'report_link','order_date']


class EmailSearchForm(forms.Form):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'})
    )