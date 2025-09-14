import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		longDescription: { type: String, required: true },
		images: [{ type: String }],
                category: { type: String, required: true },
                productFamily: {
                        type: String,
                        required: true,
                },
                published: { type: Boolean, default: true },
                price: { type: Number, required: true },
                salePrice: { type: Number, default: 0 },
                discount: { type: Number, default: 0 },

               // Store product code in two fields for backward compatibility
               // `productCode` is the preferred field while `code` ensures
               // older parts of the application that rely on `code` continue
               // to work until fully migrated.
               productCode: { type: String, trim: true },
               code: { type: String, trim: true },
                mrp: { type: Number },
                languageImages: [
                        {
                                language: { type: String },
                                image: { type: String },
                        },
                ],
                languages: [{ type: String }],
                sizes: [{ type: String }],
                materials: [{ type: String }],
                layouts: [{ type: String }],
                materialSpecification: { type: String },
                subcategory: { type: String },


                // Product type for categorization
                type: {
                        type: String,
                        enum: ["featured", "top-selling", "best-selling", "discounted"],
                        default: function () {
                                // Auto-assign discounted if there's a discount
                                if (this.discount > 0 || this.salePrice > 0) {
                                        return "discounted";
                                }
                                return "featured"; // Default fallback
                        },
                },

                // Legacy field - no validation enforced
                productType: {
                        type: String,
                },

                // Reviews for the product
                reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

		// Features array to handle product features
		features: [
			{
				title: {
					type: String,
					required: true,
					trim: true,
				},
				description: {
					type: String,
					required: true,
					trim: true,
				},
			},
		],

		// Add more fields as needed
		// Product SKU, Barcode, Slug, Tags
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware to auto-assign type based on discount if not explicitly set
ProductSchema.pre("save", function (next) {
        if (
                !this.type ||
                this.isModified("discount") ||
                this.isModified("salePrice")
        ) {
                if (this.discount > 0 || this.salePrice > 0) {
                        this.type = "discounted";
                }
        }

        // Keep legacy productType in sync when type changes
        this.productType = this.type;

        next();
});

export default mongoose.models.Product ||
	mongoose.model("Product", ProductSchema);
