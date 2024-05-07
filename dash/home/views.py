from collections import defaultdict
from typing import Counter
from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
import json
from collections import Counter

@login_required(login_url="/login/")
def index(request):
    # Load data from JSON file
    with open('jsdata.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    intensity_by_topic = defaultdict(list)
    for entry in data:
        intensity_str = entry['intensity']
        if intensity_str:  # Check if the intensity string is not empty
            topic = entry['topic'] if entry['topic'] else 'unknown'
            intensity_by_topic[topic].append(int(intensity_str))

    # Calculate average intensity for each topic
    avg_intensity_by_topic = {topic: sum(intensities) / len(intensities) for topic, intensities in intensity_by_topic.items()}

    likelihood_by_topic = defaultdict(list)
    for entry in data:
        likelihood_str = entry['likelihood']
        if likelihood_str:  # Check if likelihood string is not empty
            likelihood_by_topic[entry['topic']].append(int(likelihood_str))

    # Calculate average likelihood for each topic
    avg_likelihood_by_topic = {topic: sum(likelihoods) / len(likelihoods) for topic, likelihoods in likelihood_by_topic.items()}

    relevance_by_topic = defaultdict(list)
    for entry in data:
        relevance_str = entry['relevance']
        if relevance_str:  # Check if relevance string is not empty
            relevance_by_topic[entry['topic']].append(int(relevance_str))

    # Calculate average relevance for each topic
    avg_relevance_by_topic = {topic: sum(relevances) / len(relevances) for topic, relevances in relevance_by_topic.items()}

    data_by_year = defaultdict(list)
    for entry in data:
        published_year = entry['published'].split(', ')[-1]  # Extract year from the 'published' field
        data_by_year[published_year].append(entry)

    data_by_sector = defaultdict(list)
    for entry in data:
        data_by_sector[entry['sector']].append(entry)

    data_by_impact = defaultdict(list)
    for entry in data:
        data_by_impact[entry['impact']].append(entry)


    context = {
        'segment': 'index',
        'avg_intensity_by_topic':avg_intensity_by_topic,
        'avg_likelihood_by_topic':avg_likelihood_by_topic,
        'avg_relevance_by_topic':avg_relevance_by_topic,
        'data_by_sector': dict(data_by_sector),
        'data_by_impact':dict(data_by_impact)
    }

    html_template = loader.get_template('home/index.html')
    return HttpResponse(html_template.render(context, request))

@login_required(login_url="/login/")
def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:

        load_template = request.path.split('/')[-1]

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        context['segment'] = load_template

        html_template = loader.get_template('home/' + load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:

        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))
