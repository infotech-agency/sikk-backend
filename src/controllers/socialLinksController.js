import SocialLinks from "../models/SocialLinks.js";

// Get Social Links
export const getSocialLinks = async (req, res) => {
  try {
    let socialLinks = await SocialLinks.findOne();

    if (!socialLinks) {
      socialLinks = await SocialLinks.create({});
    }

    res.status(200).json({
      success: true,
      data: socialLinks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Social Links
export const updateSocialLinks = async (req, res) => {
  try {
    let socialLinks = await SocialLinks.findOne();

    if (!socialLinks) {
      socialLinks = await SocialLinks.create(req.body);
    } else {
      socialLinks = await SocialLinks.findByIdAndUpdate(
        socialLinks._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Social links updated successfully",
      data: socialLinks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};