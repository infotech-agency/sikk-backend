// /**
//  * Standardised success/paginated JSON payload builders so every controller
//  * returns the exact same envelope shape across the API.
//  */
// export class ApiResponse {
//   constructor(res, statusCode = 200, message = "Success", data = {}) {
//     return res.status(statusCode).json({
//       success: true,
//       message,
//       data,
//     });
//   }
// }

// export class PaginatedResponse {
//   constructor(res, { total, page, pages, data, message = "Success" }) {
//     return res.status(200).json({
//       success: true,
//       message,
//       total,
//       page,
//       pages,
//       data,
//     });
//   }
// }

// export default ApiResponse;




export const ApiResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const PaginatedResponse = (
  res,
  { total, page, pages, data, message = "Success" }
) => {
  return res.status(200).json({
    success: true,
    message,
    total,
    page,
    pages,
    data,
  });
};