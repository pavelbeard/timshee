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

    # def __init__(self, *args, **kwargs):
    #     super(StockForm, self).__init__(*args, **kwargs)
    #     self.fields['size'].required = True
    #     self.fields['color'].required = True
    #     self.fields['in_stock'].required = True


class StockFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        for form in self.forms:
            size = form.cleaned_data.get('size')
            color = form.cleaned_data.get('color')
            in_stock = form.cleaned_data.get('in_stock')

            if not any([size, color, in_stock]):
                raise forms.ValidationError('At least one of the fields (size, color, in stock) must be filled out.')


class CarouselImageForm(forms.ModelForm):
    class Meta:
        model = models.Stock
        fields = '__all__'

    # def __init__(self, *args, **kwargs):
    #     super(CarouselImageForm, self).__init__(*args, **kwargs)
    #     self.fields['image'].required = True


class CarouselImageFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        for form in self.forms:
            if not form.cleaned_data.get('image'):
                raise forms.ValidationError('Please select an image')
