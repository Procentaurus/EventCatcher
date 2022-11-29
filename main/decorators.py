from django.shortcuts import redirect

def authenticatedUser(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home')
        else:
           return view_func(request, *args, **kwargs)

    return wrapper_func

def unauthenticatedUser(view_func):
    def wrapper_func(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('home')
        else:
           return view_func(request, *args, **kwargs)

    return wrapper_func

def differentUser(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.method == 'GET':
            if request.user.id != kwargs['pk']:
                return redirect('home')
            else:
                return view_func(request, *args, **kwargs)

    return wrapper_func