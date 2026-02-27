// import Mapbox from '@rnmapbox/maps';
// import React, { useState } from 'react';
// import { View, Button } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import dafaIplant from '../../Assets/MapFiles/dafaIplant.json';


// interface infoStateType {
//   lat: number
//   lng: number
// }

// const RNMapboxScreen = () => {

//   const firstPoint = dafaIplant?.features?.[0]?.geometry?.coordinates?.[0]?.[0];
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Mapbox.MapView style={{ flex: 1 }}>
//           <Mapbox.Camera zoomLevel={15} centerCoordinate={firstPoint as [number, number]} />
//           <Mapbox.ShapeSource id="plantSource" shape={dafaIplant as any}>
//             <Mapbox.FillLayer id="plantFill" style={{ fillOpacity: 0.6, fillColor: '#2ECC71' }} />
//             <Mapbox.LineLayer id="plantBorder" style={{ lineColor: '#FFFFFF', lineWidth: 2 }} />
//           </Mapbox.ShapeSource>
//         </Mapbox.MapView>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default RNMapboxScreen;




import React, { useState } from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from '../../Utils/permission';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29kZXJ6dmlzaW9udGVjaCIsImEiOiJjbTYyNjBvZW0wYjJlMmpzZW5oNmJnbjFjIn0.0PCEDEhljNhP-zYkLHnTxg';

const RNMapboxScreen = () => {

  const getRegionFromCoords = async (lat: number, lng: number) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place`;
      const response = await fetch(url);
      const data = await response.json();

      if (data?.features && data?.features?.length > 0) {
        const region = data?.features?.[0]?.text;

        console.log("--------------------------");
        console.log("📍 CURRENT REGION:", region);
        console.log("--------------------------");

        Alert.alert("Region Found", `You are in: ${region}`);
      } else {
        console.log("No region found for these coordinates.");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
    }
  };

  const handlePress = async () => {
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert("Permission Denied", "Please allow location access.");
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          if (position && position?.coords) {
            const { latitude, longitude } = position?.coords;
            console.log(`Lat: ${latitude}, Lng: ${longitude}`);
            getRegionFromCoords(latitude, longitude);
          }
        },
        (error) => {
          console.log("Location Error:", error?.code, error?.message);
          Alert.alert("Location Error", error?.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceLocationManager: Platform.OS === 'android'
        }
      );
    } catch (err) {
      console.warn("HandlePress Crash Prevented:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title="Console My Region"
          onPress={() => handlePress()}
          color="#d0f81d"
        />
      </View>
    </SafeAreaView>
  );
};

export default RNMapboxScreen;