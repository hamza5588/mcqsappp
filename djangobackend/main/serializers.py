from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user, phone=phone)  # Create the profile with the phone number
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data.get('username'), password=data.get('password'))
        if user is None:
            raise serializers.ValidationError("Invalid username or password")
        return user

# class OptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Option
#         fields = ['id', 'option_text', 'option_letter']

# class QuestionSerializer(serializers.ModelSerializer):
#     options = OptionSerializer(many=True)

#     class Meta:
#         model = Question
#         fields = ['id', 'question_text', 'options']

#     def create(self, validated_data):
#         options_data = validated_data.pop('options')
#         question = Question.objects.create(**validated_data)
#         for option_data in options_data:
#             Option.objects.create(question=question, **option_data)
#         return question

#     def update(self, instance, validated_data):
#         options_data = validated_data.pop('options', [])
        
#         # Update the question text
#         instance.question_text = validated_data.get('question_text', instance.question_text)
#         instance.save()

#         # Get existing options for the question
#         existing_options = {option.id: option for option in instance.options.all()}
#         new_option_ids = set()

#         # Update or create options
#         for option_data in options_data:
#             option_id = option_data.get('id')
#             if option_id and option_id in existing_options:
#                 # Update existing option
#                 option = existing_options[option_id]
#                 option.option_text = option_data.get('option_text', option.option_text)
#                 option.option_letter = option_data.get('option_letter', option.option_letter)
#                 option.save()
#                 new_option_ids.add(option.id)
#             else:
#                 # Create new option
#                 new_option = Option.objects.create(question=instance, **option_data)
#                 new_option_ids.add(new_option.id)

#         # Delete options that are no longer in the updated data
#         for option_id in existing_options:
#             if option_id not in new_option_ids:
#                 existing_options[option_id].delete()

#         return instance

# class AnswerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Answer
#         fields = ['question', 'correct_option']

# from rest_framework import serializers
# from .models import Quiz

# class QuizSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Quiz
#         fields = ['id', 'file', 'number_of_questions', 'question_type', 'language', 'difficulty_level', 'created_at']









# from rest_framework import serializers
# from .models import MCQQuestion, TrueFalseQuestion,QuestionAnswering

# class MCQOptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = MCQQuestion
#         fields = ['question', 'option_a', 'option_b','option_c','option_d']

# class MCQSerializer(serializers.ModelSerializer):
#     options = MCQOptionSerializer(many=True)

    # class Meta:
    #     model = MCQQuestion
    #     fields = ['id', 'question_text', 'options']

    # def create(self, validated_data):
    #     options_data = validated_data.pop('options')
    #     mcq = MCQQuestion.objects.create(**validated_data)
    #     for option_data in options_data:
    #         MCQQuestion.objects.create(mcq=mcq, **option_data)
    #     return mcq

    # def update(self, instance, validated_data):
    #     options_data = validated_data.pop('options', [])
        
    #     instance.question_text = validated_data.get('question_text', instance.question_text)
    #     instance.save()

    #     existing_options = {option.id: option for option in instance.options.all()}
    #     new_option_ids = set()

    #     for option_data in options_data:
    #         option_id = option_data.get('id')
    #         if option_id and option_id in existing_options:
    #             option = existing_options[option_id]
    #             option.option_text = option_data.get('option_text', option.option_text)
    #             option.option_letter = option_data.get('option_letter', option.option_letter)
    #             option.is_correct = option_data.get('is_correct', option.is_correct)
    #             option.save()
    #             new_option_ids.add(option.id)
    #         else:
    #             new_option = MCQQuestion.objects.create(mcq=instance, **option_data)
    #             new_option_ids.add(new_option.id)

    #     for option_id in existing_options:
    #         if option_id not in new_option_ids:
    #             existing_options[option_id].delete()

    #     return instance

# class TrueFalseQuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TrueFalseQuestion
#         fields = ['id', 'question_text', 'is_true']

# class ShortAnswerQuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = QuestionAnswering
#         fields = ['id', 'question_text', 'answer']

from rest_framework import serializers
from .models import MCQQuestion

class MCQQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQQuestion
        fields = '__all__'


from rest_framework import serializers
from .models import MCQQuestion, TrueFalseQuestion, QuestionAnswering

class MCQQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQQuestion
        fields = ['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer']


class QuestionAnsweringSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswering
        fields = ['id', 'question', 'answer']

from rest_framework import serializers
from .models import MCQQuestion, TrueFalseQuestion

class TrueFalseQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrueFalseQuestion
        fields = '__all__'

from rest_framework import serializers
from .models import FillInTheBlanksQuestion

class FillInTheBlanksQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillInTheBlanksQuestion
        fields = '__all__'

# class QuestionSerializer(serializers.ModelSerializer):
#     options = OptionSerializer(many=True)

#     class Meta:
#         model = Question
#         fields = ['id', 'question_text', 'options']

#     def create(self, validated_data):
#         options_data = validated_data.pop('options')
#         question = Question.objects.create(**validated_data)
#         for option_data in options_data:
#             Option.objects.create(question=question, **option_data)
#         return question

#     def update(self, instance, validated_data):
#         options_data = validated_data.pop('options', [])
        
#         # Update the question text
#         instance.question_text = validated_data.get('question_text', instance.question_text)
#         instance.save()

#         # Get existing options for the question
#         existing_options = {option.id: option for option in instance.options.all()}
#         new_option_ids = set()

#         # Update or create options
#         for option_data in options_data:
#             option_id = option_data.get('id')
#             if option_id and option_id in existing_options:
#                 # Update existing option
#                 option = existing_options[option_id]
#                 option.option_text = option_data.get('option_text', option.option_text)
#                 option.option_letter = option_data.get('option_letter', option.option_letter)
#                 option.save()
#                 new_option_ids.add(option.id)
#             else:
#                 # Create new option
#                 new_option = Option.objects.create(question=instance, **option_data)
#                 new_option_ids.add(new_option.id)

#         # Delete options that are no longer in the updated data
#         for option_id in existing_options:
#             if option_id not in new_option_ids:
#                 existing_options[option_id].delete()

#         return instance

