const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const config = require("config");
const schema = mongoose.Schema(
  {
    name: String,
    contact: String,
    message: String,
    time: String,
    type: String,
    coordinates: [],
    mapdata: Object
  },
  {
    collection: "requests",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);
const model = mongoose.model("Request", schema);

class Controller {
  // async list({ limit = 50, start = 0, search }) {
  //   let filter = {};
  //   if (search)
  //     filter = {
  //       myth: { $regex: new RegExp(RSUtils.Text.escapeRegex(search), "gi") }
  //     };
  //   return DataUtils.paging({
  //     start,
  //     limit,
  //     sort: { updated_at: -1 },
  //     model,
  //     query: [
  //       {
  //         $match: filter
  //       }
  //     ]
  //   });
  // }

  get(id) {
    return model.findById(id);
  }

  getByType(type) {
    return model.find({ type: type });
  }

  add(payload) {
    return model.create(payload);
  }

  async update(id, payload) {
    return model.findByIdAndUpdate(id, payload, { new: true });
  }

  remove(id) {
    return model.findByIdAndRemove(id);
  }
}

module.exports = { controller: new Controller(), model };
