import { 
  boolean, 
  integer, 
  pgTable, 
  varchar, 
  uuid, 
  timestamp, 
  text, 
  decimal,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("user"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    deletedAtIdx: index("users_deleted_at_idx").on(table.deletedAt)
  };
});

// Organizations table
export const organizationsTable = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  website: varchar("website", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    deletedAtIdx: index("organizations_deleted_at_idx").on(table.deletedAt)
  };
});

// Organization members table
export const organizationMembersTable = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  organizationId: uuid("organization_id").notNull().references(() => organizationsTable.id),
  role: varchar("role", { length: 50 }).default("member"),
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    userIdIdx: index("org_members_user_id_idx").on(table.userId),
    organizationIdIdx: index("org_members_organization_id_idx").on(table.organizationId),
    userOrgIdx: index("org_members_user_org_idx").on(table.userId, table.organizationId),
    deletedAtIdx: index("org_members_deleted_at_idx").on(table.deletedAt)
  };
});

// Plans table
export const plansTable = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  interval: varchar("interval", { length: 50 }).notNull(),
  features: text("features"),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  trialDays: integer("trial_days").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    deletedAtIdx: index("plans_deleted_at_idx").on(table.deletedAt)
  };
});

// Subscriptions table
export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizationsTable.id),
  planId: uuid("plan_id").notNull().references(() => plansTable.id),
  status: varchar("status", { length: 50 }).default("active"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  trialEndDate: timestamp("trial_end_date"),
  canceledAt: timestamp("canceled_at"),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    organizationIdIdx: index("subscriptions_organization_id_idx").on(table.organizationId),
    planIdIdx: index("subscriptions_plan_id_idx").on(table.planId),
    orgStatusIdx: index("subscriptions_org_status_idx").on(table.organizationId, table.status),
    deletedAtIdx: index("subscriptions_deleted_at_idx").on(table.deletedAt)
  };
});

// Payment methods table
export const paymentMethodsTable = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizationsTable.id),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 100 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  last4: varchar("last4", { length: 4 }),
  brand: varchar("brand", { length: 50 }),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  holderName: varchar("holder_name", { length: 255 }),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    organizationIdIdx: index("payment_methods_organization_id_idx").on(table.organizationId),
    deletedAtIdx: index("payment_methods_deleted_at_idx").on(table.deletedAt)
  };
});

// Invoices table
export const invoicesTable = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizationsTable.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptionsTable.id),
  paymentMethodId: uuid("payment_method_id").references(() => paymentMethodsTable.id),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default("draft"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    organizationIdIdx: index("invoices_organization_id_idx").on(table.organizationId),
    subscriptionIdIdx: index("invoices_subscription_id_idx").on(table.subscriptionId),
    paymentMethodIdIdx: index("invoices_payment_method_id_idx").on(table.paymentMethodId),
    orgStatusIdx: index("invoices_org_status_idx").on(table.organizationId, table.status),
    dueDateIdx: index("invoices_due_date_idx").on(table.dueDate),
    deletedAtIdx: index("invoices_deleted_at_idx").on(table.deletedAt)
  };
});

// Invoice items table
export const invoiceItemsTable = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoicesTable.id),
  description: varchar("description", { length: 500 }).notNull(),
  quantity: integer("quantity").default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    invoiceIdIdx: index("invoice_items_invoice_id_idx").on(table.invoiceId),
    deletedAtIdx: index("invoice_items_deleted_at_idx").on(table.deletedAt)
  };
});

// Billing addresses table
export const billingAddressesTable = pgTable("billing_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizationsTable.id),
  companyName: varchar("company_name", { length: 255 }),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  addressLine1: varchar("address_line1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
}, (table) => {
  return {
    organizationIdIdx: index("billing_addresses_organization_id_idx").on(table.organizationId),
    deletedAtIdx: index("billing_addresses_deleted_at_idx").on(table.deletedAt)
  };
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  organizationMembers: many(organizationMembersTable)
}));

export const organizationsRelations = relations(organizationsTable, ({ many }) => ({
  members: many(organizationMembersTable),
  subscriptions: many(subscriptionsTable),
  paymentMethods: many(paymentMethodsTable),
  invoices: many(invoicesTable),
  billingAddresses: many(billingAddressesTable)
}));

export const organizationMembersRelations = relations(organizationMembersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [organizationMembersTable.userId],
    references: [usersTable.id]
  }),
  organization: one(organizationsTable, {
    fields: [organizationMembersTable.organizationId],
    references: [organizationsTable.id]
  })
}));

export const plansRelations = relations(plansTable, ({ many }) => ({
  subscriptions: many(subscriptionsTable)
}));

export const subscriptionsRelations = relations(subscriptionsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [subscriptionsTable.organizationId],
    references: [organizationsTable.id]
  }),
  plan: one(plansTable, {
    fields: [subscriptionsTable.planId],
    references: [plansTable.id]
  }),
  invoices: many(invoicesTable)
}));

export const paymentMethodsRelations = relations(paymentMethodsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [paymentMethodsTable.organizationId],
    references: [organizationsTable.id]
  }),
  invoices: many(invoicesTable)
}));

export const invoicesRelations = relations(invoicesTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [invoicesTable.organizationId],
    references: [organizationsTable.id]
  }),
  subscription: one(subscriptionsTable, {
    fields: [invoicesTable.subscriptionId],
    references: [subscriptionsTable.id]
  }),
  paymentMethod: one(paymentMethodsTable, {
    fields: [invoicesTable.paymentMethodId],
    references: [paymentMethodsTable.id]
  }),
  items: many(invoiceItemsTable)
}));

export const invoiceItemsRelations = relations(invoiceItemsTable, ({ one }) => ({
  invoice: one(invoicesTable, {
    fields: [invoiceItemsTable.invoiceId],
    references: [invoicesTable.id]
  })
}));

export const billingAddressesRelations = relations(billingAddressesTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [billingAddressesTable.organizationId],
    references: [organizationsTable.id]
  })
}));

// Export all tables for easy access
export const tables = {
  users: usersTable,
  organizations: organizationsTable,
  organizationMembers: organizationMembersTable,
  plans: plansTable,
  subscriptions: subscriptionsTable,
  paymentMethods: paymentMethodsTable,
  invoices: invoicesTable,
  invoiceItems: invoiceItemsTable,
  billingAddresses: billingAddressesTable
};
