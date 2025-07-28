import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db/mongoose';
import Reservation from '../../../../lib/db/models/Reservation';
import Room from '../../../../lib/db/models/Room';

export async function GET() {
  try {
    await dbConnect();

    // Obtener estadísticas de reservas
    const [
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      totalRevenue,
      averageStay,
      totalRooms,
    ] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'confirmed' }),
      Reservation.countDocuments({ status: 'completed' }),
      Reservation.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Reservation.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        {
          $addFields: {
            nights: {
              $divide: [
                { $subtract: ['$checkOut', '$checkIn'] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
        { $group: { _id: null, average: { $avg: '$nights' } } },
      ]),
      Room.countDocuments({ isActive: true }),
    ]);

    // Calcular ingresos totales
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    const avgStay = averageStay.length > 0 ? Math.round(averageStay[0].average) : 0;

    // Obtener reservas recientes para tendencias
    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .select('createdAt totalPrice status');

    // Calcular tendencia de ingresos (últimos 7 días vs anteriores 7 días)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [currentWeekRevenue, previousWeekRevenue] = await Promise.all([
      Reservation.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: { $in: ['confirmed', 'completed'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Reservation.aggregate([
        {
          $match: {
            createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
            status: { $in: ['confirmed', 'completed'] },
          },
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const currentWeek = currentWeekRevenue.length > 0 ? currentWeekRevenue[0].total : 0;
    const previousWeek = previousWeekRevenue.length > 0 ? previousWeekRevenue[0].total : 0;
    const revenueGrowth = previousWeek > 0 ? ((currentWeek - previousWeek) / previousWeek) * 100 : 0;

    return NextResponse.json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      completedReservations,
      totalRevenue: revenue,
      averageStay: avgStay,
      totalRooms,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      currentWeekRevenue: currentWeek,
      previousWeekRevenue: previousWeek,
      recentReservations: recentReservations.map((r) => ({
        date: r.createdAt,
        revenue: r.totalPrice,
        status: r.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        message: 'Error al obtener estadísticas',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 },
    );
  }
} 