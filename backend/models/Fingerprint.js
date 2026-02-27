const mongoose = require("mongoose");

const FingerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sides: {
    left: { type: String, default: "" },
    center: { type: String, default: "" },
    right: { type: String, default: "" },
  },
});

const FingerprintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    main: {
      left: {
        fingers: {
          type: [FingerSchema],
          default: [],
        },
      },

      right: {
        fingers: {
          type: [FingerSchema],
          default: [],
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fingerprint", FingerprintSchema);