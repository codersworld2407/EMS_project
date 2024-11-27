from django.db import models

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Employee(models.Model):
    name = models.CharField(max_length=100)
    salary = models.FloatField()
    designation = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    address = models.CharField(max_length=255)
    projects = models.ManyToManyField('Project', related_name='team_members', blank=True, null=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('ON-GOING', 'On-going'),
        ('ENDED', 'Ended'),
    ]

    name = models.CharField(max_length=100)
    team = models.ManyToManyField('Employee', related_name='team_projects')
    team_lead = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='leading_projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True)

    def __str__(self):
        return self.name
