// react Custom Hooks

import { useState } from "react";
const API_URL = "http://localhost:3001/api/transactions";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [sumary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  cost[(loading, setLoading)] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/${userId}`);
      const data = await response.json();
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Fetch both transactions and summary in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
      // await fetchTransactions(); //2s
      // await fetchSummary();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);
};
