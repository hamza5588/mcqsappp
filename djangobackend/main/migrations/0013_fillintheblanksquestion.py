# Generated by Django 5.0.6 on 2024-08-21 22:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_alter_truefalsequestion_correct_answer'),
    ]

    operations = [
        migrations.CreateModel(
            name='FillInTheBlanksQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.TextField()),
                ('correct_answers', models.JSONField(default=list)),
            ],
        ),
    ]
