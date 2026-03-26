import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import type { StatsResponse } from "@crm/shared/schemas/stats.schema.js";
import type { SortParams } from "@crm/shared/schemas/common.js";

export interface EmployeesService {
  addEmployee(empl: NewEmployee): Promise<Employee>;
  updateEmployee(payload: EmployeeUpdatePayload): Promise<Employee>;
  deleteEmployee(id: string): Promise<Employee>;
  getEmployee(id: string): Promise<Employee>;
  
  /**
   * Supports both filtering and sorting
   */
  getAll(filter?: EmployeeFilter, sort?: SortParams): Promise<Employee[]>;
  
  getStatistics(): Promise<StatsResponse>;
  save(): Promise<void>;
}