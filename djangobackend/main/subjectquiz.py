from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from .models import MCQQuestion, TrueFalseQuestion, QuestionAnswering
from .helpingsubject import generate_questions_from_subject
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404, redirect
class GenerateQuestionsViewsubject(APIView):

    def post(self, request, *args, **kwargs):
        print("Handling request")
        # Retrieve form data
        subject = request.data.get('subject')
        sub_topic = request.data.get('sub_topic')
        number_of_questions = int(request.data.get('number_of_questions'))
        question_type = request.data.get('question_type')
        language = request.data.get('language')
        difficulty_level = request.data.get('difficulty_level')

        print(subject, sub_topic, number_of_questions, language, difficulty_level)
        from .models import QuestionAnswering
        latest_question = QuestionAnswering.objects.order_by('-id').first()
        print(latest_question)

        # Generate questions
        try:
            questions = generate_questions_from_subject(
                subject=subject,
                sub_topic=sub_topic,
                num_questions=number_of_questions,
                difficulty_level=difficulty_level,
                language=language,
                question_type=question_type
            )
            print(question_type)

            # Store questions based on their type
            for key, value in questions.items():
                if question_type=="mcq":
                    question_text = value.get('question')
                    correct_answer = value.get('answer')
                elif question_type=="truefalse":
                    question_text = value.get('statement')
                    correct_answer = value.get('answer')
                elif question_type=="fill in the blanks":
                    question_text = value.get('sentence')
                    correct_answer = value.get('answer')
                
                else:
                    question_text = value.get('question')
                    correct_answer = value.get('answer')



                print(question_text,correct_answer)

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
                    print("data is saved into question")
                elif question_type == 'fill in the blanks':
                    FillInTheBlanksQuestion.objects.create(
                        question_text=question_text,
                        correct_answers=correct_answer,
                        qno=number_of_questions
                )
                    print("fill in the blanks data saved")
                elif question_type == 'shortanswer':
                    # Assuming `ShortAnswerQuestion` is a model for handling short answer questions
                    QuestionAnswering.objects.create(
                        question=question_text,
                        answer=correct_answer,
                        qno=number_of_questions
                    )
                    print("data is saved in short answer")
                else:
                    print(f"Unknown question type: {question_type}")

            return JsonResponse({'message': 'Questions saved successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import MCQQuestion, TrueFalseQuestion, QuestionAnswering
from .serializers import MCQQuestionSerializer, TrueFalseQuestionSerializer, QuestionAnsweringSerializer
from .models import MCQQuestion
@api_view(['GET'])
def fill_in_the_blanks_questions(request):
    questions = FillInTheBlanksQuestion.objects.all()
    print(f"Retrieved Questions: {questions}")  # Debugging line
    serializer = FillInTheBlanksQuestionSerializer(questions, many=True)
    return Response(serializer.data)

class MCQQuestionListCreateView(generics.ListCreateAPIView):
    last_question = MCQQuestion.objects.all().first()
    print(last_question)

    # Check if the last_question exists and extract the qno
    if last_question:
        last_qno = last_question.qno
    else:
        last_qno = None
    print("the last q no is",last_qno)

    queryset = MCQQuestion.objects.order_by("-id")[0:20]
    serializer_class = MCQQuestionSerializer

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

    queryset = TrueFalseQuestion.objects.order_by("-id")[:int(last_qno)]

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

    queryset = QuestionAnswering.objects.order_by("-id")[:int(last_qno)]

    serializer_class = QuestionAnsweringSerializer

class QuestionAnsweringDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuestionAnswering.objects.all()
    serializer_class = QuestionAnsweringSerializer

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

    queryset = FillInTheBlanksQuestion.objects.order_by("-id")[10 if last_qno is None else int(last_qno):]
    serializer_class = FillInTheBlanksQuestionSerializer

class FillInTheBlanksQuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FillInTheBlanksQuestion.objects.all()
    serializer_class = FillInTheBlanksQuestionSerializer

# @api_view(['DELETE'])
# def delete_question(request, question_id):
#     question = get_object_or_404(MCQQuestion, id=question_id)
#     question.delete()
#     return JsonResponse({'message': 'Question deleted successfully!'})

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MCQQuestion
from .serializers import MCQQuestionSerializer

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
    


from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def submit_quiz(request):
    user_answers = request.data.get('answers', {})
    quiz_id = request.data.get('quiz_id', None)
    time_taken = request.data.get('time_taken', None)
    print(user_answers)
    print(quiz_id)
    print(time_taken)

    # Process the answers
    # Assuming you have a model for questions and answers
    correct_count = 0
    incorrect_count = 0

    for question_id, user_answer in user_answers.items():
        # print(question_id)
        try:
            question = MCQQuestion.objects.get(id=question_id)
            # print(question)
            correct_answer = question.correct_answer.strip().lower()
            print(correct_answer)
            if user_answer == correct_answer:
                correct_count += 1
            else:
                incorrect_count += 1
        except MCQQuestion.DoesNotExist:
            continue

    # Prepare the result
    result = {
        'correct': correct_count,
        'incorrect': incorrect_count,
        'time_taken': time_taken*100,
    }
    print(result)

    return Response(result)



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TrueFalseQuestion

@api_view(['POST'])
def submit_true_false_quiz(request):
    user_answers = request.data.get('answers', {})
    quiz_id = request.data.get('quiz_id', None)
    time_taken = request.data.get('time_taken', None)
    # print(user_answers)
    # print(quiz_id)
    print("time is",time_taken)

    correct = 0
    incorrect = 0

    for question_id, user_answer in user_answers.items():
        # print(question_id)
        try:
            question = TrueFalseQuestion.objects.get(id=question_id)
            # print(question)
            print(user_answer,".......................................")
            print(question.correct_answer,"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            if str(user_answer).lower() == str(question.correct_answer).lower():
           
                correct += 1
            else:
                incorrect += 1
        except TrueFalseQuestion.DoesNotExist:
            continue

    result = {
        'correct': correct,
        'incorrect': incorrect,
        'time_taken': time_taken,
    }

    return Response(result)