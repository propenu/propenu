import mongoose, { Schema, Types, Model, models } from "mongoose";

/** ---------------- Enums ---------------- */
export const ListingType = ["Rent", "Sell", "Buy"] as const;
export const PropertyCategory = ["Residential", "Commercial", "Land/Plot", "Agricultural"] as const;

type ListingTypeT = (typeof ListingType)[number];
type PropertyCategoryT = (typeof PropertyCategory)[number];

/** ---------------- Subdocs ---------------- */
const addressSchema = new Schema(
  {
    addressLine: String,
    nearbyLandmarks: [String],
    city: { type: String, index: true },
    pincode: String,
  },
  { _id: false }
);

const amenitiesSchema = new Schema(
  {
    waterSupply: Boolean,
    powerBackup: Boolean,
    parking: Boolean,
    security: Boolean,
    gym: Boolean,
    swimmingPool: Boolean,
    clubhouse: Boolean,
    sportsCourts: Boolean,
    lift: Boolean,
    garden: Boolean,
    childrensPlayArea: Boolean,
    joggingTrack: Boolean,
  },
  { _id: false }
);

/** ---------------- Base Document Types ---------------- */
export interface PropertyBase {
  title: string;
  description?: string;
  userId?: Types.ObjectId;
  listingType: ListingTypeT; // Rent/Sell/Buy
  category: PropertyCategoryT;
  price?: number;
  facing?: string;
  area?: number;
  isVerified?: boolean;
  verificationStatus?: "pending" | "approved" | "rejected";
  verifiedBy?: Types.ObjectId | null;
  verifiedAt?: Date | null;
  address?: {
    addressLine?: string;
    nearbyLandmarks?: string[];
    city?: string;
    pincode?: string;
  };
  amenities?: Record<string, any>;
  images?: string[];
  videos?: string[];
  listedDate?: Date;
}

/** ---------------- Discriminator Detail Types ---------------- */
export interface ResidentialDetails {
  details?: {
    bhk?: number;
    bathrooms?: number;
    balconies?: number;
    furnishing?: "Unfurnished" | "Semi" | "Fully";
    floorNumber?: number;
    totalFloors?: number;
  };
}

export interface CommercialDetails {
  details?: {
    propertyType?: string; // Office, Shop, Warehouse, etc.
    floor?: number;
    totalFloors?: number;
    furnishedStatus?: string;
    powerBackup?: boolean;
    lift?: boolean;
    washrooms?: number;
    ceilingHeightFt?: number;
    builtYear?: number;
    maintenanceCharges?: number;
  };
}

export interface LandPlotDetails {
  details?: {
    roadWidthFt?: number;
    negotiable?: boolean;
    readyToConstruct?: boolean;
    waterConnection?: boolean;
    electricityConnection?: boolean;
    approvedByAuthority?: string;
  };
}

export interface AgriculturalDetails {
  details?: {
    boundaryWall?: boolean;
    areaUnit?: string;
    landShape?: string;
    soilType?: string;
    irrigationType?: string;
    currentCrop?: string;
    suitableFor?: string[];
    plantationAge?: number;
    numberOfBorewells?: number;
    electricityConnection?: boolean;
  };
}

/** ---------------- Base Schema w/ discriminatorKey ---------------- */
const baseOptions = { discriminatorKey: "category", timestamps: true };

const PropertySchema = new Schema<PropertyBase>(
  {
    title: { type: String, required: true },
    description: String,
    userId: { type: Types.ObjectId, ref: "User", index: true },

    listingType: { type: String, enum: ListingType, index: true },
    category: { type: String, enum: PropertyCategory, index: true },

    price: { type: Number, index: true },
    facing: String,
    area: Number,

    isVerified: { type: Boolean, default: false, index: true },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedBy: { type: Types.ObjectId, ref: "User" },
    verifiedAt: Date,

    address: addressSchema,
    amenities: amenitiesSchema,

    images: [{ type: String }],
    videos: [{ type: String }],

    listedDate: { type: Date, default: () => new Date(), index: true },
  },
  baseOptions
);

/** Correct way to add a text index for search */
PropertySchema.index({ title: "text", description: "text" });

/** Stable model (avoids OverwriteModelError in dev/hot-reload) */
export const Property =
  (models.Property as Model<PropertyBase>) ||
  mongoose.model<PropertyBase>("Property", PropertySchema);

/** ---------------- Discriminators ---------------- */
function getOrCreateDiscriminator<T>(
  name: PropertyCategoryT,
  def: Record<string, any>
) {
  // If already created (e.g., hot reload), return it
  if (Property.discriminators && Property.discriminators[name]) {
    return Property.discriminators[name] as Model<PropertyBase & T>;
  }
  return Property.discriminator<PropertyBase & T>(name, new Schema(def));
}

// Residential
export const Residential = getOrCreateDiscriminator<ResidentialDetails>("Residential", {
  details: {
    bhk: Number,
    bathrooms: Number,
    balconies: Number,
    furnishing: { type: String, enum: ["Unfurnished", "Semi", "Fully"] },
    floorNumber: Number,
    totalFloors: Number,
  },
});

// Commercial
export const Commercial = getOrCreateDiscriminator<CommercialDetails>("Commercial", {
  details: {
    propertyType: String,
    floor: Number,
    totalFloors: Number,
    furnishedStatus: String,
    powerBackup: Boolean,
    lift: Boolean,
    washrooms: Number,
    ceilingHeightFt: Number,
    builtYear: Number,
    maintenanceCharges: Number,
  },
});

// Land/Plot
export const LandPlot = getOrCreateDiscriminator<LandPlotDetails>("Land/Plot", {
  details: {
    roadWidthFt: Number,
    negotiable: Boolean,
    readyToConstruct: Boolean,
    waterConnection: Boolean,
    electricityConnection: Boolean,
    approvedByAuthority: String,
  },
});

// Agricultural
export const Agricultural = getOrCreateDiscriminator<AgriculturalDetails>("Agricultural", {
  details: {
    boundaryWall: Boolean,
    areaUnit: String,
    landShape: String,
    soilType: String,
    irrigationType: String,
    currentCrop: String,
    suitableFor: [String],
    plantationAge: Number,
    numberOfBorewells: Number,
    electricityConnection: Boolean,
  },
});

/** ---------------- Optional helper to ensure key indexes at boot ---------------- */
export async function ensurePropertyIndexes() {
  await Property.collection.createIndex({ "address.city": 1, category: 1, listingType: 1 });
  await Property.collection.createIndex({ price: 1 });
  await Property.collection.createIndex({ listedDate: -1 });
  await Property.collection.createIndex({ isVerified: 1 });
}
