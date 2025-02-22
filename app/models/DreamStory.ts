// models/DreamStory.ts
import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    nb: { type: Number, required: true },
    text: { type: String, required: true },
    image: { type: String },
    soundEffect: {
      type: String,
    },
  },
  { timestamps: true, _id: false }
);

const AdvancedOptionSchema = new mongoose.Schema(
  {
    bookTone: { type: String, default: "neutral" },
    storyLength: { type: String, default: "medium" },
    perspective: { type: String, default: "first-person" },
    genre: { type: String, default: "fantasy" },
  },
  { _id: false }
);

const OptionSchema = new mongoose.Schema(
  {
    artStyle: { type: String, required: true },
    language: { type: String, required: true },
    advancedOption: { type: AdvancedOptionSchema },
  },
  { _id: false }
);
// Changed from coverDataShema to CoverDataSchema for consistency
const CoverDataSchema = new mongoose.Schema(
  {
    coverImagePrompt: { type: String, required: true },
    coverImageUrl: { type: String, default: "" },
    dominantColors: { type: [String], required: true },
    fontStyle: { type: String, required: true },
    mood: { type: String, required: true },
    subtitle: { type: String, required: true },
    theme: { type: String, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

const DreamStorySchema = new mongoose.Schema(
  {
    User: {
      type: String,
      required: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    share: {
      type: Boolean,
      default: false,
    },
    soundEffect: {
      type: Boolean,
      default: false,
    },
    Tags: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          label: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comments: [
      {
        username: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        profileName: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        parentId: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        ancestors: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
          },
        ],
      },
    ],

    stats: {
      likes: [
        {
          username: {
            type: String,
            required: true,
          },
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
      ],
      views: { type: Number, default: 0 },
    },
    options: [OptionSchema],
    pages: [PageSchema],
    coverData: CoverDataSchema, // Changed to use the schema directly, not as a type
  },
  {
    timestamps: true,
  }
);

DreamStorySchema.index({ User: 1, createdAt: -1 });

DreamStorySchema.pre("save", function (next) {
  if (!this.url) {
    // Generate a clean URL from the title or use a UUID
    this.url = this.title
      ? this.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : crypto.randomUUID();
  }
  this.updatedAt = new Date();
  next();
});
export const DreamStory =
  mongoose.models.DreamStory || mongoose.model("DreamStory", DreamStorySchema);
