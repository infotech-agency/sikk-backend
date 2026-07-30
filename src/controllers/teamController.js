import Team from "../models/Team.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinaryHelpers.js";

// CREATE TEAM
export const createTeam = async (req, res, next) => {
  try {

    const {
      name,
      designation,
      department,
      displayOrder,
      linkedInUrl,
      description,
      featuredMember
    } = req.body;


    let imageUrl = "";


    if(req.file){
      const uploaded = await uploadToCloudinary(
        req.file,
        "teams"
      );

      imageUrl = uploaded.url;
    }


    const team = await Team.create({
      name,
      designation,
      department,
      displayOrder,
      linkedInUrl,
      description,
      featuredMember,
      imageUrl
    });


    return ApiResponse(
      res,
      201,
      "Team created successfully",
      team
    );


  } catch(err){
    next(err);
  }
};


// GET ALL TEAM
export const getTeams = async (req, res, next) => {
  try {

    const teams = await Team.find()
      .sort({ createdAt: -1 });

    return ApiResponse(
      res,
      200,
      "Teams fetched successfully",
      teams
    );

  } catch (err) {
    next(err);
  }
};


// GET SINGLE TEAM
export const getTeamById = async (req, res, next) => {
  try {

    const team = await Team.findById(req.params.id);

    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    return ApiResponse(
      res,
      200,
      "Team fetched successfully",
      team
    );

  } catch (err) {
    next(err);
  }
};


// UPDATE TEAM
// export const updateTeam = async (req, res, next) => {
//   try {

//     const { name, imageUrl, description } = req.body;

//     const team = await Team.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         imageUrl,
//         description
//       },
//       {
//         new:true,
//         runValidators:true
//       }
//     );


//     if (!team) {
//       throw new ApiError(404, "Team not found");
//     }


//     return ApiResponse(
//       res,
//       200,
//       "Team updated successfully",
//       team
//     );


//   } catch(err){
//     next(err);
//   }
// };

// export const updateTeam = async (req, res, next) => {
//   try {

//     const team = await Team.findById(req.params.id);

//     if (!team) {
//       return res.status(404).json({
//         success:false,
//         message:"Team not found"
//       });
//     }


//     let imageUrl = team.imageUrl;


//     // agar new image aayi hai
//     if (req.file) {

//       const uploaded = await uploadToCloudinary(
//         req.file,
//         "teams"
//       );

//       imageUrl = uploaded.url;
//     }


//     team.name = req.body.name || team.name;
//     team.description = req.body.description || team.description;
//     team.imageUrl = imageUrl;


//     await team.save();


//     return ApiResponse(
//       res,
//       200,
//       "Team updated successfully",
//       team
//     );


//   } catch(err) {
//     next(err);
//   }
// };

export const updateTeam = async(req,res,next)=>{
 try{

   const team = await Team.findById(req.params.id);

   if(!team){
     return res.status(404).json({
       message:"Team not found"
     });
   }


   if(req.file){

     const uploaded = await uploadToCloudinary(
        req.file,
        "teams"
     );

     team.imageUrl = uploaded.url;
   }


   team.name = req.body.name ?? team.name;
   team.designation = req.body.designation ?? team.designation;
   team.department = req.body.department ?? team.department;
   team.displayOrder = req.body.displayOrder ?? team.displayOrder;
   team.linkedInUrl = req.body.linkedInUrl ?? team.linkedInUrl;
   team.description = req.body.description ?? team.description;
   team.featuredMember = req.body.featuredMember ?? team.featuredMember;


   await team.save();


   return ApiResponse(
     res,
     200,
     "Team updated successfully",
     team
   );


 }catch(err){
   next(err);
 }

}

// DELETE TEAM
export const deleteTeam = async (req, res, next) => {
  try {

    const team = await Team.findById(req.params.id);
    

    if(!team){
      throw new ApiError(404,"Team not found");
    }


    await team.deleteOne();


    return ApiResponse(
      res,
      200,
      "Team deleted successfully",
      {
        id:req.params.id
      }
    );


  } catch(err){
    next(err);
  }
};


export default {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};