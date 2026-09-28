import { Show, useUser } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "../../../components/SignOutButton";
import { useEffect } from "react";
import { useTransactions } from "../../../hooks/useTransactions";
import PageLoader from "../../../components/PageLoader";
import { styles } from "../../../assets/styles/home.styles";
import { Image } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, isloading, loadData, deleteTransaction } =
    useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isloading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* LEFT  */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userNameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* Header Right */}
          <View></View>
        </View>
      </View>
    </View>
  );
}
