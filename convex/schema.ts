import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks:defineTable({
        title:v.string(),
        fileId:v.id("_storage"),
        type:v.literal("image"),
        description:v.string(),
        price:v.string(),
        url2:v.string(),
    })
})