"use client";
import { useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, CheckCircle } from "lucide-react";

// Placeholder JSON data for Lagos locations
const locationData = [
  {
    id: 1,
    location: "Victoria Island",
    lat: 6.4281,
    lng: 3.4219,
    totalSignups: 1250,
    totalCompleted: 890,
    address: "Victoria Island, Lagos",
  },
  {
    id: 2,
    location: "Ikeja",
    lat: 6.6018,
    lng: 3.3515,
    totalSignups: 980,
    totalCompleted: 720,
    address: "Ikeja, Lagos State",
  },
  {
    id: 3,
    location: "Lekki",
    lat: 6.4698,
    lng: 3.5852,
    totalSignups: 750,
    totalCompleted: 580,
    address: "Lekki Peninsula, Lagos",
  },
  {
    id: 4,
    location: "Surulere",
    lat: 6.4969,
    lng: 3.3841,
    totalSignups: 650,
    totalCompleted: 420,
    address: "Surulere, Lagos",
  },
  {
    id: 5,
    location: "Yaba",
    lat: 6.5158,
    lng: 3.3707,
    totalSignups: 480,
    totalCompleted: 350,
    address: "Yaba, Lagos",
  },
  {
    id: 6,
    location: "Ikoyi",
    lat: 6.4541,
    lng: 3.4316,
    totalSignups: 590,
    totalCompleted: 445,
    address: "Ikoyi, Lagos",
  },
];

interface LocationInfo {
  id: number;
  location: string;
  lat: number;
  lng: number;
  totalSignups: number;
  totalCompleted: number;
  address: string;
}

interface GoogleMapProps {
  data?: LocationInfo[];
  apiKey?: string;
}

function LocationInfoCard({
  location,
  onClose,
}: {
  location: LocationInfo;
  onClose: () => void;
}) {
  const completionRate = Math.round(
    (location.totalCompleted / location.totalSignups) * 100
  );

  return (
    <Card className="w-80 py-0 pb-10 shadow-2xl border-0 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-xl font-bold text-gray-900">
              {location.location}
            </CardTitle>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{location.address}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid gap-4">
          <div className="bg-teal-50 flex items-center justify-between p-4 rounded-lg">
            <div className="flex items-center gap-2 ">
              <Users className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-900">
                Total Signups
              </span>
            </div>
            <p className="text-base font-bold text-teal-600">
              {location.totalSignups.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50  flex items-center justify-between p-4 rounded-lg">
            <div className="flex  items-center gap-2 ">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Completed
              </span>
            </div>
            <p className="text-base font-bold text-green-600">
              {location.totalCompleted.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryOverlay({ data }: { data: LocationInfo[] }) {
  const totalSignups = data.reduce(
    (sum, location) => sum + location.totalSignups,
    0
  );
  const totalCompleted = data.reduce(
    (sum, location) => sum + location.totalCompleted,
    0
  );
  const overallCompletionRate = Math.round(
    (totalCompleted / totalSignups) * 100
  );

  return (
    <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg min-w-[280px]">
      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-teal-600" />
        Lagos Overview
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-gray-700">
              Total Signups
            </span>
          </div>
          <span className="text-base font-bold text-teal-600">
            {totalSignups.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Total Completed
            </span>
          </div>
          <span className="text-base font-bold text-green-600">
            {totalCompleted.toLocaleString()}
          </span>
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Completion Rate
            </span>
            <span className="text-base font-bold text-cyan-600">
              {overallCompletionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallCompletionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-1">
          {data.length} locations tracked
        </div>
      </div>
    </div>
  );
}

export default function GoogleMap({
  data = locationData,
  apiKey = "YOUR_API_KEY",
}: GoogleMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );

  // Center of Lagos for initial view
  const mapCenter = { lat: 6.5244, lng: 3.3792 };

  return (
    <div className="relative w-full max-w-7xl rounded-[20px] overflow-hidden h-[500px]">
      <SummaryOverlay data={data} />
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={false}
          styles={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ]}
          className="w-full h-full"
        >
          {/* Render markers for each location */}
          {data.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setSelectedLocation(location)}
              title={location.location}
            />
          ))}

          {/* Info Window for selected location */}
          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <LocationInfoCard
                location={selectedLocation}
                onClose={() => setSelectedLocation(null)}
              />
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          <span className="text-gray-700">Click markers to view details</span>
        </div>
      </div>

      {/* API Key Notice */}
      {apiKey === "YOUR_API_KEY" && (
        <div className="absolute top-[200px] right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm font-medium">⚠️ API Key Required</p>
          <p className="text-xs mt-1">
            Add your Google Maps API key to see the live map
          </p>
        </div>
      )}
    </div>
  );
}
