import { v4 as uuidv4 } from 'uuid';
import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import { type EmployeesService } from '../EmployeesService.js';
import { calculateAge } from "@crm/shared/utils/dateUtils.js";

export class InMemoryEmployeesService implements EmployeesService {
  private employees: Employee[] = [];

  async addEmployee(data: NewEmployee): Promise<Employee> {
    const newEmployee: Employee = {
      ...data,
      id: uuidv4(),
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async updateEmployee({ id, changes }: EmployeeUpdatePayload): Promise<Employee> {
  const index = this.employees.findIndex(e => e.id === id);
  if (index === -1) throw new Error(`Employee with id ${id} not found`);

  const updated = { 
    ...this.employees[index], 
    ...changes, 
    id 
  } as Employee;

  this.employees[index] = updated;
  return updated;
}

  async deleteEmployee(id: string): Promise<Employee> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Employee with id ${id} not found`);

    const [deleted] = this.employees.splice(index, 1);
    return deleted;
  }

  async getEmployee(id: string): Promise<Employee> {
    const employee = this.employees.find(e => e.id === id);
    if (!employee) throw new Error(`Employee with id ${id} not found`);
    return employee;
  }

  async getAll(filter?: EmployeeFilter): Promise<Employee[]> {
    if (!filter) return [...this.employees];

    return this.employees.filter(emp => {
      const matchesDept = filter.department === "All" || emp.department === filter.department;
      const matchesSalary = emp.salary >= filter.minSalary && emp.salary <= filter.maxSalary;
      
      const age = calculateAge(emp.birthDate);
      const matchesAge = age >= filter.minAge && age <= filter.maxAge;

      return matchesDept && matchesSalary && matchesAge;
    });
  }

  async save(): Promise<void> {
    // В памяти сохранять некуда, просто имитируем успех
    return Promise.resolve();
  }
}