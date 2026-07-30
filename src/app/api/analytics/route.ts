import { NextResponse } from 'next/server';

export async function GET() {
  const analyticsData = {
    totalRevenueYTD: 154200,
    bestMonth: 'December ($19,800)',
    averageOrderValue: 480,
    clientRetentionRate: '94.2%',
    revenueChart: [
      { month: 'Jan', revenue: 4200 },
      { month: 'Feb', revenue: 5800 },
      { month: 'Mar', revenue: 7100 },
      { month: 'Apr', revenue: 6400 },
      { month: 'May', revenue: 8900 },
      { month: 'Jun', revenue: 10500 },
      { month: 'Jul', revenue: 12100 },
      { month: 'Aug', revenue: 11400 },
      { month: 'Sep', revenue: 13800 },
      { month: 'Oct', revenue: 15200 },
      { month: 'Nov', revenue: 17500 },
      { month: 'Dec', revenue: 19800 },
    ],
    serviceDistribution: [
      { name: 'Photo Retouching', value: 45 },
      { name: 'Video Editing', value: 30 },
      { name: 'Real Estate', value: 15 },
      { name: 'Wedding Package', value: 10 },
    ],
  };

  return NextResponse.json({ analytics: analyticsData });
}
