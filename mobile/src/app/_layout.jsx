import { ClerkProvider } from "@clerk/expo";
import { Slot } from "expo-router";
import SafeScreen from "../../components/SafeScreen.jsx";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
