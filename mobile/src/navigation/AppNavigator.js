import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import AnimalFormScreen from '../screens/AnimalFormScreen';
import AnimalListScreen from '../screens/AnimalListScreen';
import HomeScreen from '../screens/HomeScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import ServiceFormScreen from '../screens/ServiceFormScreen';
import ServiceListScreen from '../screens/ServiceListScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = {
  Inicio: { title: 'Início', icon: 'home' },
  Animais: { title: 'Animais', icon: 'paw' },
  Servicos: { title: 'Serviços', icon: 'calendar' },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        title: TABS[route.name].title,
        tabBarActiveTintColor: colors.rose,
        tabBarInactiveTintColor: colors.ink3,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? TABS[route.name].icon : `${TABS[route.name].icon}-outline`} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Animais" component={AnimalListScreen} />
      <Tab.Screen name="Servicos" component={ServiceListScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.rose,
        headerTitleStyle: { color: colors.ink, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.canvas },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        // O título vira o texto do botão "voltar" das telas de detalhes
        options={({ route }) => ({
          headerShown: false,
          title: TABS[getFocusedRouteNameFromRoute(route) ?? 'Inicio'].title,
        })}
      />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Serviço' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AnimalForm" component={AnimalFormScreen} />
        <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
