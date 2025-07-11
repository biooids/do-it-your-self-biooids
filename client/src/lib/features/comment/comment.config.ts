// src/lib/features/comment/comment.config.ts

/**
 * =================================================================
 * CONFIGURATION: COMMENT FEATURE
 * =================================================================
 * This file contains shared constants and configuration values for
 * the entire comment feature. By centralizing them here, we ensure
 * that both the frontend components and the API slices use the
 * same values, making the application easier to maintain.
 */

/**
 * The number of replies to fetch per page when a user clicks "Load More Replies".
 */
export const REPLIES_PER_PAGE = 5;

/**
 * The maximum nesting depth for a comment. A comment at this level
 * will not have a "Reply" button. The backend also enforces this limit.
 */
export const MAX_REPLY_LEVEL = 5;
