import { randomUUID } from 'node:crypto';
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
      id: randomUUID(),
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  async updateEmployee({ id, changes }: EmployeeUpdatePayload): Promise<Employee> {
    const index = this.employees.findIndex(e => e.id === id);
    
    if (index === -1) {
        throw new Error(`Employee with id ${id} not found`);
    }
    const existing = this.employees[index]!;

    // Создаем обновленный объект, гарантируя, что ID не перезапишется из changes
    const updated = { 
      ...existing,
      ...changes,
      id 
    } as Employee;

    this.employees[index] = updated;
    return updated;
  }

  async deleteEmployee(id: string): Promise<Employee> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Employee with id ${id} not found`);

    const [deleted] = this.employees.splice(index, 1) as [Employee];
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
      // 1. Фильтр по департаменту
      const matchesDept = filter.department === "All" || emp.department === filter.department;
      
      // 2. Фильтр по зарплате
      const matchesSalary = emp.salary >= filter.minSalary && emp.salary <= filter.maxSalary;
      
      // 3. Фильтр по возрасту (используем общую логику из shared)
      const age = calculateAge(emp.birthDate);
      const matchesAge = age >= filter.minAge && age <= filter.maxAge;

      return matchesDept && matchesSalary && matchesAge;
    });
  }

  async save(): Promise<void> {
    return Promise.resolve();
  }
}