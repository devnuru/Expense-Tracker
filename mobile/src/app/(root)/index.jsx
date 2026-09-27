import { Show, useUser } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "../../../components/SignOutButton";
import { useEffect } from "react";
import { useTransactions } from "../../../hooks/useTransactions";

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isloading, loadData, deleteTransaction } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("userId", user.id);

  console.log("transactions", transactions);
  console.log("summary", summary);

  return (
    <View>
      <Text>Welcome To My App</Text>
      <Text>Signed in as {user?.emailAddresses[0]?.emailAddress}</Text>
      <SignOutButton />
    </View>
  );
}
