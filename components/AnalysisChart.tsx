import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/hooks/useTranslation';

const AnalysisChart = ({ data }) => {
  const { t_noDynamic } = useTranslation();

  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500">{t_noDynamic('chartNoData')}</p>;
  }

  const tooltipBgColor = 'rgba(240, 248, 255, 0.95)'; // AliceBlue with high opacity
  const tooltipTextColor = '#2c3e50'; // Dark desaturated blue
  const axisStrokeColor = '#758aa1'; // Lighter slate
  const legendTextColor = '#50667b'; // Slightly lighter slate

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-xl my-6 bg-white/70 backdrop-blur-sm border border-slate-200/80">
      <h3 className="text-xl font-semibold mb-4 text-center text-slate-700">{t_noDynamic('chartTitle')}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0, 
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="#cbd5e1" /> {/* slate-300 */}
          <XAxis dataKey="name" stroke={axisStrokeColor} tick={{ fontSize: 12, fill: axisStrokeColor }} />
          <YAxis stroke={axisStrokeColor} domain={[0, 'dataMax + 20']} tick={{ fontSize: 12, fill: axisStrokeColor }} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: tooltipBgColor, 
              border: '1px solid #e0f2fe', // sky-100
              borderRadius: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
            }}
            itemStyle={{ color: tooltipTextColor }}
            labelStyle={{ color: tooltipTextColor, fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(135, 206, 235, 0.1)' }} // Light sky blue with alpha
          />
          <Legend
            formatter={(value, _entry) => <span style={{ color: legendTextColor }}>{value}</span>}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar dataKey="yourValue" name={t_noDynamic('chartYourValues')} fill="#4ade80" radius={[4, 4, 0, 0]} /> {/* green-400, vibrant */}
          <Bar dataKey="normComparableValue" name={t_noDynamic('chartNorm')} fill="#60a5fa" radius={[4, 4, 0, 0]} /> {/* blue-400, bright */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;