import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'A listing must have a title.'],
  },
  category: {
    type: String,
    enum: ['Sports club', 'Beauty & makeup', 'Night party', 'Spa', 'Restaurant', 'Hotel', 'Coffee and Bar', 'Shopping mall'],
    required: [true, 'A listing must have a category.'],
  },
  tags: {
    type: [String],
    // chicken wings, sports bars, seafoods, yoruba dishes
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A listing must have a description.'],
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    state: { type: String, required: [true, 'A listing must specify the state it is located'] },
    city: { type: String, required: [true, 'A listing must specify the city it is located'] },
    address: { type: String, required: [true, 'A listing must specify the address it is located'] },
    zipcode: { type: String },
  },
  services: [
    {
      type: {
        type: String,
      },
      name: {
        type: String,
        required: [true, 'A service must have a name.'],
        trim: true,
      },
      price: Number,
      image: String,
    },
  ],
  facebook: String,
  instagram: String,
  twitter: String,
  linkedIn: String,
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
