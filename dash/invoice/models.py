
from django.db import models
from decimal import Decimal, ROUND_HALF_UP


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
    
class Invoice(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=100,null=True,blank=True,default="N/A")
    invoice_date = models.DateField(null=True,blank=True,default="N/A")
    transaction_date = models.DateField(null=True,blank=True,default="N/A")
    due_date = models.DateField(null=True,blank=True,default="N/A")
    total_taxable_amount = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('18.00'),null=True,blank=True)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'),null=True,blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'),null=True,blank=True)
    customer_name = models.CharField(max_length=255,null=True,blank=True,default="N/A")
    customer_email = models.EmailField(null=True,blank=True,default="N/A")
    customer_phone = models.IntegerField(null=True,blank=True,default="N/A")
    customer_address = models.TextField(null=True,blank=True,default="N/A")
    payment_id = models.CharField(max_length=100,default="N/A")
    clint_gst = models.CharField(max_length=100, blank=True,null=True,default="N/A")

    def __str__(self):
        return f"Invoice {self.invoice_number}"

class Item(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    item_number = models.CharField(null=True,blank=True,max_length=255,default="N/A")
    item_name = models.CharField(max_length=255,default="N/A",null=True,blank=True)
    quantity = models.IntegerField(default=0,null=True,blank=True)
    price_incl_tax = models.DecimalField(max_digits=10, decimal_places=2,default=0.00,null=True,blank=True)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2,default=0.00,null=True,blank=True)

    def __str__(self):
        return f"Item {self.item_name} for Invoice {self.invoice.invoice_number}"


class BankDetails(models.Model):
    bank_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=100)
    account_holder_name = models.CharField(max_length=255)
    ifsc_code = models.CharField(max_length=100)
    
    # Adding image fields
    qr_scanner_image = models.ImageField(upload_to='bank_details/qr_scanner/', blank=True, null=True)
    sign_seal_image = models.ImageField(upload_to='bank_details/sign_seal/', blank=True, null=True)
    company_logo = models.ImageField(upload_to='bank_details/company_logo/', blank=True, null=True)

    def __str__(self):
        return f"{self.company} - {self.bank_name}"
