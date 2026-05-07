import { Stack } from "expo-router";
import { BsnsProvider } from "./context";

const _layout = () => {
  return (
    <BsnsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title:'Business Information' }} />
        <Stack.Screen name="transactions" options={{ title:'Business Transactions' }} />
      </Stack>
    </BsnsProvider>
  );
};

export default _layout;
