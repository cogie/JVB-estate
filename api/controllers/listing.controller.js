import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

//create a listing from the user
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

//delete listing
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  //if there is no listing
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  //if user id is not valid
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  //if everything is good del listing
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Lising has been deleted!");
  } catch (error) {
    next(error);
  }
};

//update listing
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  // if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your account!'));
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }
  //if success
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

//get the listing of user to be updated
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
