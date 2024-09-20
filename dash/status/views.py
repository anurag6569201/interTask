from django.shortcuts import render, get_object_or_404, redirect
from .models import Order
from .forms import OrderForm
from django.contrib.auth.decorators import login_required

# List Orders
@login_required(login_url='authentication:login')
def order_list(request):
    orders = Order.objects.all()

    return render(request, 'status/order_list.html', {'orders': orders})

# Create Order
@login_required(login_url='authentication:login')
def order_create(request):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('status:order_list')
    else:
        form = OrderForm()
    return render(request, 'status/order_form.html', {'form': form})

# Update Order
@login_required(login_url='authentication:login')
def order_update(request, pk):
    order = get_object_or_404(Order, pk=pk)
    if request.method == 'POST':
        form = OrderForm(request.POST, instance=order)
        if form.is_valid():
            form.save()
            return redirect('status:order_list')
    else:
        form = OrderForm(instance=order)
    return render(request, 'status/order_form_edit.html', {'form': form})

# Delete Order
@login_required(login_url='authentication:login')
def order_delete(request, pk):
    order = get_object_or_404(Order, pk=pk)
    if request.method == 'POST':
        order.delete()
        return redirect('status:order_list')
    return render(request, 'status/order_confirm_delete.html', {'order': order})

from django.http import JsonResponse
from django.views.decorators.http import require_POST
@require_POST
def bulk_delete_status(request):
    ids = request.POST.getlist('ids[]')  # Get list of selected status IDs from the request
    if ids:
        Order.objects.filter(id__in=ids).delete()  # Delete statuses with the selected IDs
        return JsonResponse({'success': True})  # Return a success response
    else:
        return JsonResponse({'success': False, 'error': 'No statuses selected'}, status=400)