import type { Employee } from "@shared/schemas/employee.schema.js";

// Определяем интерфейс фильтров для расширяемости (например, если добавится поиск по имени)
export interface EmployeeFilters {
  department?: string;
  minSalary?: number;
}

export interface IEmployeesService {
  // Найти одного
  getById(id: number | string): Promise<Employee | null>;

  // Получить всех с опциональной фильтрацией
  getAll(filters?: EmployeeFilters): Promise<Employee[]>;

  // Создать (обычно возвращает созданный объект с присвоенным ID)
  create(employee: Omit<Employee, 'id'>): Promise<Employee>;

  // Обновить (Partial позволяет передать только те поля, которые изменились)
  update(id: number | string, data: Partial<Employee>): Promise<Employee>;

  // Удалить (часто возвращает void или boolean, но можно и сам объект)
  delete(id: number | string): Promise<boolean>;

  // Метод для "сохранения" (актуально для In-Memory или файлового хранения)
  save(): Promise<void>;
}