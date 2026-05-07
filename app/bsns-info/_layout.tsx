import { Stack } from "expo-router";
import { BsnsProvider } from "./context";

const BusinessInfoLayout = () => {
  return (
    <BsnsProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Business Information',
            headerTitleStyle: {
              fontWeight: '600',
              color: '#2C3E50',
            },
            headerShadowVisible: false,
          }} 
        />
        <Stack.Screen 
          name="transactions" 
          options={{ 
            title: 'Transactions',
            headerTitleStyle: {
              fontWeight: '600',
              color: '#2C3E50',
            },
            headerShadowVisible: false,
          }} 
        />
      </Stack>
    </BsnsProvider>
  );
};

export default BusinessInfoLayout;