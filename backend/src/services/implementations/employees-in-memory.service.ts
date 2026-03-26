import { randomUUID } from 'node:crypto';
import pkg from 'lodash';
import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import type { StatsResponse, StatsDataItem, DepartmentInfo } from "@crm/shared/schemas/stats.schema.js";
import type { SortParams } from "@crm/shared/schemas/common.js";
import { type EmployeesService } from '../employees.service.js';
import { calculateAge } from "@crm/shared/utils/dateUtils.js";
import { EMPLOYEES_CONFIG } from "@crm/shared/config/employees-config.js";
import { departmentSchema } from "@crm/shared/schemas/department.schema.js";
import { generateMockEmployees } from '../../utils/seeder.js';


// Extract necessary helpers from lodash
const { range, countBy, groupBy, meanBy, orderBy } = pkg;

export class InMemoryEmployeesService implements EmployeesService {
  private employees: Employee[] = [];

  /**
   * The constructor now accepts an optional initial count.
   * If provided, it auto-populates the memory store.
   */
  constructor(initialCount = 20) {
    if (initialCount > 0) {
      const mocks = generateMockEmployees(initialCount);
      // We use addEmployee to ensure any validation or secondary logic is triggered
      mocks.forEach(emp => this.addEmployee(emp));
    }
  }

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

  /**
 * Retrieves all employees with filtering and sorting applied.
 */
async getAll(filters: any, sortParams: any): Promise<Employee[]> {
  let result = [...this.employees];

  // --- 1. DEPARTMENT FILTER ---
  if (filters.department && filters.department !== 'All') {
    result = result.filter(e => e.department === filters.department);
  }

  // --- 2. SALARY FILTER ---
  if (filters.minSalary !== undefined || filters.maxSalary !== undefined) {
    result = result.filter(e => 
      e.salary >= (filters.minSalary ?? 0) && 
      e.salary <= (filters.maxSalary ?? Infinity)
    );
  }

  // --- 3. AGE FILTER (Using shared utility) ---
  if (filters.minAge !== undefined || filters.maxAge !== undefined) {
    result = result.filter(e => {
      const age = calculateAge(e.birthDate);
      return age >= (filters.minAge ?? 0) && age <= (filters.maxAge ?? 100);
    });
  }

  // --- 4. SORTING ---
  const { sortBy, sortOrder } = sortParams;

  if (sortBy && sortOrder) {
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


  /**
   * Orchestrates the calculation of all analytical data.
   */
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

      // 3. Simple count per department for charts
      departmentDistribution: this.calculateDepartmentStats(),

      // 4. Detailed analytics (avg salary/age) per department
      departmentAnalytics: this.calculateDepartmentAnalytics()
    };
  }

  /**
   * Generic helper for numeric binning (histograms).
   */
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
      const offset = effectiveVal - min;
      return Math.floor(offset / interval) * interval + min;
    });

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
   * Aggregates employee counts into chart-ready format.
   */
  private calculateDepartmentStats(): StatsDataItem[] {
    const stats = countBy(this.employees, 'department');
    
    return Object.entries(stats).map(([dept, count]) => ({
      xValue: dept,
      yValue: count,
      tooltipValue: `Department ${dept}: ${count} employees`
    }));
  }

  /**
   * Calculates averages (Salary and Age) for each department defined in the schema.
   */
  private calculateDepartmentAnalytics(): DepartmentInfo[] {
    // Group employees by department
    const grouped = groupBy(this.employees, 'department');
    
    // Get all possible departments from the Zod enum options
    const allDepartments = departmentSchema.options;

    return allDepartments.map((dept): DepartmentInfo => {
      const deptEmployees = grouped[dept] || [];
      const count = deptEmployees.length;

      return {
        department: dept,
        numEmployees: count,
        // Calculate rounded average salary
        avgSalary: count > 0 
          ? Math.round(meanBy(deptEmployees, 'salary')) 
          : 0,
        // Calculate rounded average age
        avgAge: count > 0 
          ? Math.round(meanBy(deptEmployees, (e) => calculateAge(e.birthDate))) 
          : 0
      };
    });
  }

  async save(): Promise<void> {
    // No-op for in-memory implementation
    return Promise.resolve();
  }
}