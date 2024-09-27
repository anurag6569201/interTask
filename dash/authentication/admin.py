from django.contrib import admin
from authentication.models import User,OptionalEmail

class UserAdmin(admin.ModelAdmin):
    list_display=['username','email','bio']

admin.site.register(User,UserAdmin)
admin.site.register(OptionalEmail)