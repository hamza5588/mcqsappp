# Generated by Django 5.0.6 on 2024-08-22 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0014_alter_fillintheblanksquestion_correct_answers'),
    ]

    operations = [
        migrations.AddField(
            model_name='fillintheblanksquestion',
            name='qno',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='questionanswering',
            name='qno',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='truefalsequestion',
            name='qno',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
