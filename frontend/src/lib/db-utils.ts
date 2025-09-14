import { db, usersTable, organizationsTable, organizationMembersTable } from '../db';
import { eq, and } from 'drizzle-orm';

/**
 * Database utility functions for local operations
 * Note: These are supplementary to the Go backend API calls
 * The Go backend remains the primary source of truth for all data operations
 */

// Type definitions
type User = typeof usersTable.$inferSelect;
type Organization = typeof organizationsTable.$inferSelect;
type OrganizationMember = typeof organizationMembersTable.$inferSelect;

/**
 * Local database utilities (optional, for caching/offline support)
 * These should be used alongside Go backend API calls, not as replacements
 */
export class DatabaseUtils {
  /**
   * Get user by email (local cache lookup)
   * Note: Always verify with Go backend API for authoritative data
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      
      return users[0] || null;
    } catch (error) {
      console.warn('Local DB query failed:', error);
      return null;
    }
  }

  /**
   * Get user's organizations (local cache lookup)
   * Note: Always verify with Go backend API for authoritative data
   */
  static async getUserOrganizations(userId: string): Promise<Organization[]> {
    try {
      const organizations = await db
        .select({
          id: organizationsTable.id,
          name: organizationsTable.name,
          slug: organizationsTable.slug,
          description: organizationsTable.description,
          website: organizationsTable.website,
          phone: organizationsTable.phone,
          email: organizationsTable.email,
          isActive: organizationsTable.isActive,
          createdAt: organizationsTable.createdAt,
          updatedAt: organizationsTable.updatedAt,
          deletedAt: organizationsTable.deletedAt,
        })
        .from(organizationsTable)
        .innerJoin(
          organizationMembersTable,
          eq(organizationsTable.id, organizationMembersTable.organizationId)
        )
        .where(
          and(
            eq(organizationMembersTable.userId, userId),
            eq(organizationMembersTable.isActive, true)
          )
        );
      
      return organizations;
    } catch (error) {
      console.warn('Local DB query failed:', error);
      return [];
    }
  }

  /**
   * Check if user is member of organization (local cache lookup)
   * Note: Always verify with Go backend API for authoritative data
   */
  static async isUserMemberOfOrganization(
    userId: string,
    organizationId: string
  ): Promise<boolean> {
    try {
      const membership = await db
        .select()
        .from(organizationMembersTable)
        .where(
          and(
            eq(organizationMembersTable.userId, userId),
            eq(organizationMembersTable.organizationId, organizationId),
            eq(organizationMembersTable.isActive, true)
          )
        )
        .limit(1);
      
      return membership.length > 0;
    } catch (error) {
      console.warn('Local DB query failed:', error);
      return false;
    }
  }
}

/**
 * Schema type exports for use throughout the application
 * These provide type safety when working with data from the Go backend
 */
export type {
  User,
  Organization,
  OrganizationMember,
};

/**
 * Table references for advanced queries
 * Use these when you need to perform complex local database operations
 */
export {
  usersTable,
  organizationsTable,
  organizationMembersTable,
  db,
};