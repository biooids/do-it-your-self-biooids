import prisma from "@/db/prisma.js";
import {
  Post,
  SystemRole,
  Prisma,
  SharePlatform,
} from "../../../prisma/generated/prisma";
import { createHttpError } from "@/utils/error.factory.js";
import { logger } from "@/config/logger.js";
import { deleteFromCloudinary } from "@/config/cloudinary.js";
import { PostQueryFilters } from "./post.types";

// --- FIX: The interface now correctly expects an array of image objects ---
interface CreatePostData {
  title: string;
  description: string;
  content: string;
  category: Post["category"];
  tags: { name: string }[];
  images?: { url: string; publicId: string }[]; // Changed from imageUrls: string[]
  externalLink?: string;
  githubLink?: string;
}

type UpdatePostData = Partial<Omit<CreatePostData, "images">> & {
  retainedImageUrls?: string[];
  newImages?: { url: string; publicId: string }[];
  postTags?: string; // <-- ADD THIS LINE
};

export class PostService {
  public async createPost(
    authorId: string,
    data: CreatePostData
  ): Promise<Post> {
    // --- FIX: Destructure 'images' to match the updated interface ---
    const { images, tags, ...postData } = data;

    return prisma.$transaction(async (tx) => {
      const createInput: Prisma.PostCreateInput = {
        title: postData.title,
        description: postData.description,
        content: postData.content,
        category: postData.category,
        author: { connect: { id: authorId } },
        tags: {
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag.name },
                create: { name: tag.name },
              },
            },
          })),
        },
        ...(postData.externalLink && { externalLink: postData.externalLink }),
        ...(postData.githubLink && { githubLink: postData.githubLink }),
      };

      const newPost = await tx.post.create({ data: createInput });

      // --- FIX: The 'images' variable is now an array of objects, making '...img' valid ---
      if (images && images.length > 0) {
        await tx.postImage.createMany({
          data: images.map((img, index) => ({
            ...img, // This is now correct as img is { url, publicId }
            postId: newPost.id,
            order: index + 1,
          })),
        });
      }

      logger.info(
        { postId: newPost.id, authorId },
        "New post created successfully."
      );
      return tx.post.findUniqueOrThrow({
        where: { id: newPost.id },
        include: {
          images: { orderBy: { order: "asc" } },
          tags: { include: { tag: true } },
        },
      });
    });
  }

  public async getPostById(postId: string, userId?: string) {
    // Add optional userId
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, name: true, username: true, profileImage: true },
        },
        images: { orderBy: { order: "asc" } },
        tags: { include: { tag: true } },

        steps: {
          orderBy: { order: "asc" },
          include: {
            sections: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // If a userId is provided, check their like/save status for this post
    if (userId) {
      const like = await prisma.postLike.findUnique({
        where: { userId_postId: { userId, postId } },
      });
      const save = await prisma.postSave.findUnique({
        where: { userId_postId: { userId, postId } },
      });

      // Return the post with the added user-specific booleans
      return {
        ...post,
        isLikedByCurrentUser: !!like,
        isSavedByCurrentUser: !!save,
      };
    }

    // If no userId, return the post with default false values
    return {
      ...post,
      isLikedByCurrentUser: false,
      isSavedByCurrentUser: false,
    };
  }

  public async getAllPosts(
    filters: PostQueryFilters,
    userId?: string // The optional userId for auth-aware results
  ): Promise<{ posts: any[]; total: number }> {
    // --- Setup and Parsing ---
    const limit = filters.limit ? parseInt(String(filters.limit), 10) : 10;
    const page = filters.page ? parseInt(String(filters.page), 10) : 1;

    // --- ADDED: Destructure the new filters from the filters object ---
    const {
      q,
      category,
      sort = "newest",
      tags,
      authorId,
      likedByUserId,
      savedByUserId,
    } = filters;
    const skip = (page - 1) * limit;

    // --- Building the dynamic WHERE and ORDER BY clauses ---
    const where: Prisma.PostWhereInput = {};

    // --- ADDED: The logic to handle the new filters ---
    if (authorId) {
      where.authorId = authorId;
    }
    if (likedByUserId) {
      where.likedBy = { some: { userId: likedByUserId } };
    }
    if (savedByUserId) {
      where.savedBy = { some: { userId: savedByUserId } };
    }
    // --- END OF ADDED LOGIC ---

    if (category) {
      where.category = category;
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { author: { name: { contains: q, mode: "insensitive" } } },
        { author: { username: { contains: q, mode: "insensitive" } } },
      ];
    }
    if (tags) {
      const tagList = tags.split(",");
      if (tagList.length > 0) {
        where.tags = {
          some: {
            tag: {
              name: {
                in: tagList,
                mode: "insensitive",
              },
            },
          },
        };
      }
    }

    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (sort) {
      case "oldest":
        orderBy.createdAt = "asc";
        break;
      case "title-asc":
        orderBy.title = "asc";
        break;
      case "title-desc":
        orderBy.title = "desc";
        break;
      case "newest":
      default:
        orderBy.createdAt = "desc";
        break;
    }

    // --- The rest of the function is completely unchanged. ---
    // It correctly fetches the data based on the `where` clause we just built
    // and then enriches it with the current user's like/save status.

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where, // The `where` object now contains our new filter logic
        skip,
        take: limit,
        orderBy,
        include: {
          // This `include` block does NOT need to be changed
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              profileImage: true,
            },
          },
          images: { orderBy: { order: "asc" } },
          tags: { include: { tag: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // This "Enriching" part works perfectly with the new filters
    if (!userId || posts.length === 0) {
      return {
        posts: posts.map((p) => ({
          ...p,
          isLikedByCurrentUser: false,
          isSavedByCurrentUser: false,
        })),
        total,
      };
    }

    const postIds = posts.map((p) => p.id);
    const userLikes = await prisma.postLike.findMany({
      where: { userId: userId, postId: { in: postIds } },
      select: { postId: true },
    });
    const userSaves = await prisma.postSave.findMany({
      where: { userId: userId, postId: { in: postIds } },
      select: { postId: true },
    });
    const likedPostIds = new Set(userLikes.map((like) => like.postId));
    const savedPostIds = new Set(userSaves.map((save) => save.postId));
    const enrichedPosts = posts.map((post) => ({
      ...post,
      isLikedByCurrentUser: likedPostIds.has(post.id),
      isSavedByCurrentUser: savedPostIds.has(post.id),
    }));

    return { posts: enrichedPosts, total };
  }
  public async updatePost(
    userId: string,
    postId: string,
    data: UpdatePostData
  ): Promise<Post> {
    // FIX: Destructure `postTags` out of the data object so it's not passed to Prisma.
    // The rest of the `textData` will be valid for the database update.
    const {
      retainedImageUrls = [],
      newImages = [],
      tags,
      postTags, // This is pulled out and then ignored.
      ...textData
    } = data;

    const postToUpdate = await prisma.post.findUnique({
      where: { id: postId },
      include: { images: true },
    });

    if (!postToUpdate) throw createHttpError(404, "Post not found.");
    if (postToUpdate.authorId !== userId)
      throw createHttpError(403, "You are not authorized to edit this post.");

    const imagesToDelete = postToUpdate.images.filter(
      (img) => !retainedImageUrls.includes(img.url)
    );

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map((img) =>
        deleteFromCloudinary(img.publicId).catch((err) =>
          logger.error(
            { err, publicId: img.publicId },
            "Cloudinary asset deletion failed"
          )
        )
      );
      Promise.allSettled(deletePromises);
    }

    return prisma.$transaction(async (tx) => {
      if (imagesToDelete.length > 0) {
        await tx.postImage.deleteMany({
          where: { id: { in: imagesToDelete.map((img) => img.id) } },
        });
      }
      if (newImages && newImages.length > 0) {
        await tx.postImage.createMany({
          data: newImages.map((img, index) => ({
            ...img,
            postId,
            order: retainedImageUrls.length + index + 1,
          })),
        });
      }

      // `textData` is now clean and doesn't contain the invalid `postTags` field.
      const updateInput: Prisma.PostUpdateInput = { ...textData };

      // The `tags` logic remains the same, as it correctly uses the structured `tags` array.
      if (tags) {
        updateInput.tags = {
          deleteMany: {},
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag.name },
                create: { name: tag.name },
              },
            },
          })),
        };
      }

      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: updateInput,
        include: {
          images: { orderBy: { order: "asc" } },
          tags: { include: { tag: true } },
        },
      });

      logger.info({ postId, userId }, "Post updated successfully.");
      return updatedPost;
    });
  }

  public async deletePost(
    userId: string,
    userRole: SystemRole,
    postId: string
  ): Promise<void> {
    const postToDelete = await prisma.post.findUnique({
      where: { id: postId },
      include: { images: true },
    });

    if (!postToDelete) return;
    if (postToDelete.authorId !== userId && userRole !== "SUPER_ADMIN") {
      throw createHttpError(403, "You are not authorized to delete this post.");
    }

    if (postToDelete.images.length > 0) {
      const deletePromises = postToDelete.images.map((img) =>
        deleteFromCloudinary(img.publicId).catch((err) =>
          logger.error(
            { err, publicId: img.publicId },
            "Cloudinary asset deletion failed"
          )
        )
      );
      Promise.allSettled(deletePromises);
    }

    await prisma.post.delete({ where: { id: postId } });
    logger.info({ postId, userId }, "Post and associated assets deleted.");
  }

  public async likePost(userId: string, postId: string): Promise<Post> {
    const existingLike = await prisma.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingLike) {
      // If the user already liked it, do nothing and return the current post state
      return prisma.post.findUniqueOrThrow({ where: { id: postId } });
    }

    // Use a transaction to create the like and increment the counter
    const [, updatedPost] = await prisma.$transaction([
      prisma.postLike.create({ data: { userId, postId } }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return updatedPost;
  }

  public async unlikePost(userId: string, postId: string): Promise<Post> {
    const existingLike = await prisma.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!existingLike) {
      // If there's no like to remove, do nothing and return current post state
      return prisma.post.findUniqueOrThrow({ where: { id: postId } });
    }

    // Use a transaction to delete the like and decrement the counter
    const [, updatedPost] = await prisma.$transaction([
      prisma.postLike.delete({ where: { id: existingLike.id } }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);

    return updatedPost;
  }

  public async savePost(userId: string, postId: string): Promise<Post> {
    const existingSave = await prisma.postSave.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingSave) {
      return prisma.post.findUniqueOrThrow({ where: { id: postId } });
    }

    const [, updatedPost] = await prisma.$transaction([
      prisma.postSave.create({ data: { userId, postId } }),
      prisma.post.update({
        where: { id: postId },
        data: { savedCount: { increment: 1 } },
      }),
    ]);
    return updatedPost;
  }

  public async unsavePost(userId: string, postId: string): Promise<Post> {
    const existingSave = await prisma.postSave.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!existingSave) {
      return prisma.post.findUniqueOrThrow({ where: { id: postId } });
    }

    const [, updatedPost] = await prisma.$transaction([
      prisma.postSave.delete({ where: { id: existingSave.id } }),
      prisma.post.update({
        where: { id: postId },
        data: { savedCount: { decrement: 1 } },
      }),
    ]);
    return updatedPost;
  }

  public async sharePost(
    sharerId: string,
    postId: string,
    platform: SharePlatform
  ): Promise<Post> {
    // We don't need to check for existing shares, just create a new one
    const [, updatedPost] = await prisma.$transaction([
      prisma.postShare.create({ data: { sharerId, postId, platform } }),
      prisma.post.update({
        where: { id: postId },
        data: { sharesCount: { increment: 1 } },
      }),
    ]);
    return updatedPost;
  }

  public async recordPostView(userId: string, postId: string): Promise<void> {
    const existingView = await prisma.postView.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingView) {
      // If the view already exists, just update the user's personal view count.
      await prisma.postView.update({
        where: { id: existingView.id },
        data: { viewCountByUser: { increment: 1 } },
      });
    } else {
      // If the view does not exist, try to create it.
      try {
        await prisma.$transaction([
          prisma.postView.create({ data: { userId, postId } }),
          prisma.post.update({
            where: { id: postId },
            data: { viewsCount: { increment: 1 } },
          }),
        ]);
      } catch (error: any) {
        // This is the fix. We catch potential errors.
        if (error.code === "P2002") {
          // If the error is P2002, it's the unique constraint violation.
          // This means a race condition happened and another request already created the view.
          // This is not a real error for us, so we can safely ignore it and move on.
          console.log(
            "Race condition on PostView creation handled gracefully. Ignoring duplicate create."
          );
        } else {
          // If it's any other error, we should re-throw it so it can be handled globally.
          throw error;
        }
      }
    }
  }
}

export const postService = new PostService();
