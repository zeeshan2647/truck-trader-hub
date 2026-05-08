import truck1 from "@/assets/truck-1.jpg";
import truck2 from "@/assets/truck-2.jpg";
import truck3 from "@/assets/truck-3.jpg";
import trailer1 from "@/assets/trailer-1.jpg";
import trailer2 from "@/assets/trailer-2.jpg";

export type Listing = {
  id: string;
  title: string;
  category: "truck" | "trailer";
  type: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  lat: number;
  lng: number;
  condition: "New" | "Used";
  transmission: "Manual" | "Automatic";
  vin: string;
  sellerType: "Dealer" | "Private";
  sellerName: string;
  sellerPhone: string;
  promoted: boolean;
  description: string;
  images: string[];
  specs: Record<string, string>;
};

export const listings: Listing[] = [
  {
    id: "1",
    title: "2022 Peterbilt 579 Sleeper",
    category: "truck",
    type: "Sleeper Cab",
    brand: "Peterbilt",
    model: "579",
    year: 2022,
    price: 142500,
    mileage: 312000,
    location: "Dallas, TX",
    condition: "Used",
    transmission: "Automatic",
    vin: "1XPBD49X1ND123456",
    sellerType: "Dealer",
    sellerName: "Lone Star Truck Center",
    sellerPhone: "(214) 555-0142",
    promoted: true,
    description:
      "Well-maintained 2022 Peterbilt 579 with 80\" sleeper. PACCAR MX-13 engine, fresh PM service, new steer tires. DOT-ready, single owner, all records available.",
    images: [truck1, truck2, truck3],
    specs: {
      Engine: "PACCAR MX-13 455HP",
      Transmission: "Eaton UltraShift 12-spd",
      "Rear Axle": "3.55 ratio",
      Wheelbase: "240\"",
      Suspension: "Air Ride",
      "Fuel Capacity": "300 gal",
    },
  },
  {
    id: "2",
    title: "2021 Freightliner Cascadia",
    category: "truck",
    type: "Day Cab",
    brand: "Freightliner",
    model: "Cascadia",
    year: 2021,
    price: 98900,
    mileage: 425000,
    location: "Atlanta, GA",
    condition: "Used",
    transmission: "Automatic",
    vin: "3AKJHHDR5MSMZ1234",
    sellerType: "Dealer",
    sellerName: "Southeast Heavy Trucks",
    sellerPhone: "(404) 555-0188",
    promoted: false,
    description:
      "Clean Cascadia day cab, perfect for regional hauling. DD15 engine, recent inframe at 380k. New brakes & drums.",
    images: [truck2, truck1, truck3],
    specs: {
      Engine: "Detroit DD15 505HP",
      Transmission: "DT12 Automated",
      "Rear Axle": "2.64 ratio",
      Wheelbase: "193\"",
      Suspension: "Air Ride",
      "Fuel Capacity": "240 gal",
    },
  },
  {
    id: "3",
    title: "2020 Kenworth T680",
    category: "truck",
    type: "Sleeper Cab",
    brand: "Kenworth",
    model: "T680",
    year: 2020,
    price: 87500,
    mileage: 510000,
    location: "Phoenix, AZ",
    condition: "Used",
    transmission: "Manual",
    vin: "1XKYD49X9LJ456789",
    sellerType: "Private",
    sellerName: "Mike Reynolds",
    sellerPhone: "(602) 555-0173",
    promoted: false,
    description:
      "Owner-operator truck, garage-kept and meticulously maintained. PACCAR MX-13, 13-speed Eaton manual.",
    images: [truck3, truck1, truck2],
    specs: {
      Engine: "PACCAR MX-13 485HP",
      Transmission: "Eaton 13-spd Manual",
      "Rear Axle": "3.42 ratio",
      Wheelbase: "228\"",
      Suspension: "Air Ride",
      "Fuel Capacity": "280 gal",
    },
  },
  {
    id: "4",
    title: "2023 Great Dane Reefer Trailer",
    category: "trailer",
    type: "Refrigerated",
    brand: "Great Dane",
    model: "Everest",
    year: 2023,
    price: 78000,
    mileage: 0,
    location: "Chicago, IL",
    condition: "New",
    transmission: "Automatic",
    vin: "1GRAA0626PD123456",
    sellerType: "Dealer",
    sellerName: "Midwest Trailer Sales",
    sellerPhone: "(312) 555-0166",
    promoted: true,
    description:
      "Brand new 53' reefer trailer with Carrier Vector 8500 unit. Aluminum floor, swing doors, full warranty.",
    images: [trailer2, trailer1],
    specs: {
      Length: "53 ft",
      "Reefer Unit": "Carrier Vector 8500",
      Axles: "Tandem",
      "Tire Size": "295/75R22.5",
      Doors: "Swing",
      Floor: "Aluminum Duct",
    },
  },
  {
    id: "5",
    title: "2019 Wabash Flatbed Trailer",
    category: "trailer",
    type: "Flatbed",
    brand: "Wabash",
    model: "DuraPlate",
    year: 2019,
    price: 28500,
    mileage: 0,
    location: "Denver, CO",
    condition: "Used",
    transmission: "Manual",
    vin: "1JJV532D8KL789012",
    sellerType: "Private",
    sellerName: "Rocky Mountain Hauling",
    sellerPhone: "(303) 555-0119",
    promoted: false,
    description:
      "48' aluminum flatbed, light weight for max payload. Includes 8 winches, 4 chains and tarps.",
    images: [trailer1, trailer2],
    specs: {
      Length: "48 ft",
      Material: "Aluminum",
      Axles: "Tandem Spread",
      "Empty Weight": "9,200 lbs",
      "Tie-downs": "8 winches",
      Suspension: "Air Ride",
    },
  },
];