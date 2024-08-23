from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.user.username
    

class Question(models.Model):
    question_text = models.CharField(max_length=255,null=True,blank=True)

    



  


class Option(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    option_text = models.CharField(max_length=255,null=True,blank=True)
    option_letter = models.CharField(max_length=1,null=True,blank=True)

    def __str__(self):
        return self.question.question_text or 'No question text available'


class Answer(models.Model):
    question = models.OneToOneField(Question, related_name='answer', on_delete=models.CASCADE)
    correct_option = models.ForeignKey(Option, related_name='correct_answer', on_delete=models.CASCADE)

    def __str__(self):
        return f"Correct answer for {self.question}: {self.correct_option.option_letter}"
    


    # models.py
from django.db import models

# class Quiz(models.Model):
#     file = models.FileField(upload_to='uploads/')
#     number_of_questions = models.IntegerField(choices=[(10, '10'), (20, '20'), (30, '30')])
#     question_type = models.CharField(
#         max_length=20,
#         choices=[('mcq', 'Multiple Choice'), ('truefalse', 'True/False'), ('shortanswer', 'Short Answer'),('matching', 'Matching'),('mix', 'Mix')]
#     )
#     language = models.CharField(
#         max_length=20,
#         choices=[('english', 'English'), ('spanish', 'Spanish'), ('french', 'French')]
#     )
#     difficulty_level = models.CharField(
#         max_length=20,
#         choices=[('easy', 'Easy'), ('hard', 'Hard')]
#     )
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Quiz {self.id} - {self.language} - {self.question_type}"
from django.db import models

class Quiz(models.Model):
    file = models.FileField(upload_to='uploads/')
    number_of_questions = models.IntegerField()
    question_type = models.CharField(max_length=50)
    language = models.CharField(max_length=50)
    difficulty_level = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quiz {self.id}: {self.question_type} - {self.language}"
    






    from django.db import models

class MCQQuestion(models.Model):
    question = models.CharField(max_length=255)
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1)
    qno=models.CharField(max_length=100,null=True,blank=True,default=10)

    def __str__(self):
        return self.question

class TrueFalseQuestion(models.Model):
    question = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255,null=True,blank=True)
    qno=models.CharField(max_length=100,null=True,blank=True,default=10)

    def __str__(self):
        return self.question

class QuestionAnswering(models.Model):
    question = models.CharField(max_length=255,null=True,blank=True)
    answer = models.TextField(null=True,blank=True)
    qno=models.CharField(max_length=100,null=True,blank=True,default=10)

from django.db import models

class FillInTheBlanksQuestion(models.Model):
    question_text = models.TextField()
    correct_answers = models.TextField()  # Stores the correct answers for the blanks
    qno=models.CharField(max_length=100,null=True,blank=True,default=10)

    def __str__(self):
        return self.question_text