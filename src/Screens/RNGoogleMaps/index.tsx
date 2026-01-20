import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const RNGoogleMap = () => {
    const mapRef = useRef<any>(null)
    const GOOGLE_MAP_API = 'AIzaSyCSR00qWb2AcRUP9UGBlgQXFmm8HrsNOEk'

    const origin = {
        latitude: 13.0827,
        longitude: 80.2707,
    }

    const destination = {
        latitude: 12.9716,
        longitude: 77.5946,
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 3,
                    longitudeDelta: 3,
                }}
                style={{ flex: 1 }}
            >
                <Marker
                    coordinate={destination}
                    title="Customer"
                    pinColor="blue"
                />

                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAP_API}
                    strokeWidth={5}
                    strokeColor="#148057"
                    onReady={(result) => {
                        console.log(result, '------------------------------');

                        mapRef.current?.fitToCoordinates(result.coordinates, {
                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                            animated: true,
                        })
                    }}
                    onError={(err) => console.log('DIRECTION ERROR:', err)}
                />
            </MapView>
        </SafeAreaView>
    )
}

export default RNGoogleMap
