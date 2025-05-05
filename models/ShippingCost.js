const mongoose = require("mongoose");

const ShippingCostSchema = new mongoose.Schema({
    shippingRates: [
      {
        id:{
            type: Number,
            unique: true
        },
        state: {
          type: String,
          required: true,
          unique: true
        },
        stopDeskCost: {
          type: Number,
          required: true
        },
        homeCost: {
            type: Number,
            required: true
        }
      }
    ]
});
  
  // Ensure there's only one document
ShippingCostSchema.statics.getSingleDoc = async function () {
    let doc = await this.findOne();
    if (!doc) {
      doc = await this.create({ shippingRates: [] });
    }
    return doc;
};

ShippingCostSchema.statics.getShippingRate = async function (state) {
  
    const Doc = await this.getSingleDoc();
      
    const rate = Doc.shippingRates.find(rate => rate.state === state);
    console.log(rate);
     
    if(!rate) return null;

    return {
      homeCost: rate.homeCost,
      stopDeskCost: rate.stopDeskCost
    };

};
  
module.exports = mongoose.model('ShippingCost', ShippingCostSchema);
  