# Generated by Django 5.0.6 on 2024-08-09 23:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_mcqquestion_questionanswering_truefalsequestion'),
    ]

    operations = [
        migrations.AddField(
            model_name='mcqquestion',
            name='qno',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
