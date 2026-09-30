// react Custom Hooks

import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [isloading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the functions.
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      // Fetch both transactions and summary in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
      // await fetchTransactions(); //2s
      // await fetchSummary();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      //Refresh data after deletion
      loadData();
      Alert.alert("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    transactions,
    summary,
    isloading,
    loadData,
    deleteTransaction,
  };
};
