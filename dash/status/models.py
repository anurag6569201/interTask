from django.db import models

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Canceled', 'Canceled'),
    ]
    
    order_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField()
    order_date = models.DateField()
    service = models.CharField(max_length=100)
    charges = models.DecimalField(max_digits=10, decimal_places=2)
    client_inputs = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    completion_date = models.DateField(null=True, blank=True)
    report_link = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.email}"
