import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import type { StatsResponse } from "@crm/shared/schemas/stats.schema.js";

export interface EmployeesService {
  addEmployee(empl: NewEmployee): Promise<Employee>;
  updateEmployee(payload: EmployeeUpdatePayload): Promise<Employee>;
  deleteEmployee(id: string): Promise<Employee>;
  getEmployee(id: string): Promise<Employee>;
  getAll(filter?: EmployeeFilter): Promise<Employee[]>;
  
  /**
   * Calculates all analytical distributions (Salary, Age, Departments).
   */
  getStatistics(): Promise<StatsResponse>;

  save(): Promise<void>;
}