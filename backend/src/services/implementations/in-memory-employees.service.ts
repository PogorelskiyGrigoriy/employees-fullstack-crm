import { randomUUID } from 'node:crypto';
import pkg from 'lodash';
import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import type { StatsResponse, StatsDataItem } from "@crm/shared/schemas/stats.schema.js";
import { type EmployeesService } from '../EmployeesService.js';
import { calculateAge } from "@crm/shared/utils/dateUtils.js";
import { EMPLOYEES_CONFIG } from "@crm/shared/config/employees-config.js";

const { range, countBy } = pkg;

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

  async getStatistics(): Promise<StatsResponse> {
    const { salary, age } = EMPLOYEES_CONFIG;

    return {
      // 1. Distribution by Salary ranges
      salaryDistribution: this.calculateBins(
        this.employees,
        salary,
        (e) => e.salary,
        (v) => `${v / 1000}k`,
        (v, last) => `Salary: ${v}-${last ? 'max' : v + salary.interval}`
      ),

      // 2. Distribution by Age ranges
      ageDistribution: this.calculateBins(
        this.employees,
        age,
        (e) => calculateAge(e.birthDate),
        (v) => `${v}`,
        (v, last) => `Age: ${v}-${last ? 'max' : v + age.interval}`
      ),

      // 3. Distribution by Department count
      departmentDistribution: this.calculateDepartmentStats()
    };
  }

  /**
   * Generic helper for numeric binning (histograms).
   * Groups items into fixed-interval ranges based on EMPLOYEES_CONFIG.
   */
  private calculateBins<T>(
    items: T[],
    config: { min: number; max: number; interval: number },
    valueExtractor: (item: T) => number,
    xLabel: (v: number) => string,
    tooltip: (v: number, isLast: boolean) => string
  ): StatsDataItem[] {
    const { min, max, interval } = config;

    // Aggregate counts using lodash
    const stats = countBy(items, (item) => {
      const val = valueExtractor(item);
      const effectiveVal = Math.min(Math.max(val, min), max - 1);
      const offset = effectiveVal - min;
      return Math.floor(offset / interval) * interval + min;
    });

    // Generate complete range to include empty bins
    return range(min, max, interval).map((v) => {
      const isLast = v + interval >= max;
      return {
        xValue: xLabel(v),
        yValue: stats[v] || 0,
        tooltipValue: tooltip(v, isLast)
      };
    });
  }

  /**
   * Simple categorical grouping for departments.
   */
  private calculateDepartmentStats(): StatsDataItem[] {
    const stats = countBy(this.employees, 'department');
    
    return Object.entries(stats).map(([dept, count]) => ({
      xValue: dept,
      yValue: count,
      tooltipValue: `Department ${dept}: ${count} employees`
    }));
  }

  async save(): Promise<void> {
    return Promise.resolve();
  }
}