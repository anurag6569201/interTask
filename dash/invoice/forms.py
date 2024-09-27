from django import forms
from .models import Invoice, Item, BankDetails

class InvoiceForm(forms.ModelForm):
    invoice_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}))
    transaction_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),required=False)
    due_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}))
    
    class Meta:
        model = Invoice
        fields = ['company', 'invoice_number', 'invoice_date', 'transaction_date', 'due_date',
                  'total_taxable_amount', 'tax_rate', 'tax_amount', 'total',
                  'customer_name', 'customer_email', 'customer_phone', 'customer_address','payment_id','clint_gst','service_type']
        widgets = {
            'company': forms.Select(attrs={'class': 'form-control'}),
            'service_type': forms.Select(attrs={'class': 'form-control'}),
            'invoice_number': forms.TextInput(attrs={'class': 'form-control'}),
            'total_taxable_amount': forms.NumberInput(attrs={'class': 'form-control'}),
            'tax_rate': forms.NumberInput(attrs={'class': 'form-control'}),
            'tax_amount': forms.NumberInput(attrs={'class': 'form-control'}),
            'total': forms.NumberInput(attrs={'class': 'form-control'}),
            'customer_name': forms.TextInput(attrs={'class': 'form-control'}),
            'payment_id': forms.TextInput(attrs={'class': 'form-control'}),
            'clint_gst': forms.TextInput(attrs={'class': 'form-control'}),
            'customer_email': forms.EmailInput(attrs={'class': 'form-control'}),
            'customer_phone': forms.NumberInput(attrs={'class': 'form-control'}),
            'customer_address': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
        }

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['item_number', 'item_name', 'quantity', 'price_per_unit', 'price_incl_tax']
        widgets = {
            'item_number': forms.TextInput(attrs={'class': 'form-control'}),
            'item_name': forms.TextInput(attrs={'class': 'form-control'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control quantity'}),
            'price_per_unit': forms.NumberInput(attrs={'class': 'form-control price-per-unit'}),
            'price_incl_tax': forms.NumberInput(attrs={'class': 'form-control price-incl-tax'}),
        }

class BankDetailsForm(forms.ModelForm):
    class Meta:
        model = BankDetails
        fields = [
            'bank_name', 'account_number', 'account_holder_name', 'ifsc_code',
            'qr_scanner_image', 'sign_seal_image', 'company_logo'
        ]
        widgets = {
            'bank_name': forms.TextInput(attrs={'class': 'form-control'}),
            'account_number': forms.TextInput(attrs={'class': 'form-control'}),
            'account_holder_name': forms.TextInput(attrs={'class': 'form-control'}),
            'ifsc_code': forms.TextInput(attrs={'class': 'form-control'}),
            'qr_scanner_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'sign_seal_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'company_logo': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }
