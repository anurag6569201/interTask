from django.contrib import admin
from .models import Company, Invoice, Item

# Inline model for Item
class ItemInline(admin.TabularInline):
    model = Item
    extra = 1  
    can_delete = True

# Customize the Invoice Admin
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'company', 'invoice_date', 'transaction_date', 'due_date', 'total']
    search_fields = ['invoice_number', 'customer__name', 'company__name']
    list_filter = ['invoice_date', 'due_date']
    inlines = [ItemInline]  

# Customize the Company Admin
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'website', 'payment_id']
    search_fields = ['name', 'gst', 'cin']

# Register the models with custom admin
admin.site.register(Company, CompanyAdmin)
admin.site.register(Invoice, InvoiceAdmin)
