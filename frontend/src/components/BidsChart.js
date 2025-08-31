import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Box, Text } from '@chakra-ui/react';

const BidsChart = ({ bids }) => {
  const chartData = bids.map(bid => ({
    hour: `${bid.hour.toString().padStart(2, '0')}:00`,
    price: bid.price,
    type: bid.bid_type,
  }));

  return (
    <Box h="300px" bg="gray.700" p={4} borderRadius="md" boxShadow="lg">
      <Text fontSize="lg" mb={4} fontWeight="bold">Your Bid Prices</Text>
      {bids.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="hour" stroke="gray.400" />
            <YAxis stroke="gray.400" tickFormatter={(val) => `$${val}`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #4A5568', color: 'white' }}
              cursor={{ fill: 'rgba(129, 230, 217, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="price" name="Bid Price">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'buy' ? '#48bb78' : '#f56565'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Text color="gray.400" textAlign="center" pt={16}>No bids to visualize.</Text>
      )}
    </Box>
  );
};

export default BidsChart;
