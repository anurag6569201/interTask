from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader, TemplateDoesNotExist
from django.urls import reverse
from django.shortcuts import render
import logging

logger = logging.getLogger(__name__)

@login_required(login_url="/login/")
def index(request):
    return render(request, 'home/index.html')

@login_required(login_url="/login/")
def pages(request):
    context = {}
    try:
        load_template = request.path.strip('/').split('/')[-1]
        
        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        
        context['segment'] = load_template
        
        # Load and render the template
        html_template = loader.get_template(f'home/{load_template}')
        return HttpResponse(html_template.render(context, request))

    except TemplateDoesNotExist:
        # Handle case where the template does not exist
        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except Exception as e:
        # Log the exception (for debugging purposes) and return a server error page
        logger.error(f"An error occurred: {e}", exc_info=True)
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))
