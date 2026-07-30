import Counter from "../models/Counter.js";

// Get All Counters
export const getCounters = async (req, res) => {
  try {
    const counters = await Counter.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: counters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Counter
export const getCounter = async (req, res) => {
  try {
    const counter = await Counter.findById(req.params.id);

    if (!counter) {
      return res.status(404).json({
        success: false,
        message: "Counter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: counter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Counter
export const createCounter = async (req, res) => {
  try {
    const counter = await Counter.create(req.body);
      console.log("RAW BODY:", req.body);
    res.status(201).json({
      success: true,
      message: "Counter created successfully",
      data: counter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Counter
export const updateCounter = async (req, res) => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!counter) {
      return res.status(404).json({
        success: false,
        message: "Counter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Counter updated successfully",
      data: counter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Counter
export const deleteCounter = async (req, res) => {
  try {
    const counter = await Counter.findByIdAndDelete(req.params.id);

    if (!counter) {
      return res.status(404).json({
        success: false,
        message: "Counter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Counter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};