import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // null para agrupar todos os documentos
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate), // Garante que é Date
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((dateStr) => {
      const foundData = dailySalesData.find((item) => item._id === dateStr);

      return {
        date: dateStr,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    console.error("Erro detalhado:", error);
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Formata para "YYYY-MM-DD" para bater com o _id do aggregation
    const dateStr = currentDate.toISOString().split("T")[0];
    dates.push(dateStr); // Armazena como string, não como Date
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// export const getDailySalesData = async (startDate, endDate) => {
//   try {
//     const dailySalesData = await Order.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: startDate,
//             $lte: endDate,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//           },
//           sales: { $sum: 1 },
//           revenue: { $sum: "$totalAmount" },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     const dateArray = getDatesInRange(startDate, endDate);

//     return dateArray.map((date) => {
//       const foundData = dailySalesData.find((item) => item._id === date);

//       return {
//         date,
//         sales: foundData?.sales || 0,
//         revenue: foundData?.revenue || 0,
//       };
//     });
//   } catch (error) {
//     throw error;
//   }
// };

// function getDatesInRange(startDate, endDate) {
//   const dates = [];
//   let currentDate = new Date(startDate);

//   while (currentDate <= endDate) {
//     dates.push(new Date(currentDate.toISOString().split("T")[0]));
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   return dates;
// }
