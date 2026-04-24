import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/screens/Auth/SocialAuth" />;
  }

  return <Redirect href="/(tabs)/Home" />;
}
