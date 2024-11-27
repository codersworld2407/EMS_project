from django.shortcuts import render
from django.http import HttpResponse
from .models import Employee, Department, Project
from .serializers import DepartmentSerializers, EmployeeSerializers, ProjectSerializers
from django.utils import timezone

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
# from .models import Employee, Department, Project
# from .serializers import EmployeeSerializer, DepartmentSerializer, ProjectSerializer
# from django.db.models import Max, Sum

# Department APIViews
class DepartmentListView(APIView):
    def get(self, request):
        department = Department.objects.all()
        serializer = DepartmentSerializers(department, many = True)
        return Response(serializer.data, status= status.HTTP_200_OK)
    
    def post(self, request):
        serializer = DepartmentSerializers(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DepartmentDetailView(APIView):
    def put(self, request, id):
        try:
            department = Department.objects.get(id = id)
        except Department.DoesNotExist:
            return Response({"error":"Department not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DepartmentSerializers(department, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, id):
        try:
            department = Department.objects.get(id = id)
            if department.employees.exists():
                return Response({"error":"Cannot delete department as employee exists"}, status=status.HTTP_400_BAD_REQUEST)
            department.delete()
            return Response({"MSG": "Department deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Department.DoesNotExist:
            return Response({"error":"No department exists"}, status=status.HTTP_404_NOT_FOUND)


class EmployeeListView(APIView):
    def get(self, request):
        employee = Employee.objects.all()
        serializer = EmployeeSerializers(employee, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = EmployeeSerializers(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EmployeeDetailView(APIView):
    def put(self, request, id):
        try:
            employee = Employee.objects.get(id = id)
        except Employee.DoesNotExist:
            return Response({"error":"Employee not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EmployeeSerializers(employee, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, id):
        try:
            employee = Employee.objects.get(id = id)
            employee.delete()
            return Response({"MSG": "Employee deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Employee.DoesNotExist:
            return Response({"error":"No eemployee exists"}, status=status.HTTP_404_NOT_FOUND)
    
class EmployeeHighestSalary(APIView):
    def get(self, request):
        try:
            employee = Employee.objects.all()
            max_salary = 0
            for emp in employee:
                if max_salary<emp.salary:
                    name = emp.name
                    max_salary = emp.salary
            highest_salary_emp = {
            "Name": name,
            "Salary": max_salary
            }
            return Response(highest_salary_emp, status= status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({"error":"Employee not found"}, status= status.HTTP_404_NOT_FOUND)
        
class secondHighestEmployee(APIView):
    def get(self,request):
        sorted_salary = Employee.objects.order_by("-salary")
        if len(sorted_salary) >= 2:
            sorted_salary = sorted_salary[1:2]
        serializer = EmployeeSerializers(sorted_salary, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
from django.db.models import Sum
class totalSalaryByDeprtment(APIView):
    def get(self,request):
        departments = Department.objects.annotate(total_salary = Sum('employees__salary'))

        data = [
            {
                'department' : department.name,
                'total salary' : department.total_salary
            }
            for department in departments
        ]
        return Response(data)
    

# ------------PROJECT--------------
class ProjectListView(APIView):
    def get(self, request):
        project = Project.objects.all()
        serializer = ProjectSerializers(project, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self,request):
        serializer = ProjectSerializers(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetailView(APIView):
    def get(self, id):
        try:
            project = Project.objects.get(id = id)
        except Project.DoesNotExist:
            return Response({"error":"Project does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, id):
        try:
            project = Project.objects.get(id = id)
        except Project.DoesNotExist:
            return Response({"error":"Project does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
        if "status" in request.data:
            new_status = request.data["status"]
            project.status = new_status
            project.save()
            return Response({"msg":"Status Updated Successfully"}, status=status.HTTP_200_OK)
        # serializer = ProjectSerializers(project, data = request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            project = Project.objects.get(id = id)
            if project.end_date > timezone.now().date():
                return Response({'error' : 'Project cannot be delete before its end date'})
            project.delete()
            return Response({"msg":"Project deleted successfully"}, status= status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({"error":"No project exists"}, status=status.HTTP_404_NOT_FOUND)
        
class ProjectMemberView(APIView):
    def put(self, request, id):
        try:
            projects = Project.objects.get(id = id)
        except Project.DoesNotExist:
            return Response({"error":"Project does not exists"}, status= status.HTTP_400_BAD_REQUEST)
        
        member_id = request.data.get("member_id")
        try:
            member = Employee.objects.get(id = member_id)
        except:
            return Response({'error' : 'Member Not Found'}, status= status.HTTP_404_NOT_FOUND)

        if member_id in [member.id for member in projects.team.all()]:
            return Response({"error":"Member already exsts"})
        projects.team.add(member_id)
        return Response({'message' : 'Member added successfuly'})
    
class ProjectDeleteMemberView(APIView):
    def put(self, request, id):
        try:
            projects = Project.objects.get(id = id)
        except Project.DoesNotExist:
            return Response({"error":"Project does not exists"}, status= status.HTTP_400_BAD_REQUEST)
        
        member_id = request.data.get("member_id")
        try:
            member = Employee.objects.get(id = member_id)
        except:
            return Response({'error' : 'Member Not Found'}, status= status.HTTP_404_NOT_FOUND)

        if member_id not in [member.id for member in projects.team.all()]:
            return Response({"error":"Member does not exsts"})
        projects.team.remove(member_id)
        return Response({'message' : 'Member deleted successfuly'})

class BudgetOfProject(APIView):
    def get(self, request, id):
        try:
            project = Project.objects.get(id = id)
        
            budget = sum(employee.salary for employee in project.team.all())

            return Response({"Project Name":project.name, "Budget":budget}, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response({"error":"No project exists."}, status=status.HTTP_404_NOT_FOUND)
        
class ProjectStatusView(APIView):
    def get(self,request,give_status):
        if give_status not in [choice[0] for choice in Project.STATUS_CHOICES]:
            return Response({"error":"Invalid Status"}, status=status.HTTP_404_NOT_FOUND)
        
        project = Project.objects.filter(status = give_status)
        serializer = ProjectSerializers(project, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)