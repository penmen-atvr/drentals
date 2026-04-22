import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

// Only allow URLs from our own domain to prevent open-redirect abuse.
const ALLOWED_ORIGINS = [
  'https://rentals.penmenstudios.com',
];

function isSafeUrl(url: string): boolean {
  return ALLOWED_ORIGINS.some(origin => url.startsWith(origin));
}

export default function WebViewScreen({ route, navigation }: Props) {
  const { url, title } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  // Guard: reject any URL not in our allowlist
  if (!isSafeUrl(url)) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialCommunityIcons name="shield-off-outline" size={48} color="#444" />
        <Text style={{ color: '#555', marginTop: 16, fontSize: 15, fontWeight: '600' }}>
          This link cannot be opened.
        </Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#E31B23', fontWeight: '700', marginTop: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backBtnHeader} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <WebView 
        source={{ uri: url }} 
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        showsVerticalScrollIndicator={false}
        // Security: restrict navigation within the WebView to the same allowlist
        originWhitelist={ALLOWED_ORIGINS}
        // Prevent mixed-content attacks
        mixedContentMode="never"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.1)' },
  backBtnHeader: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  backBtn: { alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#f8fafc', letterSpacing: 0.5 },
  webview: { flex: 1, backgroundColor: '#09090b' },
  loaderContainer: { position: 'absolute', top: 120, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090b', zIndex: 10 }
});
