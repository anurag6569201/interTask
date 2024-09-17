from django import forms
from .models import Invoice, Item,BankDetails

class InvoiceForm(forms.ModelForm):
    invoice_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    transaction_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    due_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    
    class Meta:
        model = Invoice
        fields = ['company', 'invoice_number', 'invoice_date', 'transaction_date', 'due_date',
                  'total_taxable_amount', 'tax_rate', 'tax_amount', 'total',
                  'customer_name', 'customer_email', 'customer_phone', 'customer_address']

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['item_number', 'item_name', 'quantity', 'price_per_unit', 'price_incl_tax']
        widgets = {
            'quantity': forms.NumberInput(attrs={'class': 'quantity'}),
            'price_per_unit': forms.NumberInput(attrs={'class': 'price-per-unit'}),
            'price_incl_tax': forms.NumberInput(attrs={'class': 'price-incl-tax'}),
        }


class BankDetailsForm(forms.ModelForm):
    class Meta:
        model = BankDetails
        fields = [
            'bank_name', 'account_number',
            'account_holder_name', 'ifsc_code',
            'qr_scanner_image', 'sign_seal_image', 'company_logo'
        ]