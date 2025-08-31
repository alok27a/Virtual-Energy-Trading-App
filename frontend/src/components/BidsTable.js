import React from 'react';
import {
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tag, Box, Center, Text,
} from '@chakra-ui/react';

const BidsTable = ({ bids }) => {
  return (
    <Box bg="gray.700" p={4} borderRadius="md" boxShadow="lg" h="100%">
        {bids.length === 0 ? (
            <Center h="100%"><Text color="gray.400">No bids submitted for this day.</Text></Center>
        ) : (
            <TableContainer>
            <Table variant="simple" size="sm">
                <Thead>
                <Tr>
                    <Th>Hour</Th>
                    <Th>Type</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Price</Th>
                </Tr>
                </Thead>
                <Tbody>
                {bids.map((bid) => (
                    <Tr key={bid.id}>
                    <Td>{bid.hour.toString().padStart(2, '0')}:00</Td>
                    <Td><Tag colorScheme={bid.bid_type === 'buy' ? 'green' : 'red'}>{bid.bid_type.toUpperCase()}</Tag></Td>
                    <Td isNumeric>{bid.quantity}</Td>
                    <Td isNumeric>${bid.price.toFixed(2)}</Td>
                    </Tr>
                ))}
                </Tbody>
            </Table>
            </TableContainer>
        )}
    </Box>
  );
};

export default BidsTable;
