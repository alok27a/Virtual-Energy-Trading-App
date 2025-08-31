import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

const MarketChart = ({ data }) => {
  const formatXAxis = (tickItem) => format(new Date(tickItem), 'HH:mm');
  const formatTooltip = (value) => `$${value.toFixed(2)}`;

  return (
    <Box h="400px">
      <Text fontSize="lg" mb={4} fontWeight="bold">Market Prices ($/MWh)</Text>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="x" 
            tickFormatter={formatXAxis} 
            type="number"
            domain={['dataMin', 'dataMax']}
            stroke="gray.400"
          />
          <YAxis stroke="gray.400" tickFormatter={(val) => `$${val}`} />
          <Tooltip 
            labelFormatter={formatXAxis}
            formatter={formatTooltip}
            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #4A5568', color: 'white' }}
            cursor={{ stroke: 'teal', strokeWidth: 1 }}
          />
          <Legend />
          <Line dataKey="y" data={data.daData} name="Day-Ahead" stroke="#f687b3" strokeWidth={3} dot={false} type="stepAfter" />
          <Line dataKey="y" data={data.rtData} name="Real-Time" stroke="#48bb78" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MarketChart;
