from django import forms

from . import models


class StockForm(forms.ModelForm):
    class Meta:
        model = models.Stock
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(StockForm, self).__init__(*args, **kwargs)
        self.fields['size'].required = True
        self.fields['color'].required = True
        self.fields['in_stock'].required = True


class StockFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        for form in self.forms:
            if not form.cleaned_data.get('size'):
                raise forms.ValidationError('Please select a size')
            if not form.cleaned_data.get('color'):
                raise forms.ValidationError('Please select a color')
            if not form.cleaned_data.get('in_stock'):
                raise forms.ValidationError('Please select a stock')


class CarouselImageForm(forms.ModelForm):
    class Meta:
        model = models.Stock
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CarouselImageForm, self).__init__(*args, **kwargs)
        self.fields['image'].required = True


class CarouselImageFormSet(forms.BaseInlineFormSet):
    def clean(self):
        super().clean()
        for form in self.forms:
            if not form.cleaned_data.get('image'):
                raise forms.ValidationError('Please select an image')