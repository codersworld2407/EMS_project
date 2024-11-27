from rest_framework import serializers
from .models import Department,Project,Employee

class DepartmentSerializers(serializers.ModelSerializer):
    class Meta:
        model= Department
        fields='__all__'

class EmployeeSerializers(serializers.ModelSerializer):
    class Meta:
        model= Employee
        fields= '__all__'

class ProjectSerializers(serializers.ModelSerializer):
    team= serializers.PrimaryKeyRelatedField(many = True, queryset = Employee.objects.all())
    team_lead = serializers.PrimaryKeyRelatedField (queryset = Employee.objects.all())
    class Meta:
        model= Project
        fields= '__all__'