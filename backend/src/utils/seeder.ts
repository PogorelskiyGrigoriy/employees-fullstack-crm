/**
 * @module Seeder
 * Utilities for generating mock data using Faker.js.
 */
import { faker } from '@faker-js/faker';
import type { Employee } from '@crm/shared/schemas/employee.schema.js';
import { departmentSchema } from '@crm/shared/schemas/department.schema.js';
import { EMPLOYEES_CONFIG } from '@crm/shared/config/employees.config.js';
import { randomUUID } from 'node:crypto';

/**
 * Generates an array of mock employees based on the provided count.
 */
export const generateMockEmployees = (count: number): Employee[] => {
  const availableDepartments = departmentSchema.options;

  return Array.from({ length: count }, (): Employee => {
    const birthDateRaw = faker.date.birthdate({ 
      min: EMPLOYEES_CONFIG.age.min, 
      max: EMPLOYEES_CONFIG.age.max, 
      mode: 'age' 
    });

    // Ensure birthDate is a string in YYYY-MM-DD format
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