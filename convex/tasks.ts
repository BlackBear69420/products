import { v } from "convex/values";
import { query, mutation  } from "./_generated/server";


export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createFile=mutation({
  args:{
    title:v.string(),
    fileId: v.id("_storage"),
    type:v.literal("image"),
    description:v.string(),
    price:v.string(),
    url2:v.string(),

  },
  async handler(ctx,args){
    await ctx.db.insert("tasks", {
      fileId: args.fileId,
      title: args.title,
      type:args.type,
      description:args.description,
      price:args.price,
      url2:args.url2
    });
  }
})

export const getFiles = query({
  args: {},
  async handler(ctx) {
    let files = await ctx.db.query("tasks").collect();
    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );
    console.log(filesWithUrl)
    return filesWithUrl;
  },
});

