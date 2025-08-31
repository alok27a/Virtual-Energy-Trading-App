import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Heading, SimpleGrid, VStack, Select, Input, Button, Spinner, Center, Alert, AlertIcon, useToast, Flex, Spacer,
} from '@chakra-ui/react';
import { format, subDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getMarketData, getUserBids, runSimulation } from '../services/api';
import MarketChart from '../components/MarketChart';
import BidsTable from '../components/BidsTable';
import PositionsResults from '../components/PositionsResults';
import BidForm from '../components/BidForm';
import BidsChart from '../components/BidsChart';

const ISOS = ["CAISO", "MISO", "PJM", "ERCOT", "SPP", "ISONE", "NYISO"];

const DashboardPage = () => {
  const { token, logout } = useAuth();
  const toast = useToast();
  
  const [iso, setIso] = useState('CAISO');
  const [selectedDate, setSelectedDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  
  const [marketData, setMarketData] = useState({ daData: [], rtData: [] });
  const [bids, setBids] = useState([]);
  const [positions, setPositions] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!iso || !selectedDate) return;
    setIsLoading(true);
    setError('');
    setPositions([]); // Clear old simulation results
    try {
      const [marketRes, bidsRes] = await Promise.all([
        getMarketData(iso, selectedDate, token),
        getUserBids(iso, selectedDate, token),
      ]);
      setMarketData(marketRes);
      setBids(bidsRes);
    } catch (err) {
      setError(err.message);
      setMarketData({ daData: [], rtData: [] });
      setBids([]);
    } finally {
      setIsLoading(false);
    }
  }, [iso, selectedDate, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setError('');
    try {
      const simulationResults = await runSimulation(iso, selectedDate, token);
      setPositions(simulationResults);
      toast({
        title: 'Simulation Complete.',
        description: `P&L calculated for ${simulationResults.length} cleared position(s).`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
        toast({
            title: 'Simulation Failed.',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
        setPositions([]);
    } finally {
        setIsSimulating(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex alignItems="center">
            <Heading>⚡️ Virtual Energy Trader</Heading>
            <Spacer />
            <Button onClick={logout} colorScheme="red">Logout</Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} bg="gray.700" p={4} borderRadius="md">
          <Select value={iso} onChange={(e) => setIso(e.target.value)}>
            {ISOS.map((isoName) => (<option key={isoName} value={isoName}>{isoName}</option>))}
          </Select>
          <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </SimpleGrid>

        {error && (<Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>)}

        {isLoading ? (
          <Center h="400px"><Spinner size="xl" /></Center>
        ) : (
          <Box bg="gray.700" p={4} borderRadius="md" boxShadow="lg">
            <MarketChart data={marketData} />
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <VStack spacing={6} align="stretch">
                <Heading size="md">1. Place Your Bids</Heading>
                <BidForm iso={iso} selectedDate={selectedDate} onBidSubmitted={fetchData} />
                <Button colorScheme="blue" onClick={handleRunSimulation} isLoading={isSimulating} disabled={bids.length === 0}>
                    2. Run P&L Simulation
                </Button>
                <BidsChart bids={bids} />
            </VStack>
            <VStack spacing={6} align="stretch">
                 <Heading size="md">Submitted Bids ({selectedDate})</Heading>
                 <BidsTable bids={bids} />
            </VStack>
        </SimpleGrid>
        
        {positions.length > 0 && (
            <Box mt={8}>
                <Heading size="md" mb={4}>3. Simulation Results</Heading>
                <PositionsResults positions={positions} />
            </Box>
        )}
      </VStack>
    </Container>
  );
};

export default DashboardPage;
