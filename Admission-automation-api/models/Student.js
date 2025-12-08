import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    dob: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    aadharNo: {
      type: String,
      required: true,
      unique: true,
    },

    admissionNo: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    qualifications: {
      tenth: {
        rollNo: String,
        marks: String,
        certificate: String,
      },
      twelfth: {
        rollNo: String,
        marks: String,
        certificate: String,
      },
    },

    documents: {
      aadhar: String,
      domicile: String,
      income: String,
      additional: String,
    },

    gap: {
      years: {
        type: Number,
        default: 0,
      },
      reason: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
