// models/DreamStory.ts
import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    nb: { type: Number, required: true },
    text: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const AdvancedOptionSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  styleStrength: { type: String, required: true },
  resolution: { type: String, required: true },
});

const OptionSchema = new mongoose.Schema({
  artStyle: { type: String, required: true },
  language: { type: String, required: true },
  advancedOption: { type: AdvancedOptionSchema },
});

const DreamStorySchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      default: function () {
        return `/dreams/${this._id}`;
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
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
    options: [OptionSchema],
    pages: [PageSchema],
  },
  {
    timestamps: true,
  }
);

DreamStorySchema.index({ User: 1, createdAt: -1 });

// Pre-save middleware to ensure URL is set
DreamStorySchema.pre("save", function (next) {
  if (!this.url && this._id) {
    this.url = `/dreams/${this._id}`;
  }
  this.updatedAt = new Date();
  next();
});

export const DreamStory =
  mongoose.models.DreamStory || mongoose.model("DreamStory", DreamStorySchema);
