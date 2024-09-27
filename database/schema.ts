import { allClubs, allDepartments, allRoles, allYears, type AllClubs, type AllDepartments, type AllRoles, type AllYears } from "@/lib/type";
import { sql } from "drizzle-orm";
import { pgTable, serial, text, varchar, uuid, pgEnum, integer, uniqueIndex, timestamp } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('status', ['initiated', 'success', 'failed']);
// export const certificateTypeEnum = pgEnum('certificateType', ['participation', 'winner', 'internship']);

export const roleEnum = pgEnum('role', ['NA', ...(Object.keys(allRoles) as AllRoles[])]);
export const departmentEnum = pgEnum('department', [
    'NA',
    ...(Object.keys(allDepartments) as AllDepartments[]), // ai, cs, eee, mca, etc
]);

export const yearEnum = pgEnum('year', [
    'NA',
    ...(Object.keys(allYears) as AllYears[]), // 2021, 2022, ...2027
]);

export const clubsEnum = pgEnum('club', [
    'SJCET',
    ...(Object.keys(allClubs) as AllClubs[]), // IEDC, IEEE, ...NEXUS
]);

export const user = pgTable('user', {
    email: varchar('email', { length: 191 }).primaryKey(),
    name: text('name'),
    phone: varchar('phone', { length: 256 }).notNull().unique(),

    department: departmentEnum('department').default('NA').notNull(),
    year: yearEnum('year').default('NA').notNull(),
    
    role: roleEnum('role').default('NA').notNull(),
    clubs: clubsEnum("clubs").array().default([]),

    createdAt: timestamp('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt'),
}, (table) => ({
    phoneIndex: uniqueIndex("phoneIndex").on(table.phone)
}));

export const event = pgTable('event', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    organisedBy: clubsEnum('organisedBy').array().default(['SJCET']).notNull(),

    activityPoints: integer("activityPoints").default(0),
    // amount: integer('amount').default(0).notNull(),
    remark: text('remark'),
    link: text("link"),

    createdAt: timestamp('createdAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt'),
    createdByEmail: varchar('createdByEmail', { length: 191 })
      .notNull()
      .references(() => user.email),
});

// export const certificate = pgTable('certificate', {
//     id: text('id').primaryKey(),
//     title: text('title').notNull(),
//     description: text('description'),
//     organisedBy: clubsEnum('organisedBy').array().default(['SJCET']).notNull(),
//     activityPoints: integer("activityPoints").default(0),
//     remark: text('remark'),
//     link: text("link"),
//     certificateType: certificateTypeEnum('certificateType').default("participation"),
// });