/**
 * @module InMemoryEmployeesService
 * Implementation of EmployeesService using a volatile in-memory array.
 * Strictly follows shared Zod schemas for data integrity and uses custom AppErrors.
 */
import { randomUUID } from 'node:crypto';
import pkg from 'lodash';
import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import type { StatsResponse, DepartmentInfo, StatsDataItem } from "@crm/shared/schemas/stats.schema.js";
import type { SortParams } from "@crm/shared/schemas/common.schema.js";
import { type EmployeesService } from '../employees.service.js';
import { calculateAge } from "@crm/shared/utils/date-utils.js";
import { EMPLOYEES_CONFIG } from "@crm/shared/config/employees.config.js";
import { departmentSchema } from "@crm/shared/schemas/department.schema.js";
import { generateMockEmployees } from '../../utils/employees-seeder.js';
import { NotFoundError } from '../../utils/app-errors.js';

const { range, countBy, groupBy, meanBy } = pkg;

export class InMemoryEmployeesService implements EmployeesService {
  private employees: Employee[] = [];

  constructor(initialCount = 20) {
    if (initialCount > 0) {
      this.employees = generateMockEmployees(initialCount);
    }
  }

  private async persist(): Promise<void> {
    return Promise.resolve();
  }

  async getAll(filters?: EmployeeFilter, sortParams?: SortParams): Promise<Employee[]> {
    let result = [...this.employees];

    if (filters) {
      if (filters.department && filters.department !== 'All') {
        result = result.filter(e => e.department === filters.department);
      }
      result = result.filter(e => 
        e.salary >= filters.minSalary && e.salary <= filters.maxSalary
      );
      result = result.filter(e => {
        const age = calculateAge(e.birthDate);
        return age >= filters.minAge && age <= filters.maxAge;
      });
    }

    if (sortParams?.sortBy && sortParams?.sortOrder) {
      const { sortBy, sortOrder } = sortParams;
      result.sort((a, b) => {
        const valA = a[sortBy as keyof Employee];
        const valB = b[sortBy as keyof Employee];
        if (valA === undefined || valB === undefined) return 0;

        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }

  async getEmployee(id: string): Promise<Employee> {
    const employee = this.employees.find(e => e.id === id);
    if (!employee) throw new NotFoundError(`Employee with ID ${id}`);
    return employee;
  }

  async addEmployee(data: NewEmployee): Promise<Employee> {
    const newEmployee: Employee = { ...data, id: randomUUID() };
    this.employees.push(newEmployee);
    await this.persist();
    return newEmployee;
  }

  async updateEmployee({ id, changes }: EmployeeUpdatePayload): Promise<Employee> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) throw new NotFoundError(`Employee with ID ${id}`);

    const updated = { ...this.employees[index]!, ...changes, id } as Employee;
    this.employees[index] = updated;
    
    await this.persist();
    return updated;
  }

  async deleteEmployee(id: string): Promise<Employee> {
    const index = this.employees.findIndex(e => e.id === id);
    if (index === -1) throw new NotFoundError(`Employee with ID ${id}`);

    const [deleted] = this.employees.splice(index, 1) as [Employee];
    await this.persist();
    return deleted;
  }

  async getStatistics(): Promise<StatsResponse> {
    const { salary, age } = EMPLOYEES_CONFIG;

    return {
      salaryDistribution: this.calculateBins(
        this.employees,
        salary,
        (e) => e.salary,
        (v) => `${v / 1000}k`,
        (v, last) => `Range: ${v}${last ? '+' : '-' + (v + salary.interval)}`
      ),
      ageDistribution: this.calculateBins(
        this.employees,
        age,
        (e) => calculateAge(e.birthDate),
        (v) => `${v}`,
        (v, last) => `Age: ${v}${last ? '+' : '-' + (v + age.interval)}`
      ),
      departmentDistribution: this.calculateDepartmentStats(),
      departmentAnalytics: this.calculateDepartmentAnalytics()
    };
  }

  private calculateBins<T>(
    items: T[],
    config: { min: number; max: number; interval: number },
    valueExtractor: (item: T) => number,
    xLabel: (v: number) => string,
    tooltip: (v: number, isLast: boolean) => string
  ): StatsDataItem[] {
    const { min, max, interval } = config;
    const stats = countBy(items, (item) => {
      const val = valueExtractor(item);
      const effectiveVal = Math.min(Math.max(val, min), max - 1);
      return Math.floor((effectiveVal - min) / interval) * interval + min;
    });

    return range(min, max, interval).map((v) => ({
      xValue: xLabel(v),
      yValue: stats[v] || 0,
      tooltipValue: tooltip(v, v + interval >= max)
    }));
  }

  private calculateDepartmentStats(): StatsDataItem[] {
    const stats = countBy(this.employees, 'department');
    return Object.entries(stats).map(([dept, count]) => ({
      xValue: dept,
      yValue: count,
      tooltipValue: `${dept}: ${count} employees`
    }));
  }

  private calculateDepartmentAnalytics(): DepartmentInfo[] {
    const grouped = groupBy(this.employees, 'department');
    return departmentSchema.options.map((dept): DepartmentInfo => {
      const deptEmployees = grouped[dept] || [];
      const count = deptEmployees.length;

      return {
        department: dept,
        numEmployees: count,
        avgSalary: count > 0 ? Math.round(meanBy(deptEmployees, 'salary')) : 0,
        avgAge: count > 0 ? Math.round(meanBy(deptEmployees, (e) => calculateAge(e.birthDate))) : 0
      };
    });
  }
}