
using Day7.Application.DTO;
using FluentValidation;

namespace Application.Validators
{
    public class EmployeeValidator : AbstractValidator<EmployeeDto>
    {
        public EmployeeValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(100);

            RuleFor(x => x.Department)
                .NotEmpty().WithMessage("Department is required");

            RuleFor(x => x.Salary)
                .GreaterThan(0).WithMessage("Salary must be greater than 0");

            RuleFor(x => x.JoiningDate)
                .LessThanOrEqualTo(DateTime.Now)
                .WithMessage("Joining date cannot be future");
        }
    }
}