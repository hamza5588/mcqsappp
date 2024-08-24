from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer, LoginSerializer
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from langchain.llms import GooglePalm
from langchain import PromptTemplate
from langchain.chains import LLMChain, SequentialChain
from langchain import HuggingFaceHub
from dotenv import load_dotenv
import os
import pdfkit
from django.http import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import base64
from langchain.document_loaders import PyPDFLoader

import io
import re
from PyPDF2 import PdfReader

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404, redirect

from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import OutputFixingParser
import json
from langchain_core.output_parsers.json import JsonOutputParser
from main.models import Question, Option, Answer
from rest_framework.decorators import api_view
from .helping import generate_questions_from_file
apikey="sk-proj-WIqONjmhJjlNkeImihiWT3BlbkFJ0za2BbqjSwoZl6PyO7Bk"


model = ChatOpenAI(openai_api_key=apikey)




@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        login(request, user)
        a=42
        return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework import generics
from .models import Question
from rest_framework import viewsets

# class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Question.objects.all()
#     serializer_class = QuestionSerializer

# class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Answer.objects.all()
#     serializer_class = AnswerSerializer

# its new
# from .models import Answer
# from .serializers import AnswerSerializer
# @api_view(['GET'])
# def question_list(request):
#     """
#     List all questions or create a new question.
#     """
#     if request.method == 'GET':
#         questions = Question.objects.all().order_by("-id")
#         print(questions)
        
#         serializer = QuestionSerializer(questions, many=True)
#         return Response(serializer.data)
# 2
# @api_view(['GET'])
# def question_detail(request, pk):
#     """
#     Retrieve, update or delete a question.
#     """
#     try:
#         question = Question.objects.get(pk=pk)
#     except Question.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = QuestionSerializer(question)
#         return Response(serializer.data)
# 3
# @api_view(['GET'])
# def answer_list(request):
#     """
#     List all answers or create a new answer.
#     """
#     if request.method == 'GET':
#         answers = Answer.objects.all()
#         serializer = AnswerSerializer(answers, many=True)
#         return Response(serializer.data)

# 4
# @api_view(['GET'])
# def answer_detail(request, pk):
#     """
#     Retrieve, update or delete an answer.
#     """
#     try:
#         answer = Answer.objects.get(pk=pk)
#     except Answer.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = AnswerSerializer(answer)
#         return Response(serializer.data)
# @csrf_exempt   
# def update_question(request, question_id):
#     # Attempt to get the question object, return 404 if not found
#     question = get_object_or_404(Question, id=question_id)

#     # Initialize the serializer with the question object and incoming data
#     serializer = QuestionSerializer(question, data=request.data, partial=True)
    
#     # Validate the serializer data
#     if serializer.is_valid():
#         # Save and return the serialized data if valid
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     # Return validation errors with status 400 if invalid
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 5
# @api_view(['GET', 'POST'])
# def question_list(request):
#     if request.method == 'GET':
#         questions = Question.objects.all()
#         serializer = QuestionSerializer(questions, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = QuestionSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 6
# @api_view(['PUT', 'DELETE'])
# def question_detail(request, pk):
#     try:
#         question = Question.objects.get(pk=pk)
#     except Question.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'PUT':
#         serializer = QuestionSerializer(question, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         question.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    






from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Quiz

# class QuizViewSet(viewsets.ModelViewSet):
#     queryset = Quiz.objects.all().order_by('-created_at')
#     serializer_class = QuizSerializer
#     parser_classes = (MultiPartParser, FormParser)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Quiz
import os
import tempfile

# 7
# class QuizUploadView(APIView):
#     parser_classes = (MultiPartParser, FormParser)  # For handling file uploads

#     def post(self, request, *args, **kwargs):
#         serializer = QuizSerializer(data=request.data)
#         a=request.data
#         for i,j in a.items():
#             print(i,".............",j)
#         print(request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request, *args, **kwargs):
#         quizzes = Quiz.objects.all()
#         serializer = QuizSerializer(quizzes, many=True)
#         return Response(serializer.data)
    

# not used
# from django.http import JsonResponse
# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework import status

# class GenerateQuestionsView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         # Retrieve form data
#         file = request.FILES.get('file')
#         subject = "detect by own"
#         sub_topic = "detect by own"
#         num_questions = int(request.data.get('number_of_questions'))
#         difficulty_level = request.data.get('difficulty_level')
#         language = request.data.get('language')
#         question_type = request.data.get('question_type')
        
#         temp_dir = tempfile.gettempdir()
#         file_path = os.path.join(temp_dir, file.name)

#         with open(file_path, 'wb+') as destination:
#             for chunk in file.chunks():
#                 destination.write(chunk)

#         # Generate questions
#         try:
#             questions = generate_questions_from_file(
#                 file_path=file_path,
#                 subject=subject,
#                 sub_topic=sub_topic,
#                 num_questions=num_questions,
#                 difficulty_level=difficulty_level,
#                 language=language,
#                 question_type=question_type
#             )
#             print(questions)
#             return JsonResponse(questions, safe=False, status=status.HTTP_200_OK)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @csrf_exempt
# @api_view(['DELETE'])
# def delete_question(request, question_id):
#     question = get_object_or_404(Question, id=question_id)
#     question.delete()
#     return JsonResponse({'message': 'Question deleted successfully!'})
@csrf_exempt 
@api_view(['POST'])
def receive_text(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text')
            prompt_template = PromptTemplate(
            input_variables=["context", "subject", "sub_topic", "num_questions", "difficulty_level", "language", "type"],
                    template="""
            Please generate a set of questions based on the following criteria:
            
            - **Subject**: {subject}
            - **Sub-Topic**: {sub_topic}
            - **Number of Questions**: {num_questions}
            - **Difficulty Level**: {difficulty_level}
            - **Language**: {language}
            - **Type**: {type}

            {context}

            ### Instructions:

            Depending on the type specified, create the questions in the appropriate format:
            
            - **MCQs**: Provide multiple-choice questions with four options each.
            - **Question-Answer**: Provide a list of questions with detailed answers.
            - **Fill in the Blanks**: Provide sentences with missing words, indicated by underscores.
            **Matching**: Provide pairs of items to be matched with each other, similar to this example:
            - **Terms**: ["Verbs", "Pronouns", "Adjectives", "Nouns"]
            - **Definitions**: [
                "Words that express actions or states of being",
                "Words that replace nouns",
                "Words that describe or modify nouns",
                "Words that show relationships between nouns and other words"
                ]
            - **Mix**: Create a mixture of the above types, ensuring a variety of question formats.

            ### Output Format:

            For MCQs:
            ```
            {{
            "question_1": {{
                "question": "Your question text here?",
                "options": {{
                "A": "Option A text",
                "B": "Option B text",
                "C": "Option C text",
                "D": "Option D text"
                }},
                "correct_answer": "The correct option letter"
            }},
            ...
            }}
            ```

            For Question-Answer:
            ```
            {{
            "question_1": {{
                "question": "Your question text here?",
                "answer": "Your answer text here"
            }},
            ...
            }}
            ```

            For Fill in the Blanks:
            ```
            {{
            "question_1": {{
                "sentence": "The quick ___ fox jumps over the lazy dog.",
                "answer": "brown"
            }},
            ...
            }}
            ```

            For Matching:
            ```
            {{
            "question_1": {{
                "question defination,
                "definitions": ["Definition 1", "Definition 2", ...],
                "correct_pairs": {{
                "Term 1": "[Definition 1,Defination2]",
                ...
                }}
            }},
            ...
            }}

            For Mix:
            ```
            // A combination of the formats above
            ```

            Please generate the questions accordingly and output them in JSON format.
    """
)
          
            json_parser = JsonOutputParser()
      


            output_parser = OutputFixingParser.from_llm(parser=json_parser, llm=model)

            # Create the LLM Chain
            mcq_chain = LLMChain(
                prompt=prompt_template,
                llm=model,
                output_parser=output_parser
            )
            context = """
            Create questions about basic Python programming concepts.
            """
            subject = "grammer"
            sub_topic = "part of speech"
            num_questions = 5
            difficulty_level = "Easy"
            language = "English"
            type = "fill in the blanks"  # Can be MCQs, Question-Answer, Fill in the Blanks, Matching, or Mix

            # Run the chain with the specified parameters
            result = mcq_chain.run({
                "context": context,
                "subject": subject,
                "sub_topic": sub_topic,
                "num_questions": num_questions,
                "difficulty_level": difficulty_level,
                "language": language,
                "type": type
            })

            for question_id, question_details in result.items():
                question = Question.objects.create(question_text=question_details['question'])
            
           
                options = question_details['options']
                option_instances = {}
                for option_key, option_text in options.items():
                    option_instance = Option.objects.create(
                        question=question,
                        option_text=option_text,
                        option_letter=option_key
                    )
                    option_instances[option_key] = option_instance
                    
                    
                correct_option_key = question_details['correct_answer']
                correct_option = option_instances[correct_option_key]
                Answer.objects.create(question=question, correct_option=correct_option)
                from .models import QuestionAnswering
                latest_question = QuestionAnswering.objects.order_by('-id').first()
                print(latest_question)
                
                print(f"Stored {question_id} with correct answer {correct_option_key} in the database.")

            


            

            return JsonResponse({'message': 'Text receive??d successfully'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            # Log the exception for debugging
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)