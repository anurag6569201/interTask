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

class Invoice(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=100)
    invoice_date = models.DateField()
    transaction_date = models.DateField()
    due_date = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.IntegerField()
    customer_address = models.TextField()

    def __str__(self):
        return f"Invoice {self.invoice_number}"

class Item(models.Model):
    invoice = models.ForeignKey(Invoice, related_name='items', on_delete=models.CASCADE)
    item_number = models.IntegerField()
    item_name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    price_incl_tax = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.item_name} for Invoice {self.invoice.invoice_number}"
