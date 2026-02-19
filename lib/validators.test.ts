import { describe, it, expect } from 'vitest';
import { userCreateSchema, jobCreateSchema } from './validators';

describe('userCreateSchema', () => {
  it('validates a correct user', () => {
    const result = userCreateSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      userType: 'individual',
      name: 'John',
      lastname: 'Doe',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = userCreateSchema.safeParse({
      email: 'invalid',
      password: 'password123',
      userType: 'individual',
      name: 'John',
      lastname: 'Doe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = userCreateSchema.safeParse({
      email: 'test@example.com',
      password: '123',
      userType: 'individual',
      name: 'John',
      lastname: 'Doe',
    });
    expect(result.success).toBe(false);
  });
});

describe('jobCreateSchema', () => {
  it('validates a correct job', () => {
    const result = jobCreateSchema.safeParse({
      title: 'Developer',
      description: 'Great job',
      jobTypes: '["CDI"]',
      company: 'Acme',
      location: 'Paris',
      positionLocation: 'On-Site',
    });
    expect(result.success).toBe(true);
  });
});
