// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   MapPin,
//   Leaf,
//   Users,
//   TrendingUp,
//   ExternalLink,
//   Navigation,
// } from "lucide-react";
// import dynamic from "next/dynamic";

// // Dynamically import map components to avoid SSR issues
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );
// const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
//   ssr: false,
// });

// interface MapLocation {
//   id: string;
//   name: string;
//   lat: number;
//   lng: number;
//   type: "farm" | "market" | "processing" | "headquarters";
//   description: string;
//   status: "active" | "planned" | "completed";
//   details: string;
//   contact?: string;
//   capacity?: string;
// }

// const lagosLocations: MapLocation[] = [
//   {
//     id: "1",
//     name: "Lagos State Secretariat",
//     lat: 6.5244,
//     lng: 3.3792,
//     type: "headquarters",
//     description: "Program Headquarters - Policy and coordination center",
//     details:
//       "Main administrative center for the Produce for Lagos Program. Handles policy formulation, program coordination, and stakeholder management.",
//     status: "active",
//     contact: "+234 1 234 5678",
//     capacity: "Administrative Hub",
//   },
//   {
//     id: "2",
//     name: "Alimosho Farm Center",
//     lat: 6.6018,
//     lng: 3.2278,
//     type: "farm",
//     description: "Large-scale vegetable production facility",
//     details:
//       "Modern agricultural facility specializing in leafy vegetables, tomatoes, and peppers. Equipped with greenhouse technology and irrigation systems.",
//     status: "active",
//     contact: "+234 1 234 5679",
//     capacity: "500 hectares",
//   },
//   {
//     id: "3",
//     name: "Ikorodu Rice Mill",
//     lat: 6.6194,
//     lng: 3.5106,
//     type: "processing",
//     description: "Rice processing and packaging facility",
//     details:
//       "State-of-the-art rice milling facility with modern parboiling, milling, and packaging equipment. Processes local rice varieties.",
//     status: "completed",
//     contact: "+234 1 234 5680",
//     capacity: "10 tons/day",
//   },
//   {
//     id: "4",
//     name: "Mile 12 Market Hub",
//     lat: 6.5833,
//     lng: 3.3833,
//     type: "market",
//     description: "Major distribution center for local produce",
//     details:
//       "Primary wholesale market for agricultural products in Lagos. Serves as the main distribution point for locally produced goods.",
//     status: "active",
//     contact: "+234 1 234 5681",
//     capacity: "5000 vendors",
//   },
//   {
//     id: "5",
//     name: "Badagry Aquaculture Center",
//     lat: 6.4316,
//     lng: 2.8876,
//     type: "farm",
//     description: "Fish farming and aquaculture development",
//     details:
//       "Modern fish farming facility focusing on catfish and tilapia production. Includes hatchery, grow-out ponds, and processing unit.",
//     status: "planned",
//     contact: "+234 1 234 5682",
//     capacity: "200 ponds",
//   },
//   {
//     id: "6",
//     name: "Epe Cassava Processing",
//     lat: 6.5833,
//     lng: 3.9833,
//     type: "processing",
//     description: "Cassava flour and starch production",
//     details:
//       "Cassava processing plant producing high-quality cassava flour, starch, and other derivatives for local and export markets.",
//     status: "active",
//     contact: "+234 1 234 5683",
//     capacity: "50 tons/day",
//   },
// ];

// // Custom marker component
// function CustomMarker({
//   location,
//   onSelect,
// }: {
//   location: MapLocation;
//   onSelect: (location: MapLocation) => void;
// }) {
//   const getMarkerIcon = (type: string, status: string) => {
//     let color = "#10b981"; // default green
//     let bgColor = "#dcfce7";

//     switch (type) {
//       case "headquarters":
//         color = "#3b82f6"; // blue
//         bgColor = "#dbeafe";
//         break;
//       case "farm":
//         color = "#10b981"; // green
//         bgColor = "#dcfce7";
//         break;
//       case "processing":
//         color = "#f59e0b"; // amber
//         bgColor = "#fef3c7";
//         break;
//       case "market":
//         color = "#ef4444"; // red
//         bgColor = "#fee2e2";
//         break;
//     }

//     if (status === "planned") {
//       color = "#6b7280"; // gray for planned
//       bgColor = "#f3f4f6";
//     }

//     return `
//       <div style="
//         width: 32px;
//         height: 32px;
//         background-color: ${bgColor};
//         border: 3px solid ${color};
//         border-radius: 50%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-size: 14px;
//         font-weight: bold;
//         color: ${color};
//         box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//       ">
//         ${
//           type === "headquarters"
//             ? "H"
//             : type === "farm"
//             ? "F"
//             : type === "processing"
//             ? "P"
//             : "M"
//         }
//       </div>
//     `;
//   };

//   const getTypeIcon = (type: string) => {
//     switch (type) {
//       case "headquarters":
//         return "🏛️";
//       case "farm":
//         return "🌾";
//       case "processing":
//         return "🏭";
//       case "market":
//         return "🏪";
//       default:
//         return "📍";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;";
//       case "completed":
//         return "background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe;";
//       case "planned":
//         return "background-color: #fef3c7; color: #92400e; border: 1px solid #fed7aa;";
//       default:
//         return "background-color: #f3f4f6; color: #374151; border: 1px solid #d1d5db;";
//     }
//   };

//   // Create custom icon using divIcon
//   const customIcon = {
//     html: getMarkerIcon(location.type, location.status),
//     className: "custom-marker",
//     iconSize: [32, 32],
//     iconAnchor: [16, 16],
//   };

//   return (
//     <Marker position={[location.lat, location.lng]} icon={customIcon as any}>
//       <Popup maxWidth={350} className="custom-popup">
//         <div
//           style={{
//             fontFamily: "system-ui, -apple-system, sans-serif",
//             maxWidth: "320px",
//           }}
//         >
//           <div
//             style={{
//               padding: "16px",
//               background: "white",
//               borderRadius: "8px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 marginBottom: "12px",
//               }}
//             >
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "18px",
//                     fontWeight: "600",
//                     color: "#1f2937",
//                     margin: "0 0 4px 0",
//                   }}
//                 >
//                   {location.name}
//                 </h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   <span style={{ fontSize: "16px" }}>
//                     {getTypeIcon(location.type)}
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "12px",
//                       textTransform: "capitalize",
//                       color: "#6b7280",
//                     }}
//                   >
//                     {location.type}
//                   </span>
//                 </div>
//               </div>
//               <span
//                 style={{
//                   padding: "4px 8px",
//                   borderRadius: "4px",
//                   fontSize: "12px",
//                   fontWeight: "500",
//                   ...Object.fromEntries(
//                     getStatusColor(location.status)
//                       .split(";")
//                       .map((style) => style.split(":").map((s) => s.trim()))
//                   ),
//                 }}
//               >
//                 {location.status}
//               </span>
//             </div>

//             <p
//               style={{
//                 fontSize: "14px",
//                 color: "#4b5563",
//                 margin: "0 0 12px 0",
//                 lineHeight: "1.4",
//               }}
//             >
//               {location.description}
//             </p>

//             <div
//               style={{
//                 backgroundColor: "#f9fafb",
//                 padding: "12px",
//                 borderRadius: "6px",
//                 marginBottom: "12px",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "13px",
//                   color: "#374151",
//                   margin: "0",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 {location.details}
//               </p>
//             </div>

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "8px",
//                 fontSize: "12px",
//                 color: "#6b7280",
//                 marginBottom: "12px",
//               }}
//             >
//               {location.contact && (
//                 <div>
//                   <strong>Contact:</strong>
//                   <br />
//                   {location.contact}
//                 </div>
//               )}
//               {location.capacity && (
//                 <div>
//                   <strong>Capacity:</strong>
//                   <br />
//                   {location.capacity}
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => onSelect(location)}
//               style={{
//                 width: "100%",
//                 padding: "8px 16px",
//                 backgroundColor: "#10b981",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "6px",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 cursor: "pointer",
//               }}
//             >
//               View Details
//             </button>
//           </div>
//         </div>
//       </Popup>
//     </Marker>
//   );
// }

// export function LagosMap() {
//   const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
//     null
//   );
//   const [isClient, setIsClient] = useState(false);
//   const mapRef = useRef<any>(null);

//   useEffect(() => {
//     setIsClient(true);
//     // Import Leaflet CSS
//     // import("leaflet/dist/leaflet.css");
//     // Fix for default markers
//     import("leaflet").then((L) => {
//       delete (L.Icon.Default.prototype as any)._getIconUrl;
//       L.Icon.Default.mergeOptions({
//         iconRetinaUrl: "/leaflet/marker-icon-2x.png",
//         iconUrl: "/leaflet/marker-icon.png",
//         shadowUrl: "/leaflet/marker-shadow.png",
//       });
//     });
//   }, []);

//   const getStatusColor = (status: MapLocation["status"]) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "completed":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "planned":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const centerMapOnLocation = (location: MapLocation) => {
//     if (mapRef.current) {
//       mapRef.current.setView([location.lat, location.lng], 14);
//     }
//   };

//   if (!isClient) {
//     return (
//       <div className="w-full max-w-7xl">
//         <Card className="overflow-hidden">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-center h-[600px]">
//               <div className="text-center">
//                 <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                 <p className="text-gray-600">Loading Map...</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl">
//       <Card className="overflow-hidden">
//         <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                 <Leaf className="w-6 h-6 text-green-600" />
//                 Produce for Lagos Program
//               </CardTitle>
//               <CardDescription className="text-gray-600 mt-2">
//                 Lagos State Government's initiative to boost local food
//                 production and ensure food security
//               </CardDescription>
//             </div>
//             <Button variant="outline" className="gap-2 bg-transparent">
//               <ExternalLink className="w-4 h-4" />
//               Learn More
//             </Button>
//           </div>

//           {/* Program Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//             <div className="bg-white rounded-lg p-4 shadow-sm border">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <Users className="w-5 h-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">15,000+</p>
//                   <p className="text-sm text-gray-600">Farmers Registered</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm border">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">50+</p>
//                   <p className="text-sm text-gray-600">Active Locations</p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm border">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <TrendingUp className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">₦2.5B</p>
//                   <p className="text-sm text-gray-600">Investment Value</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
//             {/* Map Area */}
//             <div className="lg:col-span-2 relative">
//               <MapContainer
//                 center={[6.5244, 3.3792]} // Lagos coordinates
//                 zoom={10}
//                 style={{ height: "100%", width: "100%" }}
//                 ref={mapRef}
//               >
//                 <TileLayer
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 {lagosLocations.map((location) => (
//                   <CustomMarker
//                     key={location.id}
//                     location={location}
//                     onSelect={setSelectedLocation}
//                   />
//                 ))}
//               </MapContainer>
//             </div>

//             {/* Sidebar */}
//             <div className="bg-gray-50 p-6 overflow-y-auto">
//               <h3 className="font-semibold text-lg mb-4 text-gray-900">
//                 Program Locations
//               </h3>

//               {selectedLocation ? (
//                 <div className="mb-6">
//                   <div className="bg-white rounded-lg p-4 shadow-sm border">
//                     <div className="flex items-start justify-between mb-3">
//                       <h4 className="font-semibold text-gray-900">
//                         {selectedLocation.name}
//                       </h4>
//                       <Badge
//                         className={getStatusColor(selectedLocation.status)}
//                       >
//                         {selectedLocation.status}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-3">
//                       {selectedLocation.description}
//                     </p>
//                     <div className="bg-gray-50 p-3 rounded-lg mb-3">
//                       <p className="text-xs text-gray-700">
//                         {selectedLocation.details}
//                       </p>
//                     </div>
//                     {selectedLocation.contact && (
//                       <div className="text-xs text-gray-600 mb-2">
//                         <strong>Contact:</strong> {selectedLocation.contact}
//                       </div>
//                     )}
//                     {selectedLocation.capacity && (
//                       <div className="text-xs text-gray-600 mb-3">
//                         <strong>Capacity:</strong> {selectedLocation.capacity}
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
//                       <span className="text-lg">
//                         {selectedLocation.type === "headquarters"
//                           ? "🏛️"
//                           : selectedLocation.type === "farm"
//                           ? "🌾"
//                           : selectedLocation.type === "processing"
//                           ? "🏭"
//                           : "🏪"}
//                       </span>
//                       <span className="capitalize">
//                         {selectedLocation.type}
//                       </span>
//                     </div>
//                     <Button
//                       size="sm"
//                       onClick={() => centerMapOnLocation(selectedLocation)}
//                       className="w-full mb-2 gap-2"
//                     >
//                       <Navigation className="w-4 h-4" />
//                       Center on Map
//                     </Button>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setSelectedLocation(null)}
//                     className="mt-2 w-full"
//                   >
//                     View All Locations
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {lagosLocations.map((location) => (
//                     <div
//                       key={location.id}
//                       className="bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
//                       onClick={() => {
//                         setSelectedLocation(location);
//                         centerMapOnLocation(location);
//                       }}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-medium text-sm text-gray-900">
//                           {location.name}
//                         </h4>
//                         <Badge
//                           size="sm"
//                           className={getStatusColor(location.status)}
//                         >
//                           {location.status}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <span>
//                           {location.type === "headquarters"
//                             ? "🏛️"
//                             : location.type === "farm"
//                             ? "🌾"
//                             : location.type === "processing"
//                             ? "🏭"
//                             : "🏪"}
//                         </span>
//                         <span className="capitalize">{location.type}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Program Info */}
//               <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
//                 <h4 className="font-semibold text-green-900 mb-2">
//                   About the Program
//                 </h4>
//                 <p className="text-sm text-green-800 leading-relaxed">
//                   The Produce for Lagos Program is a comprehensive agricultural
//                   initiative aimed at achieving food security, creating jobs,
//                   and boosting the local economy through sustainable farming
//                   practices.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
