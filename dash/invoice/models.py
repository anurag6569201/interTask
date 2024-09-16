from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=255)
    gst = models.CharField(max_length=100, blank=True)
    cin = models.CharField(max_length=100, blank=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    payment_id = models.CharField(max_length=100)

    def __str__(self):
        return self.name

from django.db import models
from decimal import Decimal, ROUND_HALF_UP

class Invoice(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=100)
    invoice_date = models.DateField()
    transaction_date = models.DateField()
    due_date = models.DateField()
    total_taxable_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('18.00'))
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.IntegerField()
    customer_address = models.TextField()

    def __str__(self):
        return f"Invoice {self.invoice_number}"

class Item(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    item_number = models.IntegerField(default=1)
    item_name = models.CharField(max_length=255,default="N/A")
    quantity = models.IntegerField(default=0)
    price_incl_tax = models.DecimalField(max_digits=10, decimal_places=2,default=0.00)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2,default=0.00)

    def __str__(self):
        return f"Item {self.item_name} for Invoice {self.invoice.invoice_number}"
