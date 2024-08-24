from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Quiz
import os
import tempfile
from .helpingtext import generate_questions_from_text
class GenerateQuestionsViewtext(APIView):
    # parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print("working")
        # Retrieve form data
        prompt = request.data.get("text",None)
        topic = "detect by own"
        sub_topic = "detect by own"
        number_of_questions = int(request.data['num_questions'])
        question_type = request.data['question_type']
        language = request.data['language']
        difficulty_level = request.data['difficulty_level']
        print(prompt)

        
        # Generate questions
        try:
            questions = generate_questions_from_text(
            
                subject=prompt,
                sub_topic=sub_topic,
                num_questions=number_of_questions,
                difficulty_level=difficulty_level,
                language=language,
                question_type=question_type
            )
           
            for key, value in questions.items():
                question_text = value.get('question')
                correct_answer = value.get('answer', value.get('correct_answer'))

                if question_type == 'mcq':
                    options = value.get('options')
                    MCQQuestion.objects.create(
                        question=question_text,
                        option_a=options.get('A'),
                        option_b=options.get('B'),
                        option_c=options.get('C'),
                        option_d=options.get('D'),
                        correct_answer=correct_answer,
                        qno=number_of_questions
                    )
                elif question_type == 'truefalse':
                    TrueFalseQuestion.objects.create(
                        question=question_text,
                        correct_answer=correct_answer,
                        qno=number_of_questions
                    )

                elif question_type == 'fill in the blanks':
                    FillInTheBlanksQuestion.objects.create(
                        question_text=question_text,
                        correct_answers=correct_answer,
                        qno=number_of_questions,
                )
                elif question_type == 'shortanswer':
                    QuestionAnswering.objects.create(
                        question=question_text,
                        answer=correct_answer,
                        qno=number_of_questions
                    )
                else:
                    print(f"Unknown question type: {question_type}")

            return JsonResponse(questions, safe=False, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Generic views for managing questions
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import MCQQuestion, TrueFalseQuestion, QuestionAnswering,FillInTheBlanksQuestion
from .serializers import MCQQuestionSerializer, TrueFalseQuestionSerializer, QuestionAnsweringSerializer,FillInTheBlanksQuestionSerializer
from .models import MCQQuestion

class MCQQuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = MCQQuestionSerializer

    def get_queryset(self):
        """
        Override the get_queryset method to return only the last 10 MCQ questions.
        """
        return MCQQuestion.objects.order_by('-id')[:10]

class MCQQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    # last_question = MCQQuestion.objects.order_by('-id').first()

    # # Check if the last_question exists and extract the qno
    # if last_question:
    #     last_qno = last_question.qno
    # else:
    #     last_qno = None
    # print(last_qno)

    queryset = MCQQuestion.objects.order_by("-id")
    serializer_class = MCQQuestionSerializer

class TrueFalseQuestionListCreateView(generics.ListCreateAPIView):
    last_question = TrueFalseQuestion.objects.order_by('-id').first()

    # Check if the last_question exists and extract the qno
    if last_question:
        last_qno = last_question.qno
    else:
        last_qno = None

    queryset = TrueFalseQuestion.objects.order_by("-id")

    serializer_class = TrueFalseQuestionSerializer

class TrueFalseQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TrueFalseQuestion.objects.all()
    serializer_class = TrueFalseQuestionSerializer

class QuestionAnsweringListCreateView(generics.ListCreateAPIView):
   
    last_question = QuestionAnswering.objects.order_by('-id').first()

    # Check if the last_question exists and extract the qno
    if last_question:
        last_qno = last_question.qno
    else:
        last_qno = None

    queryset = QuestionAnswering.objects.order_by("-id")

    serializer_class = QuestionAnsweringSerializer

class QuestionAnsweringDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuestionAnswering.objects.all()
    serializer_class = QuestionAnsweringSerializer


class FillInTheBlanksQuestionListCreateView(generics.ListCreateAPIView):
    last_question = FillInTheBlanksQuestion.objects.order_by('-id').first()

    # Check if the last_question exists and extract the qno
    if last_question:
        last_qno = last_question.qno
    else:
        last_qno = None

    queryset = FillInTheBlanksQuestion.objects.order_by("-id")
    serializer_class = FillInTheBlanksQuestionSerializer

from rest_framework import generics
from .models import FillInTheBlanksQuestion
from .serializers import FillInTheBlanksQuestionSerializer

class FillInTheBlanksQuestionListCreateView(generics.ListCreateAPIView):
    last_question = FillInTheBlanksQuestion.objects.order_by('-id').first()

    # Check if the last_question exists and extract the qno
    if last_question:
        last_qno = last_question.qno
    else:
        last_qno = None

    queryset = FillInTheBlanksQuestion.objects.order_by("-id")
    serializer_class = FillInTheBlanksQuestionSerializer

class FillInTheBlanksQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FillInTheBlanksQuestion.objects.all()
    serializer_class = FillInTheBlanksQuestionSerializer



# Function-based views for handling specific cases
from rest_framework.decorators import api_view

@api_view(['GET', 'POST'])
def mcq_question_list(request):
    if request.method == 'GET':
        questions = MCQQuestion.objects.all()
        serializer = MCQQuestionSerializer(questions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MCQQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def mcq_question_detail(request, pk):
    try:
        question = MCQQuestion.objects.get(pk=pk)
    except MCQQuestion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MCQQuestionSerializer(question)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MCQQuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)