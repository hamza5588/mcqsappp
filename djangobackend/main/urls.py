from django.urls import path
from .views import register, user_login,receive_text

from .views import  receive_text
# from .views import question_list, question_detail, answer_list, answer_detail
# from .subjectquiz import delete_question,update_question

# neww
# from .views import question_detail,question_list
from rest_framework.routers import DefaultRouter
# router = DefaultRouter()
# router.register(r'questions', QuestionViewSet)
# router.register(r'answers', AnswerViewSet)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import QuizViewSet
# new
# from .views import QuizUploadView
from .filequiz import GenerateQuestionsView
from .subjectquiz import GenerateQuestionsViewsubject
from .prompt import GenerateQuestionsViewprompt
from .urlquiz import GenerateQuestionsViewFromurl
from .text import GenerateQuestionsViewtext
from .subjectquiz import mcq_question_list, mcq_question_detail
from .subjectquiz import submit_quiz,submit_true_false_quiz


from .subjectquiz import (
    MCQQuestionListCreateView, MCQQuestionDetailView,
    TrueFalseQuestionListCreateView, TrueFalseQuestionDetailView,
    QuestionAnsweringListCreateView, QuestionAnsweringDetailView, FillInTheBlanksQuestionListCreateView, FillInTheBlanksQuestionDetailView
)

urlpatterns = [
  
   # User registration and login
    path('register/', register, name='register'),
    path('login/', user_login, name='login'),

    # Question generation endpoints
    path('generate-questions/', GenerateQuestionsView.as_view(), name='generate_questions'),
    path('subject-quizz/', GenerateQuestionsViewsubject.as_view(), name='subject_quizz'),
    path('prompt-quizz/', GenerateQuestionsViewprompt.as_view(), name='prompt_quizz'),
    path('text/', GenerateQuestionsViewtext.as_view(), name='text'),
    path('url-quizz/', GenerateQuestionsViewFromurl.as_view(), name='url_quizz'),

    # Text reception
    path('receive_text/', receive_text, name='receive_text'),

    # Quiz submission endpoints
    path('submit-quiz/', submit_quiz, name='submit-quiz'),
    path('submit-true-false-quiz/', submit_true_false_quiz, name='submit_true_false_quiz'),

    # MCQ question endpoints
    path('api/mcq-questions/', mcq_question_list, name='mcq_question_list'),
    path('api/mcq-questions/<int:pk>/', mcq_question_detail, name='mcq_question_detail'),
    path('mcq-questions/', MCQQuestionListCreateView.as_view(), name='mcq-question-list-create'),
    path('mcq-questions/<int:pk>/', MCQQuestionDetailView.as_view(), name='mcq-question-detail'),

    # True/False question endpoints
    path('true-false-questions/', TrueFalseQuestionListCreateView.as_view(), name='true-false-question-list-create'),
    path('true-false-questions/<int:pk>/', TrueFalseQuestionDetailView.as_view(), name='true-false-question-detail'),

    # Short answer question endpoints
    path('short-answer-questions/<int:pk>/', QuestionAnsweringDetailView.as_view(), name='short-answer-questions'),
    path('short-answer-questions/', QuestionAnsweringListCreateView.as_view(), name='short-answer-questions'),

    # Fill in the Blanks question endpoints
       # Endpoint for Fill in the Blanks Questions
    path('fill-in-the-blanks-questions/', FillInTheBlanksQuestionListCreateView.as_view(), name="fill-in-the-blanks-questions"),
    path('fill-in-the-blanks-questions/<int:pk>/', FillInTheBlanksQuestionDetailView.as_view(), name="fill-in-the-blanks-question-detail"),


]