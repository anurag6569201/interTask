from django.shortcuts import render,redirect
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from letterhead.models import Letter
from .forms import LetterForm
from django.shortcuts import get_list_or_404

def letterhead(request):
    letterheads = Letter.objects.all()

    return render(request, 'letterhead/letterhead.html', {
        'letterheads': letterheads
    })

def create_letterhead(request, pk=None):
    if pk:
        letterhead = Letter.objects.get(pk=pk)
    else:
        letterhead = None
    
    if request.method == 'POST':
        letterhead_form = LetterForm(request.POST, request.FILES, instance=letterhead)
        
        if letterhead_form.is_valid():
            letterhead_form.save()
            return redirect('letterhead:letterhead')
        else:
            print("Form validation failed")
            print(letterhead_form.errors)  # Log errors for debugging
    else:
        letterhead_form = LetterForm(instance=letterhead)  # Initialize with instance for editing

    return render(request, 'letterhead/create_letterhead.html', {
        'letterhead_form': letterhead_form,
    })


def preview_letterhead(request, pk):
    letterhead = Letter.objects.get(pk=pk)
    return render(request, 'letterhead/preview_letterhead.html', {
        'letterhead': letterhead
    })


@require_POST
def bulk_delete_letterhead(request):
    try:
        ids = request.POST.getlist('ids[]')
        letterheads = get_list_or_404(Letter, id__in=ids)
        for letter in letterheads:
            letter.delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})