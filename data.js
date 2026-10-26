/**
 * Shared Sales Dataset Source
 * Default records extracted from subai(1).xlsx (10 orders, ₹228,500 revenue, 39 units)
 * All dashboard charts, KPIs, categories, regions, and metrics are dynamically
 * calculated from this shared dataset.
 */

const DEFAULT_SALES_RECORDS = [
  {
    id: "rec_1",
    orderId: "ORD-1001",
    date: "2024-02-02",
    product: "Laptop",
    category: "Electronics",
    quantity: 2,
    unitPrice: 54000,
    revenue: 108000,
    region: "Bengaluru (South)",
    city: "Bengaluru",
    paymentMethod: "Credit Card",
    status: "Delivered"
  },
  {
    id: "rec_2",
    orderId: "ORD-1002",
    date: "2024-02-05",
    product: "Mouse",
    category: "Accessories",
    quantity: 8,
    unitPrice: 650,
    revenue: 5200,
    region: "Chennai (South)",
    city: "Chennai",
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "rec_3",
    orderId: "ORD-1003",
    date: "2024-02-07",
    product: "Keyboard",
    category: "Accessories",
    quantity: 5,
    unitPrice: 1600,
    revenue: 8000,
    region: "Hyderabad (South)",
    city: "Hyderabad",
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "rec_4",
    orderId: "ORD-1004",
    date: "2024-02-10",
    product: "Monitor",
    category: "Electronics",
    quantity: 2,
    unitPrice: 15500,
    revenue: 31000,
    region: "Mumbai (West)",
    city: "Mumbai",
    paymentMethod: "Net Banking",
    status: "Delivered"
  },
  {
    id: "rec_5",
    orderId: "ORD-1005",
    date: "2024-02-12",
    product: "Headphones",
    category: "Audio",
    quantity: 4,
    unitPrice: 2400,
    revenue: 9600,
    region: "Delhi (North)",
    city: "Delhi",
    paymentMethod: "Debit Card",
    status: "Delivered"
  },
  {
    id: "rec_6",
    orderId: "ORD-1006",
    date: "2024-02-15",
    product: "Laptop",
    category: "Electronics",
    quantity: 1,
    unitPrice: 49500,
    revenue: 49500,
    region: "Bengaluru (South)",
    city: "Bengaluru",
    paymentMethod: "Credit Card",
    status: "Delivered"
  },
  {
    id: "rec_7",
    orderId: "ORD-1007",
    date: "2024-02-18",
    product: "Mouse",
    category: "Accessories",
    quantity: 7,
    unitPrice: 700,
    revenue: 4900,
    region: "Pune (West)",
    city: "Pune",
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "rec_8",
    orderId: "ORD-1008",
    date: "2024-02-20",
    product: "Webcam",
    category: "Accessories",
    quantity: 3,
    unitPrice: 2100,
    revenue: 6300,
    region: "Kochi (South)",
    city: "Kochi",
    paymentMethod: "UPI",
    status: "Delivered"
  },
  {
    id: "rec_9",
    orderId: "ORD-1009",
    date: "2024-02-23",
    product: "External SSD",
    category: "Storage",
    quantity: 1,
    unitPrice: 4200,
    revenue: 4200,
    region: "Kolkata (East)",
    city: "Kolkata",
    paymentMethod: "Net Banking",
    status: "Delivered"
  },
  {
    id: "rec_10",
    orderId: "ORD-1010",
    date: "2024-02-26",
    product: "USB-C Hub",
    category: "Accessories",
    quantity: 6,
    unitPrice: 300,
    revenue: 1800,
    region: "Ahmedabad (West)",
    city: "Ahmedabad",
    paymentMethod: "Cash on Delivery",
    status: "Delivered"
  }
];

// Configuration Metadata
const DASHBOARD_CONFIG = {
  workbookName: "subai(1).xlsx",
  title: "Sales & Revenue Dashboard",
  subtitle: "Sales performance overview and key business insights",
  targetRevenue: 200000,
  currency: "INR",
  currencySymbol: "₹"
};

if (typeof window !== "undefined") {
  window.DEFAULT_SALES_RECORDS = DEFAULT_SALES_RECORDS;
  window.DASHBOARD_CONFIG = DASHBOARD_CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DEFAULT_SALES_RECORDS, DASHBOARD_CONFIG };
}
