import { pgTable, uuid, varchar, boolean, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'supervisor']);

// Faculties Table
export const faculties = pgTable('faculties', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Departments Table
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  facultyId: uuid('faculty_id').references(() => faculties.id, { onDelete: 'cascade' }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Base Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: userRoleEnum('role').notNull(),
  facultyId: uuid('faculty_id').references(() => faculties.id),
  departmentId: uuid('department_id').references(() => departments.id),
  profileImage: text('profile_image'),
  signature: text('signature'),
  isActive: boolean('is_active').default(false).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Students Table (extends users)
export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  matricNumber: varchar('matric_number', { length: 50 }).notNull().unique(),
  studentNumber: varchar('student_number', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Supervisors Table (extends users)
export const supervisors = pgTable('supervisors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  onboardingToken: varchar('onboarding_token', { length: 255 }),
  onboardingTokenExpiry: timestamp('onboarding_token_expiry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Refresh Tokens Table
export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// OTP Table
export const otps = pgTable('otps', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  otp: varchar('otp', { length: 6 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'email_verification', 'password_reset'
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const facultiesRelations = relations(faculties, ({ many }) => ({
  departments: many(departments),
  users: many(users),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [departments.facultyId],
    references: [faculties.id],
  }),
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  faculty: one(faculties, {
    fields: [users.facultyId],
    references: [faculties.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  supervisor: one(supervisors, {
    fields: [users.id],
    references: [supervisors.userId],
  }),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
}));

export const supervisorsRelations = relations(supervisors, ({ one }) => ({
  user: one(users, {
    fields: [supervisors.userId],
    references: [users.id],
  }),
}));