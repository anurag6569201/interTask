from django.forms import inlineformset_factory
from django.shortcuts import render, redirect, get_object_or_404
from .models import Invoice, Item
from .forms import InvoiceForm, ItemForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.views.decorators.http import require_POST
from django.http import JsonResponse



# Invoice list page
@login_required(login_url="/login/")
def invoice(request):
    invoices = Invoice.objects.all()
    context = {
        'invoices': invoices,
    }
    return render(request, 'invoice/invoice.html', context)





# Creation of invoices
@login_required(login_url="/login/")
def create_invoice(request):
    ItemFormSet = inlineformset_factory(Invoice, Item, form=ItemForm, extra=10, can_delete=True)
    if request.method == 'POST':
        form = InvoiceForm(request.POST)
        formset = ItemFormSet(request.POST)
        if form.is_valid() and formset.is_valid():
            invoice = form.save()
            formset.instance = invoice
            formset.save()
            messages.success(request, "Invoice created successfully.")
            return redirect('invoice:invoice') 
        else:
            print("Form errors:", form.errors)
            print("Formset errors:", formset.errors)
    else:
        form = InvoiceForm()
        formset = ItemFormSet()
    return render(request, 'invoice/create_invoice.html', {'form': form, 'formset': formset})





# editing of the invoice
def edit_invoice(request, pk):
    invoice = get_object_or_404(Invoice, pk=pk)
    ItemFormSet = inlineformset_factory(Invoice, Item, form=ItemForm, extra=0, can_delete=True)

    if request.method == 'POST':
        form = InvoiceForm(request.POST, instance=invoice)
        formset = ItemFormSet(request.POST, instance=invoice)
        if form.is_valid() or formset.is_valid():
            form.save()
            formset.save()
            messages.success(request, "Invoice updated successfully.")
            return redirect('invoice:invoice') 
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = InvoiceForm(instance=invoice)
        formset = ItemFormSet(instance=invoice)

    return render(request, 'invoice/edit_invoice.html', {'form': form, 'formset': formset})






# duplication of the invoice form
@login_required(login_url="/login/")
def duplicate_invoice(request, pk):
    original_invoice = get_object_or_404(Invoice, pk=pk)

    # Create the duplicated invoice
    duplicated_invoice = Invoice.objects.create(
        company=original_invoice.company,
        invoice_number=f"{original_invoice.invoice_number}-copy", 
        invoice_date=original_invoice.invoice_date,
        transaction_date=original_invoice.transaction_date,
        due_date=original_invoice.due_date,
        total_taxable_amount=original_invoice.total_taxable_amount, 
        tax_rate=original_invoice.tax_rate,
        tax_amount=original_invoice.tax_amount,  
        total=original_invoice.total,
        customer_name=original_invoice.customer_name,
        customer_email=original_invoice.customer_email,
        customer_phone=original_invoice.customer_phone,
        customer_address=original_invoice.customer_address,
    )

    # Duplicating each item associated with the original invoice
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





# deletion of the invoice
@login_required(login_url="/login/")
def delete_invoice(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    if request.method == 'POST':
        invoice.delete()
        return redirect('invoice:invoice')
    return render(request, 'invoice/delete_invoice.html', {'invoice': invoice})





# priniting the invoice
@login_required(login_url="/login/")
def print_invoice(request, pk):
    invoice = Invoice.objects.get(pk=pk)
    items = invoice.items.all()
    context = {
        'invoice': invoice,
        'items': items,
    }
    template = get_template('invoice/print_invoice.html')
    html = template.render(context)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="invoice_{invoice.invoice_number}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('We had some errors while generating your PDF')

    return response




# bulk deletes of the invoice
@require_POST
def bulk_delete_invoices(request):
    ids = request.POST.getlist('ids[]') 
    if ids:
        Invoice.objects.filter(id__in=ids).delete() 
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})



def view_invoice(request):
    invoice = Invoice.objects.first()
    items = invoice.items.all()
    context = {
        'invoice': invoice,
        'items': items,
    }
    return render(request, 'invoice/print_invoice.html', context)

