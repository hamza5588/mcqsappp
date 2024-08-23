from django.contrib import admin
from .models import Profile,Question,QuestionAnswering,TrueFalseQuestion,MCQQuestion,FillInTheBlanksQuestion

# Register your models here.

admin.site.register(Profile)



from django.contrib import admin
from .models import Question, Option, Answer

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4  # Default number of option fields to display

class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question_text', 'correct_option_letter')

    def question_text(self, obj):
        return obj.question.question_text if obj.question else 'No question text available'
    question_text.short_description = 'Question Text'

admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer)
admin.site.register(Option)
admin.site.register(MCQQuestion)
admin.site.register(TrueFalseQuestion)
admin.site.register(QuestionAnswering)
admin.site.register(FillInTheBlanksQuestion)