from userauths.models import User

def UserContext(request):
    current_User = request.user
    context={
        'current_user':current_User,
    }
    return context