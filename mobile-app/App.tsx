import React, { useEffect, useCallback, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View, Easing, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { BlackOpsOne_400Regular } from '@expo-google-fonts/black-ops-one';
import { Quantico_400Regular, Quantico_700Bold } from '@expo-google-fonts/quantico';
import { RobotoMono_400Regular, RobotoMono_700Bold } from '@expo-google-fonts/roboto-mono';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import BrandsScreen from './src/screens/BrandsScreen';
import BrandDetailScreen from './src/screens/BrandDetailScreen';
import MenuScreen from './src/screens/MenuScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import { Equipment } from './src/types';

// ── Error Boundary ─────────────────────────────────────────────
// Prevents uncaught JS exceptions from hard-crashing the app during review.
interface EBState { hasError: boolean }
class AppErrorBoundary extends Component<{ children: React.ReactNode }, EBState> {
  state: EBState = { hasError: false };

  static getDerivedStateFromError(): EBState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.error('[AppErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 12 }}>Something went wrong</Text>
          <Text style={{ color: '#666', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            Please close and reopen the app. If the problem persists, contact us at admin@penmenstudios.com
          </Text>
          <TouchableOpacity
            style={{ marginTop: 32, backgroundColor: '#E31B23', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 100 }}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}


export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { slug: string; equipment?: Equipment };
  BrandDetail: { brandName: string };
  WebView: { url: string; title: string };
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: { categoryId?: number };
  Brands: undefined;
  Cart: undefined;
  Menu: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Smooth ease-out cubic bezier — no flicker, cinematic feel
const smoothTransition = {
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: { duration: 320, easing: Easing.bezier(0.25, 0.46, 0.45, 0.94) },
    },
    close: {
      animation: 'timing' as const,
      config: { duration: 260, easing: Easing.bezier(0.55, 0.06, 0.68, 0.19) },
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }: any) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [24, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.4],
      }),
    },
  }),
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 72,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(8,8,8,0.97)',
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={95} tint="dark" style={[StyleSheet.absoluteFill, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.07)' }]} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.97)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.05)' }]} />
          )
        ),
        tabBarActiveTintColor: '#E31B23',
        tabBarInactiveTintColor: '#444444',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, marginBottom: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Catalog') iconName = focused ? 'view-grid' : 'view-grid-outline';
          else if (route.name === 'Brands') iconName = focused ? 'tag-multiple' : 'tag-multiple-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Menu') iconName = focused ? 'menu' : 'menu';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "D'RENTALS" }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catalog' }} />
      <Tab.Screen name="Brands" component={BrandsScreen} options={{ title: 'Brands' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart', tabBarStyle: { display: 'none' } }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    BlackOpsOne_400Regular,
    Quantico_400Regular,
    Quantico_700Bold,
    RobotoMono_400Regular,
    RobotoMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;



  return (
    <AppErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: '#09090b' },
                headerTintColor: '#f8fafc',
                headerTitleStyle: { fontWeight: '700', fontFamily: 'Quantico_700Bold' },
                cardStyle: { backgroundColor: '#080808' },
                ...smoothTransition,
              }}
            >
              <Stack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BrandDetail"
                component={BrandDetailScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="WebView"
                component={WebViewScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppErrorBoundary>
  );
}

