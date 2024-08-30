from django import forms

from . import models

class TypeForm(forms.ModelForm):
    class Meta:
        model = models.Type
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TypeForm, self).__init__(*args, **kwargs)
        self.fields['category'].required = False

class CollectionForm(forms.ModelForm):
    class Meta:
        model = models.Collection
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CollectionForm, self).__init__(*args, **kwargs)
        self.fields['link'].required = False
        # self.fields['link'].disabled = True


class StockForm(forms.ModelForm):
    class Meta:
        model = models.Stock
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(StockForm, self).__init__(*args, **kwargs)
        self.fields['size'].required = False
        self.fields['color'].required = False
        self.fields['in_stock'].required = False


class CarouselImageForm(forms.ModelForm):
    class Meta:
        model = models.Stock
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CarouselImageForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = False
