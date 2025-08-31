import React from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, Box, Text, Stat, StatNumber, StatHelpText, StatGroup, SimpleGrid,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const PnlText = ({ value }) => {
    const color = value > 0 ? 'green.400' : value < 0 ? 'red.400' : 'gray.400';
    const sign = value > 0 ? '+' : '';
    return <Text color={color} fontWeight="bold">{sign}${Math.abs(value).toFixed(2)}</Text>
}

const PositionsResults = ({ positions }) => {
    const totalPnl = positions.reduce((acc, pos) => acc + pos.realized_pnl, 0);

    const chartData = positions.map(pos => ({
        hour: `${pos.hour.toString().padStart(2, '0')}:00`,
        pnl: pos.realized_pnl,
    }));

  return (
    <Box bg="gray.700" p={6} borderRadius="md" boxShadow="lg">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
                <StatGroup mb={6}>
                    <Stat>
                        <StatNumber fontSize="3xl"><PnlText value={totalPnl} /></StatNumber>
                        <StatHelpText>Total Realized P&L</StatHelpText>
                    </Stat>
                </StatGroup>
                <TableContainer>
                    <Table variant="simple" size="sm">
                        <Thead><Tr>
                            <Th>Hour</Th><Th>Type</Th><Th isNumeric>Quantity</Th>
                            <Th isNumeric>Clearing Price</Th><Th isNumeric>Realized P&L</Th>
                        </Tr></Thead>
                        <Tbody>
                        {positions.map((pos) => (
                            <Tr key={pos.id}>
                            <Td>{pos.hour.toString().padStart(2, '0')}:00</Td>
                            <Td><Tag colorScheme={pos.position_type === 'buy' ? 'green' : 'red'}>{pos.position_type.toUpperCase()}</Tag></Td>
                            <Td isNumeric>{pos.quantity}</Td>
                            <Td isNumeric>${pos.clearing_price.toFixed(2)}</Td>
                            <Td isNumeric><PnlText value={pos.realized_pnl} /></Td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Box h="300px">
                 <Text fontSize="lg" mb={4} fontWeight="bold">P&L by Hour</Text>
                 <ResponsiveContainer width="100%" height="90%">
                     <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="hour" stroke="gray.400" />
                        <YAxis stroke="gray.400" tickFormatter={(val) => `$${val}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #4A5568', color: 'white' }}
                            cursor={{ fill: 'rgba(129, 230, 217, 0.1)' }}
                        />
                        <Bar dataKey="pnl" name="P&L">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#48bb78' : '#f56565'} />
                            ))}
                        </Bar>
                     </BarChart>
                 </ResponsiveContainer>
            </Box>
        </SimpleGrid>
    </Box>
  );
};

export default PositionsResults;
