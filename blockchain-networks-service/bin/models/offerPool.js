const mongoose = require("mongoose");

const { Schema } = mongoose;

const OfferPool = new Schema(
  {
    marketplaceCatalogIndex: { type: String, required: true },
    contract: { type: Schema.ObjectId, required: true },
    product: { type: String },
    rangeNumber: { type: String },
    minterAddress: { type: String },
    creationDate: { type: Date, default: Date.now },
    transactionHash: { type: String, required: false },
  },
  { versionKey: false }
);

module.exports = OfferPool;
