import { Stack } from "expo-router";
import { BsnsProvider } from "./context";

const _layout = () => {
  return (
    <BsnsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="transactions" options={{ headerShown: false }} />
      </Stack>
    </BsnsProvider>
  );
};

export default _layout;
