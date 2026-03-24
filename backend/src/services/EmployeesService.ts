import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload, 
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema.js";

export interface EmployeesService {
  /**
   * Добавление нового сотрудника. 
   * Принимает данные без ID, возвращает полный объект с созданным ID.
   */
  addEmployee(empl: NewEmployee): Promise<Employee>;

  /**
   * Обновление данных.
   * Используем твой EmployeeUpdatePayload для строгости.
   */
  updateEmployee(payload: EmployeeUpdatePayload): Promise<Employee>;

  /**
   * Удаление сотрудника. 
   * Возвращает удаленный объект (полезно для уведомлений или undo).
   */
  deleteEmployee(id: string): Promise<Employee>;

  /**
   * Получение одного сотрудника по ID.
   */
  getEmployee(id: string): Promise<Employee>;

  /**
   * Получение списка с учетом фильтрации (зарплата, возраст, департамент).
   * Теперь типизировано через EmployeeFilter.
   */
  getAll(filter?: EmployeeFilter): Promise<Employee[]>;

  /**
   * Метод для принудительного сохранения (для файлового хранилища).
   * В случае SQL/Mongo может быть пустым, но в интерфейсе пусть будет.
   */
  save(): Promise<void>;
}