import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitBid } from '../services/api';
import {
  VStack, HStack, FormControl, FormLabel, Select, Button, NumberInput, NumberInputField, useToast,
} from '@chakra-ui/react';

const BidForm = ({ iso, selectedDate, onBidSubmitted }) => {
  const { token } = useAuth();
  const toast = useToast();
  const [hour, setHour] = useState(12);
  const [bidType, setBidType] = useState('buy');
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(50);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await submitBid({ iso, bid_date: selectedDate, hour, bid_type: bidType, quantity, price }, token);
        toast({ title: 'Bid Submitted!', status: 'success', duration: 3000, isClosable: true });
        onBidSubmitted(); // Refresh parent data
    } catch(err) {
        toast({ title: 'Bid Failed', description: err.message, status: 'error', duration: 5000, isClosable: true });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch" p={4} bg="gray.700" borderRadius="md" boxShadow="lg">
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Hour</FormLabel>
          <Select value={hour} onChange={(e) => setHour(parseInt(e.target.value))}>
            {[...Array(24).keys()].map(h => <option key={h} value={h}>{h.toString().padStart(2,'0')}:00</option>)}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <Select value={bidType} onChange={(e) => setBidType(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </Select>
        </FormControl>
      </HStack>
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Quantity (MWh)</FormLabel>
          <NumberInput value={quantity} onChange={(val) => setQuantity(parseFloat(val))} min={0.1}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Price ($/MWh)</FormLabel>
           <NumberInput value={price} onChange={(val) => setPrice(parseFloat(val))} min={0.01} precision={2}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </HStack>
      <Button type="submit" colorScheme="green" isLoading={isLoading}>Submit Bid</Button>
    </VStack>
  );
};

export default BidForm;
