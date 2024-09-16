from django import forms
from .models import Invoice, Item
from decimal import Decimal, ROUND_HALF_UP

class InvoiceForm(forms.ModelForm):
    invoice_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    transaction_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    due_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    tax_rate = forms.DecimalField(max_digits=5, decimal_places=2, initial=Decimal('18.00'))
    tax_amount = forms.DecimalField(max_digits=10, decimal_places=2, required=False, widget=forms.TextInput(attrs={'readonly': 'readonly'}))
    total = forms.DecimalField(max_digits=10, decimal_places=2, required=False, widget=forms.TextInput(attrs={'readonly': 'readonly'}))

    class Meta:
        model = Invoice
        fields = ['company', 'invoice_number', 'invoice_date', 'transaction_date', 'due_date',
                  'total_taxable_amount', 'tax_rate', 'tax_amount', 'total',
                  'customer_name', 'customer_email', 'customer_phone', 'customer_address']

    def clean(self):
        cleaned_data = super().clean()
        total_taxable_amount = cleaned_data.get('total_taxable_amount', Decimal('0.00'))
        tax_rate = cleaned_data.get('tax_rate', Decimal('18.00'))

        # Calculate tax_amount and total
        tax_amount = (total_taxable_amount * tax_rate) / 100
        total = total_taxable_amount + tax_amount

        # Round to 2 decimal places
        cleaned_data['tax_amount'] = Decimal(tax_amount).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        cleaned_data['total'] = Decimal(total).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        return cleaned_data


class ItemForm(forms.ModelForm):
    price_incl_tax = forms.DecimalField(required=False, max_digits=10, decimal_places=2, widget=forms.TextInput(attrs={'readonly': 'readonly'}))
    price_per_unit = forms.DecimalField(required=False, max_digits=10, decimal_places=2, widget=forms.TextInput(attrs={'readonly': 'readonly'}))
    quantity = forms.IntegerField(required=True, widget=forms.NumberInput())  # Remove read-only to allow editing

    class Meta:
        model = Item
        fields = ['item_number', 'item_name', 'quantity', 'price_per_unit', 'price_incl_tax']
