import { faker } from '@faker-js/faker';
import type { Employee } from '@crm/shared/schemas/employee.schema.js';
import { departmentSchema } from '@crm/shared/schemas/department.schema.js'; // Импортируем схему!
import { EMPLOYEES_CONFIG } from '@crm/shared/config/employees-config.js';
import { randomUUID } from 'node:crypto';

export const generateMockEmployees = (count: number): Employee[] => {
  // Вытаскиваем массив разрешенных департаментов прямо из Zod-схемы
  // .options доступен, если в shared/schemas/department.schema.ts используется z.enum()
  const availableDepartments = departmentSchema.options;

  return Array.from({ length: count }, (): Employee => { // Явно указываем, что возвращаем Employee
    const birthDateRaw = faker.date.birthdate({ 
      min: EMPLOYEES_CONFIG.age.min, 
      max: EMPLOYEES_CONFIG.age.max, 
      mode: 'age' 
    });

    // Гарантируем, что birthDate — это строка в формате YYYY-MM-DD
    const birthDate = birthDateRaw.toISOString().slice(0, 10);

     return {
      id: randomUUID(),
      fullName: faker.person.fullName(),
      salary: faker.number.int({ 
        min: EMPLOYEES_CONFIG.salary.min, 
        max: EMPLOYEES_CONFIG.salary.max 
      }),
      birthDate,
      department: faker.helpers.arrayElement(availableDepartments),
      avatar: faker.image.avatar(),
    };
  });
};