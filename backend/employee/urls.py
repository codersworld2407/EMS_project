from django.urls import path
from .views import (
    DepartmentListView,
    DepartmentDetailView,
    EmployeeListView,
    ProjectListView,
    ProjectDetailView,
    ProjectMemberView,
    ProjectDeleteMemberView,
    BudgetOfProject,
    ProjectStatusView,
    EmployeeHighestSalary,
    secondHighestEmployee,
    totalSalaryByDeprtment,
    EmployeeDetailView
)

urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='department-list-create'),
    path('departments/<int:id>',DepartmentDetailView.as_view(), name = 'department-detail-update'),
    path('employees/', EmployeeListView.as_view(), name = "employee-list-create"),
    path('employees/<int:id>', EmployeeDetailView.as_view(), name = 'employee-update-delete'),
    path('projects/', ProjectListView.as_view(), name = "project-list-create"),
    path('projects/<int:id>', ProjectDetailView.as_view(), name='project-detail-update'),
    path('projects/<int:id>/add-member', ProjectMemberView.as_view(), name = 'add member'),
    path('projects/<int:id>/delete-member', ProjectDeleteMemberView.as_view(), name = 'delete member'),
    path('projects/<int:id>/budget/', BudgetOfProject.as_view(), name = 'budget'),
    path('employees/highest-salary/', EmployeeHighestSalary.as_view(), name= 'highest-salary'),
    path('employees/second-highest-salary', secondHighestEmployee.as_view(), name= 'second-highest-salary'),
    path('projects/<str:give_status>', ProjectStatusView.as_view(), name = "status-view"),
    path('departments/total-salary/', totalSalaryByDeprtment.as_view(), name = 'total-salary-department')
]
