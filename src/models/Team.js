// import mongoose from "mongoose";

// const teamSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     imageUrl: {
//         type: String
//     },
//     description: {
//         type: String,
//         required: true
//     }
// }, {
//     timestamps: true
// });

// const Team = mongoose.model("Team", teamSchema);

// export default Team;



import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
{
    name: {
        type: String,
        required: true,
    },

    designation: {
        type: String,
        required: true,
    },

    department: {
        type: String,
    },

    displayOrder: {
        type: Number,
        default: 0,
    },

    imageUrl: {
        type: String,
    },

    linkedInUrl: {
        type: String,
    },

    description: {
        type: String,
        required: true,
    },

    featuredMember: {
        type: Boolean,
        default: false,
    }

},
{
    timestamps:true
});


const Team = mongoose.model("Team", teamSchema);

export default Team;