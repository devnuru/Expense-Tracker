import { Show, useUser } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "../../../components/SignOutButton";

export default function Page() {
  const { user } = useUser();

  return (
    <View>
      <Text>Welcome To My App</Text>
      <Text>Signed in as {user?.emailAddresses[0]?.emailAddress}</Text>
      <SignOutButton />
    </View>
  );
}
