import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";
import type { StatsResponse } from "@crm/shared/schemas/stats.schema.js";
import type { SortParams } from "@crm/shared/schemas/common.schema.js";

export interface EmployeesService {
  getAll(filter?: EmployeeFilter, sort?: SortParams): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee>;
  addEmployee(empl: NewEmployee): Promise<Employee>;
  updateEmployee(payload: EmployeeUpdatePayload): Promise<Employee>;
  deleteEmployee(id: string): Promise<Employee>;
  getStatistics(): Promise<StatsResponse>;
}