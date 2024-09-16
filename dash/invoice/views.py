from django.shortcuts import render, redirect
from django.forms import inlineformset_factory
from .models import Invoice, Item
from .forms import InvoiceForm, ItemForm
from django.contrib.auth.decorators import login_required

@login_required(login_url="/login/")
def invoice(request):
    invoices = Invoice.objects.all()
    context = {
        'invoices': invoices,
    }
    return render(request, 'invoice/invoice.html', context)

from django.shortcuts import render, redirect, get_object_or_404
from django.forms import inlineformset_factory
from .models import Invoice, Item
from .forms import InvoiceForm, ItemForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages

@login_required(login_url="/login/")
def create_invoice(request):
    # Use inlineformset_factory to create a formset for Invoice and its associated Items
    ItemFormSet = inlineformset_factory(Invoice, Item, form=ItemForm, extra=1, can_delete=True)

    if request.method == 'POST':
        form = InvoiceForm(request.POST)
        formset = ItemFormSet(request.POST)
        
        if form.is_valid() and formset.is_valid():
            # Save the invoice first to get an instance to associate with the formset
            invoice = form.save()

            # Bind the invoice instance to the formset before saving it
            formset.instance = invoice
            formset.save()
            
            messages.success(request, "Invoice created successfully.")
            return redirect('invoice:invoice')  # Adjust the redirect as necessary
        else:
            # Handle errors if form or formset is invalid
            print("Form errors:", form.errors)
            print("Formset errors:", formset.errors)
    else:
        form = InvoiceForm()
        formset = ItemFormSet()

    return render(request, 'invoice/create_invoice.html', {'form': form, 'formset': formset})

@login_required(login_url="/login/")
def edit_invoice(request, pk):
    invoice = get_object_or_404(Invoice, pk=pk)
    ItemFormSet = inlineformset_factory(Invoice, Item, form=ItemForm, extra=1, can_delete=True)
    
    if request.method == 'POST':
        form = InvoiceForm(request.POST, instance=invoice)
        formset = ItemFormSet(request.POST, instance=invoice)
        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            messages.success(request, "Invoice updated successfully.")
            return redirect('invoice:invoice')
    else:
        form = InvoiceForm(instance=invoice)
        formset = ItemFormSet(instance=invoice)
    
    return render(request, 'invoice/edit_invoice.html', {'form': form, 'formset': formset})

@login_required(login_url="/login/")
def duplicate_invoice(request, pk):
    original_invoice = get_object_or_404(Invoice, pk=pk)
    
    duplicated_invoice = Invoice.objects.create(
        company=original_invoice.company,
        invoice_number=f"{original_invoice.invoice_number}-copy",
        invoice_date=original_invoice.invoice_date,
        transaction_date=original_invoice.transaction_date,
        due_date=original_invoice.due_date,
        total=original_invoice.total,
        customer_name=original_invoice.customer_name,
        customer_email=original_invoice.customer_email,
        customer_phone=original_invoice.customer_phone,
        customer_address=original_invoice.customer_address,
    )
    
    for item in original_invoice.items.all():
        Item.objects.create(
            invoice=duplicated_invoice,
            item_number=item.item_number,
            item_name=item.item_name,
            quantity=item.quantity,
            price_incl_tax=item.price_incl_tax,
            price_per_unit=item.price_per_unit
        )
    
    messages.success(request, "Invoice duplicated successfully.")
    return redirect('invoice:invoice')

@login_required(login_url="/login/")
def delete_invoice(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    if request.method == 'POST':
        invoice.delete()
        return redirect('invoice:invoice')
    return render(request, 'invoice/delete_invoice.html', {'invoice': invoice})


from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa

@login_required(login_url="/login/")
def print_invoice(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    items = invoice.items.all()
    
    # Context for rendering the HTML
    context = {
        'invoice': invoice,
        'items': items,
    }

    # Render HTML content using the template
    template = get_template('invoice/print_invoice.html')
    html = template.render(context)
    
    # Create a HTTP response with PDF content type
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'

    # Convert HTML to PDF using xhtml2pdf
    pisa_status = pisa.CreatePDF(html, dest=response)

    # If there is an error during PDF creation, return error response
    if pisa_status.err:
        return HttpResponse('We had some errors while generating your PDF')

    return response
