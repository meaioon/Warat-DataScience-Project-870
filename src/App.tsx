/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plane, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  Globe, 
  Navigation, 
  Shield, 
  Calendar,
  ChevronRight,
  Info,
  ArrowUpRight,
  MapPin,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Map as MapIcon,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Translations ---

const TRANSLATIONS = {
  th: {
    app_name: 'บริษัท วิทยุการบินแห่งประเทศไทย จำกัด',
    app_subtitle: 'แดชบอร์ดข้อมูลเที่ยวบิน',
    nav_overview: 'ภาพรวม',
    nav_map: 'แผนที่ประเทศไทย',
    nav_airports: 'รายชื่อท่าอากาศยาน',
    nav_operations: 'การดำเนินงาน',
    nav_analytics: 'การวิเคราะห์',
    fiscal_year: 'ปีงบประมาณ',
    updated: 'อัปเดตเมื่อ',
    dashboard_title: 'ภาพรวมการดำเนินงานเที่ยวบิน',
    dashboard_desc: 'การตรวจสอบปริมาณการจราจรทางอากาศในเขตแถลงข่าวการบินกรุงเทพฯ แบบเรียลไทม์',
    month_feb: 'กุมภาพันธ์ 2569',
    month_jan: 'มกราคม 2569',
    month_dec: 'ธันวาคม 2568',
    month_nov: 'พฤศจิกายน 2568',
    stat_total_flights: 'เที่ยวบินทั้งหมด (เดือน)',
    stat_avg_flights: 'เที่ยวบินเฉลี่ยต่อวัน',
    stat_annual_total: 'ยอดรวมรายปี',
    stat_ifr_dominance: 'สัดส่วน IFR',
    stat_sub_flights: 'เที่ยวบินในเดือน',
    stat_sub_daily: 'ค่าเฉลี่ยการดำเนินงานรายวัน',
    stat_sub_cumulative: 'ยอดสะสมปีงบประมาณ',
    stat_sub_ifr: 'กฎการบินด้วยเครื่องวัดประกอบการบิน',
    chart_monthly_trend: 'การจราจรรายเดือน',
    chart_forecast: 'แนวโน้มการจราจรรายเดือน (คาดการณ์)',
    chart_type_dist: 'สัดส่วนประเภทเที่ยวบิน',
    chart_ops_type: 'การดำเนินงานแยกตามประเภทเที่ยวบิน',
    airport_network_title: 'เครือข่ายท่าอากาศยานในประเทศไทย (แยกตามสังกัดต่างๆ)',
    airport_network_desc: 'การตรวจสอบศูนย์กลางทางการบินทั่วราชอาณาจักรไทย',
    btn_view_all: 'ดูรายชื่อท่าอากาศยานทั้งหมดในประเทศไทย',
    dir_title: 'รายชื่อท่าอากาศยานในสังกัดของ บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)',
    dir_doa_title: 'รายชื่อท่าอากาศยานในสังกัดของ กรมท่าอากาศยาน',
    dir_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัดของ บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)',
    dir_doa_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัด กรมท่าอากาศยาน',
    dir_army_title: 'รายชื่อท่าอากาศยานในสังกัดของ กองทัพบก',
    dir_army_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัด กองทัพบก',
    dir_navy_title: 'รายชื่อท่าอากาศยานในสังกัดของ กองทัพเรือ',
    dir_navy_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัด กองทัพเรือ',
    dir_airforce_title: 'รายชื่อท่าอากาศยานในสังกัดของ กองทัพอากาศ',
    dir_airforce_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัด กองทัพอากาศ',
    dir_private_title: 'รายชื่อท่าอากาศยานของ หน่วยงานอื่นๆ / รัฐวิสาหกิจ / เอกชน',
    dir_private_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานเอกชน',
    dir_closed_title: 'ท่าอากาศยานที่ยกเลิกการใช้งานแล้ว / ในอดีต',
    dir_closed_desc: 'รายชื่อสนามบินที่ไม่ได้เปิดให้บริการแล้ว หรือเป็นสนามบินในอดีต',
    table_icao: 'รหัส ICAO',
    table_iata: 'รหัส IATA',
    table_name: 'ชื่อท่าอากาศยาน',
    table_location: 'จังหวัด',
    table_owner: 'เจ้าของ/หน่วยงาน',
    table_type: 'ประเภท',
    table_actions: 'ดำเนินการ',
    table_details: 'รายละเอียด',
    ops_rule_comp: 'การเปรียบเทียบกฎการบิน',
    ops_insights_title: 'ข้อมูลเชิงลึกการดำเนินงาน',
    ops_insight_1: 'สัดส่วน IFR ที่ {val} แสดงถึงการพึ่งพาการจราจรเชิงพาณิชย์ที่นำทางด้วยเครื่องวัดประกอบการบินในระดับสูง',
    ops_insight_2: 'เที่ยวบินระหว่างประเทศมีสัดส่วนมากกว่าครึ่งหนึ่งของปริมาณทั้งหมด ตอกย้ำบทบาทของไทยในฐานะศูนย์กลางภูมิภาค',
    ops_insight_3: 'การดำเนินงานทางทหารยังคงมีอยู่อย่างต่อเนื่องด้วยการเคลื่อนไหวมากกว่า 4,000 ครั้งต่อเดือน',
    sys_status_title: 'สถานะระบบ',
    sys_status_online: 'บริการข้อมูลการบินออนไลน์',
    sys_disclaimer: 'ข้อมูลจัดทำโดย บริษัท วิทยุการบินแห่งประเทศไทย จำกัด (บวท.) เพื่อวัตถุประสงค์ในการให้ข้อมูลเท่านั้น',
    footer_rights: 'สงวนลิขสิทธิ์',
    footer_privacy: 'นโยบายความเป็นส่วนตัว',
    footer_terms: 'ข้อกำหนดการให้บริการ',
    footer_contact: 'ติดต่อฝ่ายสนับสนุน',
    footer_address: '102 ซอยงามดูพลี ถนนพระราม 4 แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ 10120 ประเทศไทย.',
    footer_contact_info: 'โทร. 0-2287-3531-41 โทรสาร. 0-2287-3131',
    intl: 'เที่ยวบินระหว่างประเทศ',
    dom: 'เที่ยวบินภายในประเทศ',
    over: 'เที่ยวบินที่บินผ่านน่านฟ้าของประเทศไทย',
    sch: 'ตามตาราง',
    gen: 'ทั่วไป',
    mil: 'ทหาร',
    nonsch: 'นอกตาราง',
    oth: 'อื่นๆ',
    ifr: 'IFR (เครื่องวัด)',
    vfr: 'VFR (สายตา)'
  },
  en: {
    app_name: 'Aeronautical Radio of Thailand LTD.',
    app_subtitle: 'Flight Data Dashboard',
    nav_overview: 'Overview',
    nav_map: 'Thailand Map',
    nav_airports: 'Airports',
    nav_operations: 'Operations',
    nav_analytics: 'Analytics',
    fiscal_year: 'Fiscal Year',
    updated: 'Updated',
    dashboard_title: 'Flight Operations Overview',
    dashboard_desc: 'Real-time monitoring of Bangkok FIR air traffic volume.',
    month_feb: 'February 2026',
    month_jan: 'January 2026',
    month_dec: 'December 2025',
    month_nov: 'November 2025',
    stat_total_flights: 'Total Flights (Month)',
    stat_avg_flights: 'Avg Flights / Day',
    stat_annual_total: 'Annual Total',
    stat_ifr_dominance: 'IFR Dominance',
    stat_sub_flights: 'Flights in',
    stat_sub_daily: 'Daily operational average',
    stat_sub_cumulative: 'Cumulative fiscal year',
    stat_sub_ifr: 'Instrument Flight Rules',
    chart_monthly_trend: 'Monthly Traffic Trend',
    chart_forecast: 'Monthly Traffic Trend (Forecast)',
    chart_type_dist: 'Flight Type Distribution',
    chart_ops_type: 'Flights Operations by Type',
    airport_network_title: 'Thailand Airport Network (By Authority)',
    airport_network_desc: 'Monitoring hubs across the Kingdom of Thailand.',
    btn_view_all: 'View all airports in Thailand',
    dir_title: 'Airport Directory in control of Airports of Thailand Public Company Limited (AOT)',
    dir_doa_title: 'Airport Directory in control of Department of Airports (DOA)',
    dir_desc: 'Detailed metadata for key aeronautical facilities.',
    dir_doa_desc: 'Detailed metadata for airports under the Department of Airports.',
    dir_army_title: 'Airport Directory in control of Royal Thai Army (RTA)',
    dir_army_desc: 'Detailed information for airports under the Royal Thai Army',
    dir_navy_title: 'Airport Directory in control of Royal Thai Navy (RTN)',
    dir_navy_desc: 'Detailed information for airports under the Royal Thai Navy',
    dir_airforce_title: 'Airport Directory in control of Royal Thai Air Force (RTAF)',
    dir_airforce_desc: 'Detailed information for airports under the Royal Thai Air Force',
    dir_private_title: 'Other / Private Authority Airport Directory',
    dir_private_desc: 'Detailed information for private airports',
    dir_closed_title: 'Closed / Historical Airports',
    dir_closed_desc: 'Airports that are no longer in operation or were active in the past.',
    table_icao: 'ICAO Code',
    table_iata: 'IATA Code',
    table_name: 'Airport Name',
    table_location: 'Location',
    table_owner: 'Owner/Operator',
    table_type: 'Type',
    table_actions: 'Actions',
    table_details: 'Details',
    ops_rule_comp: 'Flight Rule Comparison',
    ops_insights_title: 'Operational Insights',
    ops_insight_1: 'IFR dominance at {val} indicates high reliance on instrument-guided commercial traffic.',
    ops_insight_2: 'International flights account for over half of total volume, highlighting Thailand\'s role as a regional hub.',
    ops_insight_3: 'Military operations maintain a steady presence with over 4,000 monthly movements.',
    sys_status_title: 'System Status',
    sys_status_online: 'Aeronautical Information Service Online',
    sys_disclaimer: 'Data provided by Aeronautical Radio of Thailand Ltd. (AEROTHAI) for informational purposes only.',
    footer_rights: 'All rights reserved.',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_contact: 'Contact Support',
    footer_address: '102 Soi Ngamduplee, Rama IV Road, Khwaeng Thung Maha Mek, Khet Sathon, Bangkok, 10120, Thailand.',
    footer_contact_info: 'Tel. (662) 287-3531-41 Fax. (662) 287-3131',
    intl: 'International Flight',
    dom: 'Domestic Flight',
    over: 'Overfly Flight',
    sch: 'Schedule Flight',
    gen: 'General Flight',
    mil: 'Military Flight',
    nonsch: 'Non-Schedule Flight',
    oth: 'Other Flights',
    ifr: 'IFR (Instrument)',
    vfr: 'VFR (Visual)'
  }
};

// --- Data ---

const FEB_2026_RULES = [
  { name: 'IFR (Instrument)', value: 73808, color: '#0ea5e9' },
  { name: 'VFR (Visual)', value: 7432, color: '#f59e0b' },
];

const JAN_2026_RULES = [
  { name: 'IFR (Instrument)', value: 79546, color: '#0ea5e9' },
  { name: 'VFR (Visual)', value: 7729, color: '#f59e0b' },
];

const DEC_2025_RULES = [
  { name: 'IFR (Instrument)', value: 78531, color: '#0ea5e9' },
  { name: 'VFR (Visual)', value: 6238, color: '#f59e0b' },
];

const NOV_2025_RULES = [
  { name: 'IFR (Instrument)', value: 71458, color: '#0ea5e9' },
  { name: 'VFR (Visual)', value: 6535, color: '#f59e0b' },
];

const FEB_2026_TYPES = [
  { name: 'International', value: 41525, color: '#6366f1' },
  { name: 'Domestic', value: 30458, color: '#10b981' },
  { name: 'Overfly', value: 9257, color: '#8b5cf6' },
];

const JAN_2026_TYPES = [
  { name: 'International', value: 43902, color: '#6366f1' },
  { name: 'Domestic', value: 33487, color: '#10b981' },
  { name: 'Overfly', value: 9886, color: '#8b5cf6' },
];

const DEC_2025_TYPES = [
  { name: 'International', value: 43397, color: '#6366f1' },
  { name: 'Domestic', value: 31761, color: '#10b981' },
  { name: 'Overfly', value: 9611, color: '#8b5cf6' },
];

const NOV_2025_TYPES = [
  { name: 'International', value: 39088, color: '#6366f1' },
  { name: 'Domestic', value: 29443, color: '#10b981' },
  { name: 'Overfly', value: 9462, color: '#8b5cf6' },
];

const FEB_2026_OPS = [
  { name: 'Schedule', value: 67810 },
  { name: 'General', value: 4557 },
  { name: 'Military', value: 4122 },
  { name: 'Non-Schedule', value: 3045 },
  { name: 'Others', value: 1706 },
];

const JAN_2026_OPS = [
  { name: 'Schedule', value: 73596 },
  { name: 'General', value: 4768 },
  { name: 'Military', value: 4099 },
  { name: 'Non-Schedule', value: 3023 },
  { name: 'Others', value: 1789 },
];

const DEC_2025_OPS = [
  { name: 'Schedule', value: 72151 },
  { name: 'General', value: 4029 },
  { name: 'Military', value: 3917 },
  { name: 'Non-Schedule', value: 2877 },
  { name: 'Others', value: 1795 },
];

const NOV_2025_OPS = [
  { name: 'Schedule', value: 65977 },
  { name: 'General', value: 3483 },
  { name: 'Military', value: 4449 },
  { name: 'Non-Schedule', value: 2091 },
  { name: 'Others', value: 1993 },
];

const MONTHLY_TREND_DATA = [
  { month: 'Oct 25', monthTh: 'ต.ค. 68', flights: 78200 },
  { month: 'Nov 25', monthTh: 'พ.ย. 68', flights: 77993 },
  { month: 'Dec 25', monthTh: 'ธ.ค. 68', flights: 84769 },
  { month: 'Jan 26', monthTh: 'ม.ค. 69', flights: 87275 },
  { month: 'Feb 26', monthTh: 'ก.พ. 69', flights: 81240 },
];

const FORECAST_DATA = [
  { month: 'Mar 26', monthTh: 'มี.ค. 69', flights: 83500 },
  { month: 'Apr 26', monthTh: 'เม.ย. 69', flights: 85200 },
  { month: 'May 26', monthTh: 'พ.ค. 69', flights: 82800 },
  { month: 'Jun 26', monthTh: 'มิ.ย. 69', flights: 81500 },
];

interface Airport {
  id: string;
  iata?: string;
  code?: string;
  nameTh: string;
  nameEn: string;
  locationTh: string;
  locationEn?: string;
  lat: number;
  lng: number;
  category: string;
  wikiUrlTh: string;
}

const AIRPORTS: Airport[] = [
  {
    "id": "VTBS",
    "nameTh": "ท่าอากาศยานสุวรรณภูมิ",
    "nameEn": "Suvarnabhumi Airport",
    "locationTh": "สมุทรปราการ",
    "lat": 13.6818767,
    "lng": 100.7485803,
    "category": "AOT",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานสุวรรณภูมิ"
  },
  {
    "id": "VTBD",
    "nameTh": "ท่าอากาศยานดอนเมือง",
    "nameEn": "Don Mueang International Airport",
    "locationTh": "กรุงเทพมหานคร",
    "lat": 13.9122207,
    "lng": 100.6035314,
    "category": "AOT",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานดอนเมือง"
  },
  {
    "id": "VTCC",
    "nameTh": "ท่าอากาศยานเชียงใหม่",
    "nameEn": "Chiang Mai International Airport",
    "locationTh": "เชียงใหม่",
    "lat": 18.7695291,
    "lng": 98.9692713,
    "category": "AOT",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานเชียงใหม่"
  },
  {
    "id": "VTCT",
    "nameTh": "ท่าอากาศยานแม่ฟ้าหลวง เชียงราย",
    "nameEn": "Mae Fah Luang  - Chiang Rai International Airport",
    "locationTh": "เชียงราย",
    "lat": 19.9550586,
    "lng": 99.879221,
    "category": "AOT",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานแม่ฟ้าหลวง_เชียงราย"
  },
  {
    "id": "VTSS",
    "nameTh": "ท่าอากาศยานหาดใหญ่",
    "nameEn": "Hat Yai International Airport",
    "locationTh": "สงขลา",
    "lat": 6.9402579,
    "lng": 100.3854062,
    "category": "AOT",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานหาดใหญ่"
  },
  {
    "id": "VTSG",
    "nameTh": "ท่าอากาศยานนานาชาติกระบี่",
    "nameEn": "Krabi International Airport",
    "locationTh": "กระบี่",
    "lat": 8.10083333,
    "lng": 98.98472222,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติกระบี่"
  },
  {
    "id": "VTUK",
    "nameTh": "ท่าอากาศยานนานาชาติขอนแก่น",
    "nameEn": "Khon Kaen International Airport",
    "locationTh": "ขอนแก่น",
    "lat": 16.46662778,
    "lng": 102.78366111,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติขอนแก่น"
  },
  {
    "id": "VTSE",
    "nameTh": "ท่าอากาศยานชุมพร",
    "nameEn": "Chumphon Airport",
    "locationTh": "ชุมพร",
    "lat": 10.7112,
    "lng": 99.36170556,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานชุมพร"
  },
  {
    "id": "VTST",
    "nameTh": "ท่าอากาศยานตรัง",
    "nameEn": "Trang Airport",
    "locationTh": "ตรัง",
    "lat": 7.508256,
    "lng": 99.6152278,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานตรัง"
  },
  {
    "id": "VTPM",
    "nameTh": "ท่าอากาศยานนานาชาติแม่สอด",
    "nameEn": "Mae Sot International Airport",
    "locationTh": "ตาก",
    "lat": 16.69972222,
    "lng": 98.545,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติแม่สอด"
  },
  {
    "id": "VTUW",
    "nameTh": "ท่าอากาศยานนครพนม",
    "nameEn": "Nakhon Phanom Airport",
    "locationTh": "นครพนม",
    "lat": 17.3831775,
    "lng": 104.6444264,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนครพนม"
  },
  {
    "id": "VTUQ",
    "nameTh": "ท่าอากาศยานนครราชสีมา",
    "nameEn": "Nakhon Ratchasima Airport",
    "locationTh": "นครราชสีมา",
    "lat": 14.9486292,
    "lng": 102.3087089,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนครราชสีมา"
  },
  {
    "id": "VTSF",
    "nameTh": "ท่าอากาศยานนานาชาตินครศรีธรรมราช",
    "nameEn": "Nakhon Si Thammarat International Airport",
    "locationTh": "นครศรีธรรมราช",
    "lat": 8.5361535,
    "lng": 99.9432125,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาตินครศรีธรรมราช"
  },
  {
    "id": "VTSC",
    "nameTh": "ท่าอากาศยานนราธิวาส",
    "nameEn": "Narathiwat Airport",
    "locationTh": "นราธิวาส",
    "lat": 6.5138138,
    "lng": 101.7408213,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนราธิวาส"
  },
  {
    "id": "VTCN",
    "nameTh": "ท่าอากาศยานน่านนคร",
    "nameEn": "Nan Nakhon Airport",
    "locationTh": "น่าน",
    "lat": 18.80777778,
    "lng": 100.78333333,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานน่านนคร"
  },
  {
    "id": "VTUO",
    "nameTh": "ท่าอากาศยานบุรีรัมย์",
    "nameEn": "Buriram Airport",
    "locationTh": "บุรีรัมย์",
    "lat": 15.2251616,
    "lng": 103.2477758,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานบุรีรัมย์"
  },
  {
    "id": "VTPH",
    "nameTh": "ท่าอากาศยานหัวหิน",
    "nameEn": "Hua Hin Airport",
    "locationTh": "ประจวบคีรีขันธ์",
    "lat": 12.6368554,
    "lng": 99.9510278,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานหัวหิน"
  },
  {
    "id": "VTPP",
    "nameTh": "ท่าอากาศยานพิษณุโลก",
    "nameEn": "Phitsanulok Airport",
    "locationTh": "พิษณุโลก",
    "lat": 16.7815939,
    "lng": 100.2746632,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานพิษณุโลก"
  },
  {
    "id": "VTCP",
    "nameTh": "ท่าอากาศยานแพร่",
    "nameEn": "Phrae Airport",
    "locationTh": "แพร่",
    "lat": 18.1317123,
    "lng": 100.1636829,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานแพร่"
  },
  {
    "id": "VTCH",
    "nameTh": "ท่าอากาศยานแม่ฮ่องสอน",
    "nameEn": "Mae Hong Son Airport",
    "locationTh": "แม่ฮ่องสอน",
    "lat": 19.301074,
    "lng": 97.9758393,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานแม่ฮ่องสอน"
  },
  {
    "id": "VTSY",
    "nameTh": "ท่าอากาศยานนานาชาติเบตง",
    "nameEn": "Betong International Airport",
    "locationTh": "ยะลา",
    "lat": 5.789387,
    "lng": 101.1497593,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติเบตง"
  },
  {
    "id": "VTUV",
    "nameTh": "ท่าอากาศยานร้อยเอ็ด",
    "nameEn": "Roi Et Airport",
    "locationTh": "ร้อยเอ็ด",
    "lat": 16.1150394,
    "lng": 103.7748535,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานร้อยเอ็ด"
  },
  {
    "id": "VTSR",
    "nameTh": "ท่าอากาศยานระนอง",
    "nameEn": "Ranong Airport",
    "locationTh": "ระนอง",
    "lat": 9.777307,
    "lng": 98.5863199,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานระนอง"
  },
  {
    "id": "VTUL",
    "nameTh": "ท่าอากาศยานเลย",
    "nameEn": "Loei Airport",
    "locationTh": "เลย",
    "lat": 17.4377964,
    "lng": 101.7213999,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานเลย"
  },
  {
    "id": "VTCL",
    "nameTh": "ท่าอากาศยานลำปาง",
    "nameEn": "Lampang Airport",
    "locationTh": "ลำปาง",
    "lat": 18.2681639,
    "lng": 99.5043039,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานลำปาง"
  },
  {
    "id": "VTUI",
    "nameTh": "ท่าอากาศยานสกลนคร",
    "nameEn": "Sakon Nakhon Airport",
    "locationTh": "สกลนคร",
    "lat": 17.1958129,
    "lng": 104.1182177,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานสกลนคร"
  },
  {
    "id": "VTSB",
    "nameTh": "ท่าอากาศยานนานาชาติสุราษฎร์ธานี",
    "nameEn": "Surat Thani International Airport",
    "locationTh": "สุราษฎร์ธานี",
    "lat": 9.1325,
    "lng": 99.13555556,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติสุราษฎร์ธานี"
  },
  {
    "id": "VTUD",
    "nameTh": "ท่าอากาศยานนานาชาติอุดรธานี",
    "nameEn": "Udon Thani International Airport",
    "locationTh": "อุดรธานี",
    "lat": 17.3856715,
    "lng": 102.7869599,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติอุดรธานี"
  },
  {
    "id": "VTUU",
    "nameTh": "ท่าอากาศยานนานาชาติอุบลราชธานี",
    "nameEn": "Ubon Ratchathani International Airport",
    "locationTh": "อุบลราชธานี",
    "lat": 15.246905,
    "lng": 104.870735,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติอุบลราชธานี"
  },
  {
    "id": "VTBO",
    "nameTh": "ท่าอากาศยานตราด",
    "nameEn": "Trat Airport",
    "locationTh": "ตราด",
    "lat": 12.2808021,
    "lng": 102.3236367,
    "category": "PRIVATE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานตราด"
  },
  {
    "id": "VTBU",
    "nameTh": "ท่าอากาศยานนานาชาติอู่ตะเภา (ระยอง–พัทยา)",
    "nameEn": "U-Tapao International Airport",
    "locationTh": "ระยอง",
    "lat": 12.68,
    "lng": 101.005,
    "category": "NAVY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติอู่ตะเภา_(ระยอง–พัทยา)"
  },
  {
    "id": "VTSM",
    "nameTh": "ท่าอากาศยานนานาชาติสมุย",
    "nameEn": "Samui International Airport",
    "locationTh": "สุราษฎร์ธานี",
    "lat": 9.5488263,
    "lng": 100.0631993,
    "category": "PRIVATE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติสมุย"
  },
  {
    "id": "VTPO",
    "nameTh": "ท่าอากาศยานสุโขทัย",
    "nameEn": "Sukhothai Airport",
    "locationTh": "สุโขทัย",
    "lat": 17.2355871,
    "lng": 99.8215677,
    "category": "PRIVATE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานสุโขทัย"
  },
  {
    "id": "-",
    "nameTh": "สนามบินกาญจนบุรี ค่ายสุรสีห์",
    "nameEn": "สนามบินกาญจนบุรี ค่ายสุรสีห์",
    "locationTh": "กาญจนบุรี",
    "lat": 14.1258614,
    "lng": 99.4469827,
    "category": "ARMY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินกาญจนบุรี_ค่ายสุรสีห์?action=edit&redlink=1"
  },
  {
    "id": "-",
    "nameTh": "สนามบินพระลับ",
    "nameEn": "สนามบินพระลับ",
    "locationTh": "ขอนแก่น",
    "lat": 16.4394252,
    "lng": 102.8379626,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินพระลับ?action=edit&redlink=1"
  },
  {
    "id": "VTBC",
    "nameTh": "สนามบินจันทบุรี",
    "nameEn": "Chanthaburi Airstrip",
    "locationTh": "จันทบุรี",
    "lat": 12.6316279,
    "lng": 102.0254242,
    "category": "NAVY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินจันทบุรี"
  },
  {
    "id": "-",
    "nameTh": "สนามบินชัยภูมิ",
    "nameEn": "สนามบินชัยภูมิ",
    "locationTh": "ชัยภูมิ",
    "lat": 15.7685472,
    "lng": 101.9462291,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินชัยภูมิ?action=edit&redlink=1"
  },
  {
    "id": "-",
    "nameTh": "สนามบินภูเขียว",
    "nameEn": "สนามบินภูเขียว",
    "locationTh": "ชัยภูมิ",
    "lat": 16.3612207,
    "lng": 102.1588262,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินภูเขียว?action=edit&redlink=1"
  },
  {
    "id": "VTCR",
    "nameTh": "สนามบินเชียงราย",
    "nameEn": "Chiang Rai Airport",
    "locationTh": "เชียงราย",
    "lat": 19.8896906,
    "lng": 99.8276212,
    "category": "AIRFORCE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ฐานบินเชียงราย"
  },
  {
    "id": "VTBV",
    "nameTh": "สนามบินเกาะตะเคียน[3]",
    "nameEn": "Koh Takian Airport",
    "locationTh": "ตราด",
    "lat": 12.2542802,
    "lng": 102.5181282,
    "category": "AIRFORCE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินเกาะตะเคียน?action=edit&redlink=1"
  },
  {
    "id": "VTPT",
    "nameTh": "ท่าอากาศยานตาก",
    "nameEn": "Tak Airport",
    "locationTh": "ตาก",
    "lat": 16.8978868,
    "lng": 99.2545255,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานตาก"
  },
  {
    "id": "VTBK",
    "nameTh": "สนามบินกำแพงแสน",
    "nameEn": "Kamphaeng Saen Airport",
    "locationTh": "นครปฐม",
    "lat": 14.1008976,
    "lng": 99.9184437,
    "category": "AIRFORCE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินกำแพงแสน"
  },
  {
    "id": "VTSN",
    "nameTh": "สนามบินชะเอียน",
    "nameEn": "Cha Eian Airport",
    "locationTh": "นครศรีธรรมราช",
    "lat": 8.4701019,
    "lng": 99.9566766,
    "category": "ARMY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินชะเอียน"
  },
  {
    "id": "VTBP",
    "nameTh": "สนามบินประจวบคีรีขันธ์[7]",
    "nameEn": "Prachuap Khiri Khan Military Airport",
    "locationTh": "ประจวบคีรีขันธ์",
    "lat": 12.3894114,
    "lng": 99.9576335,
    "category": "AIRFORCE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินประจวบคีรีขันธ์?action=edit&redlink=1"
  },
  {
    "id": "VTBI",
    "nameTh": "สนามบินปราจีนบุรี",
    "nameEn": "Prachin Buri Airport",
    "locationTh": "ปราจีนบุรี",
    "lat": 14.0203098,
    "lng": 101.7027009,
    "category": "ARMY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินปราจีนบุรี"
  },
  {
    "id": "-",
    "nameTh": "สนามบินกบินทร์บุรี",
    "nameEn": "Kabinburi Airport",
    "locationTh": "ปราจีนบุรี",
    "lat": 14.0203098,
    "lng": 101.7027009,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินกบินทร์บุรี?action=edit&redlink=1"
  },
  {
    "id": "VTSK",
    "nameTh": "ท่าอากาศยานปัตตานี",
    "nameEn": "Pattani Airport",
    "locationTh": "ปัตตานี",
    "lat": 6.7854878,
    "lng": 101.1527689,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานปัตตานี"
  },
  {
    "id": "VTPB",
    "nameTh": "ท่าอากาศยานเพชรบูรณ์",
    "nameEn": "Phetchabun Airport",
    "locationTh": "เพชรบูรณ์",
    "lat": 16.6758588,
    "lng": 101.1905078,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานเพชรบูรณ์"
  },
  {
    "id": "VTCI",
    "nameTh": "ท่าอากาศยานปาย",
    "nameEn": "Pai Airport",
    "locationTh": "แม่ฮ่องสอน",
    "lat": 19.372147,
    "lng": 98.4358962,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานปาย"
  },
  {
    "id": "VTCS",
    "nameTh": "สนามบินแม่สะเรียง",
    "nameEn": "Mae Sariang Airport",
    "locationTh": "แม่ฮ่องสอน",
    "lat": 18.1785145,
    "lng": 97.930412,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินแม่สะเรียง"
  },
  {
    "id": "VTUR",
    "nameTh": "สนามบินรอบเมือง",
    "nameEn": "Rob Mueang Airport",
    "locationTh": "ร้อยเอ็ด",
    "lat": 16.068234,
    "lng": 103.6444632,
    "category": "ARMY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินรอบเมือง?action=edit&redlink=1"
  },
  {
    "id": "-",
    "nameTh": "สนามบินราชบุรี",
    "nameEn": "สนามบินราชบุรี",
    "locationTh": "ราชบุรี",
    "lat": 13.7599119,
    "lng": 100.5238726,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินราชบุรี"
  },
  {
    "id": "-",
    "nameTh": "สนามบินบ้านเชียงเครือ",
    "nameEn": "สนามบินบ้านเชียงเครือ",
    "locationTh": "สกลนคร",
    "lat": 17.295209,
    "lng": 104.1127873,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินบ้านเชียงเครือ?action=edit&redlink=1"
  },
  {
    "id": "VTSH",
    "nameTh": "ท่าอากาศยานสงขลา",
    "nameEn": "Songkhla Airport",
    "locationTh": "สงขลา",
    "lat": 7.1863834,
    "lng": 100.6068419,
    "category": "NAVY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานสงขลา"
  },
  {
    "id": "VTSA",
    "nameTh": "สนามบินควนขัน",
    "nameEn": "Khuan Khan Airport",
    "locationTh": "สตูล",
    "lat": 6.662243,
    "lng": 100.0800349,
    "category": "AIRFORCE",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินควนขัน?action=edit&redlink=1"
  },
  {
    "id": "-",
    "nameTh": "สนามบินสวรรคโลก",
    "nameEn": "สนามบินสวรรคโลก",
    "locationTh": "สุโขทัย",
    "lat": 17.2355871,
    "lng": 99.8215677,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินสวรรคโลก?action=edit&redlink=1"
  },
  {
    "id": "-",
    "nameTh": "สนามบินสุพรรณบุรี",
    "nameEn": "สนามบินสุพรรณบุรี",
    "locationTh": "สุพรรณบุรี",
    "lat": 15.2280823,
    "lng": 103.2478275,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินสุพรรณบุรี?action=edit&redlink=1"
  },
  {
    "id": "VTUJ",
    "nameTh": "ท่าอากาศยานสุรินทร์ภักดี",
    "nameEn": "Surin Bhakdi Airport",
    "locationTh": "สุรินทร์",
    "lat": 14.8668057,
    "lng": 103.4979606,
    "category": "ARMY",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานสุรินทร์ภักดี"
  },
  {
    "id": "-",
    "nameTh": "ท่าอากาศยานนานาชาติบึงกาฬ",
    "nameEn": "Bueng Kan International Airport",
    "locationTh": "บึงกาฬ",
    "lat": 18.33,
    "lng": 103.56194444,
    "category": "DOA",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/ท่าอากาศยานนานาชาติบึงกาฬ"
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ชลบุรี",
    "lat": 13.3662087,
    "lng": 100.9872185,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ชลบุรี",
    "lat": 13.3662087,
    "lng": 100.9872185,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ตาก",
    "lat": 16.8722576,
    "lng": 99.1248355,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ตราด",
    "lat": 12.2440564,
    "lng": 102.5122822,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "พะเยา",
    "lat": 19.1667813,
    "lng": 99.9021075,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ยโสธร",
    "lat": 15.7926751,
    "lng": 104.1452903,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ราชบุรี",
    "lat": 13.539067,
    "lng": 99.8197035,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "",
    "nameTh": "",
    "nameEn": "",
    "locationTh": "ลพบุรี",
    "lat": 14.8023289,
    "lng": 100.6146858,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ลำพูน",
    "lat": 18.5776383,
    "lng": 99.0069034,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ลำพูน",
    "lat": 18.5776383,
    "lng": 99.0069034,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "-",
    "nameTh": "-",
    "nameEn": "-",
    "locationTh": "ลำพูน",
    "lat": 18.5776383,
    "lng": 99.0069034,
    "category": "PRIVATE",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดสุพรรณบุรี",
    "nameTh": "สนามบินจังหวัดสุพรรณบุรี",
    "nameEn": "สนามบินจังหวัดสุพรรณบุรี",
    "locationTh": "สุพรรณบุรี",
    "lat": 15.2280823,
    "lng": 103.2478275,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดสวรรคโลก",
    "nameTh": "สนามบินจังหวัดสวรรคโลก",
    "nameEn": "สนามบินจังหวัดสวรรคโลก",
    "locationTh": "สวรรคโลก",
    "lat": 17.2355871,
    "lng": 99.8215677,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดอุตรดิตถ์",
    "nameTh": "สนามบินจังหวัดอุตรดิตถ์",
    "nameEn": "สนามบินจังหวัดอุตรดิตถ์",
    "locationTh": "อุตรดิตถ์",
    "lat": 17.6735746,
    "lng": 100.2334897,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดชัยภูมิ",
    "nameTh": "สนามบินจังหวัดชัยภูมิ",
    "nameEn": "สนามบินจังหวัดชัยภูมิ",
    "locationTh": "ชัยภูมิ",
    "lat": 15.7685472,
    "lng": 101.9462291,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดพิษณุโลก",
    "nameTh": "สนามบินจังหวัดพิษณุโลก",
    "nameEn": "สนามบินจังหวัดพิษณุโลก",
    "locationTh": "พิษณุโลก",
    "lat": 16.7962228,
    "lng": 100.274489,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดราชบุรี",
    "nameTh": "สนามบินจังหวัดราชบุรี",
    "nameEn": "สนามบินจังหวัดราชบุรี",
    "locationTh": "ราชบุรี",
    "lat": 13.6705751,
    "lng": 99.7326947,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดสุโขทัย",
    "nameTh": "สนามบินจังหวัดสุโขทัย",
    "nameEn": "สนามบินจังหวัดสุโขทัย",
    "locationTh": "สุโขทัย",
    "lat": 17.2355871,
    "lng": 99.8215677,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดเพชรบูรณ์",
    "nameTh": "สนามบินจังหวัดเพชรบูรณ์",
    "nameEn": "สนามบินจังหวัดเพชรบูรณ์",
    "locationTh": "เพชรบูรณ์",
    "lat": 16.8243008,
    "lng": 101.2509995,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดน่าน",
    "nameTh": "สนามบินจังหวัดน่าน",
    "nameEn": "สนามบินจังหวัดน่าน",
    "locationTh": "น่าน",
    "lat": 18.5462625,
    "lng": 99.0119009,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินจังหวัดเพชรบุรี",
    "nameTh": "สนามบินจังหวัดเพชรบุรี",
    "nameEn": "สนามบินจังหวัดเพชรบุรี",
    "locationTh": "เพชรบุรี",
    "lat": 12.6270148,
    "lng": 99.95103,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินหัวหิน",
    "nameTh": "สนามบินหัวหิน",
    "nameEn": "สนามบินหัวหิน",
    "locationTh": "หัวหิน",
    "lat": 12.6270148,
    "lng": 99.95103,
    "category": "CLOSED",
    "wikiUrlTh": null
  },
  {
    "id": "สนามบินน้ำ",
    "nameTh": "สนามบินน้ำ",
    "nameEn": "สนามบินน้ำ",
    "locationTh": "น้ำ",
    "lat": 13.8809656,
    "lng": 100.5005335,
    "category": "CLOSED",
    "wikiUrlTh": "https://th.wikipedia.org/wiki/สนามบินน้ำ?action=edit&redlink=1"
  }
];;

const LOGO_MAP: Record<string, string> = {
  AOT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Airports_of_Thailand_Logo.svg/3840px-Airports_of_Thailand_Logo.svg.png',
  DOA: 'https://www.airports.go.th/backend/uploads/tiny_uploads/โลโก้%20กรมท่าอากาศยาน%20(1)1.png?1712804985393',
  ARMY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Emblem_of_the_Royal_Thai_Army.svg/960px-Emblem_of_the_Royal_Thai_Army.svg.png',
  NAVY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Emblem_of_the_Royal_Thai_Navy.svg/960px-Emblem_of_the_Royal_Thai_Navy.svg.png',
  AIRFORCE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Emblem_of_the_Royal_Thai_Air_Force.svg/3840px-Emblem_of_the_Royal_Thai_Air_Force.svg.png',
  PRIVATE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Bangkok_Airways_Logo.svg/3840px-Bangkok_Airways_Logo.svg.png',
  CLOSED: 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png'
};

const ThailandMap = ({ airports, lang, theme, className, containerClassName }: { airports: any[], lang: string, theme: 'light' | 'dark', className?: string, containerClassName?: string }) => {
  const [selectedAirport, setSelectedAirport] = useState<any>(null);
  const [hoveredAirport, setHoveredAirport] = useState<any>(null);
  const [transformState, setTransformState] = useState({ scale: 1, positionX: 0, positionY: 0 });

  // Simple projection: Thailand bounds roughly 5.5N-20.5N, 97.3E-105.7E
  // We'll map these to a 300x500 SVG
  const mapWidth = 1280;
  const mapHeight = 2200;
  
  const project = (lat: number, lon: number) => {
    // Adjusted projection for the specific image layout
    const x = ((lon - 97) / (106 - 97)) * mapWidth;
    const y = mapHeight - ((lat - 5) / (21 - 5)) * mapHeight;
    return { x, y };
  };

  return (
    <div className={cn(
      "relative w-full h-full flex flex-col rounded-xl overflow-hidden border transition-colors duration-300",
      theme === 'dark' ? "bg-slate-900/50 border-slate-700" : "bg-slate-50/50 border-slate-100",
      containerClassName
    )}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={8}
        centerOnInit={true}
        onTransformed={(ref) => setTransformState(ref.state)}
        onPanning={(ref) => setTransformState(ref.state)}
        onZooming={(ref) => setTransformState(ref.state)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button 
                onClick={() => zoomIn()}
                className={cn(
                  "p-2 backdrop-blur-sm rounded-lg border shadow-sm transition-colors",
                  theme === 'dark' 
                    ? "bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700" 
                    : "bg-white/90 border-slate-200 text-slate-600 hover:bg-white"
                )}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button 
                onClick={() => zoomOut()}
                className={cn(
                  "p-2 backdrop-blur-sm rounded-lg border shadow-sm transition-colors",
                  theme === 'dark' 
                    ? "bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700" 
                    : "bg-white/90 border-slate-200 text-slate-600 hover:bg-white"
                )}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button 
                onClick={() => resetTransform()}
                className={cn(
                  "p-2 backdrop-blur-sm rounded-lg border shadow-sm transition-colors",
                  theme === 'dark' 
                    ? "bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700" 
                    : "bg-white/90 border-slate-200 text-slate-600 hover:bg-white"
                )}
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
              <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
                <div className={cn("relative flex items-center justify-center", className)}>
                  {/* Background Map Image */}
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/BlankMap-Thailand-provinces.svg/1280px-BlankMap-Thailand-provinces.svg.png" 
                    alt="Thailand Map"
                    className={cn(
                      "w-full h-auto object-contain select-none pointer-events-none transition-opacity duration-300 block",
                      theme === 'dark' ? "opacity-40 grayscale invert" : "opacity-80"
                    )}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Interactive Overlay */}
                  <svg 
                    viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {airports.map((airport) => {
                      const { x, y } = project(airport.lat, airport.lon);
                      const isAOT = airport.category === 'AOT';
                      const isARMY = airport.category === 'ARMY';
                      const isNAVY = airport.category === 'NAVY';
                      const isAIRFORCE = airport.category === 'AIRFORCE';
                      const isPRIVATE = airport.category === 'PRIVATE';
                      const isCLOSED = airport.category === 'CLOSED';
                      return (
                        <g 
                          key={airport.code + airport.name} 
                          className="group pointer-events-auto cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAirport(airport);
                          }}
                          onMouseEnter={() => setHoveredAirport(airport)}
                          onMouseLeave={() => setHoveredAirport(null)}
                        >
                          {/* Invisible Hit Area */}
                          <circle cx={x} cy={y} r="20" fill="transparent" />
                          
                          <motion.circle
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            cx={x}
                            cy={y}
                            r="7"
                            className={cn(
                              "stroke-[0.5] shadow-sm transition-all duration-300 group-hover:r-10",
                              isAOT 
                                ? (theme === 'dark' ? "fill-red-500 stroke-slate-900" : "fill-red-600 stroke-white")
                                : isARMY
                                  ? (theme === 'dark' ? "fill-green-700 stroke-slate-900" : "fill-green-800 stroke-white")
                                  : isNAVY
                                    ? (theme === 'dark' ? "fill-blue-600 stroke-slate-900" : "fill-blue-800 stroke-white")
                                    : isAIRFORCE
                                      ? (theme === 'dark' ? "fill-sky-300 stroke-slate-900" : "fill-sky-400 stroke-white")
                                      : isPRIVATE
                                        ? (theme === 'dark' ? "fill-purple-400 stroke-slate-900" : "fill-purple-600 stroke-white")
                                        : isCLOSED
                                          ? (theme === 'dark' ? "fill-stone-600 stroke-slate-900" : "fill-stone-800 stroke-white")
                                          : (theme === 'dark' ? "fill-amber-400 stroke-slate-900" : "fill-amber-600 stroke-white")
                            )}
                          />
                          <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            cx={x}
                            cy={y}
                            r="7"
                            className={isAOT 
                              ? (theme === 'dark' ? "fill-red-500/50" : "fill-red-600/50")
                              : isARMY
                                ? (theme === 'dark' ? "fill-green-700/50" : "fill-green-800/50")
                                : isNAVY
                                  ? (theme === 'dark' ? "fill-blue-600/50" : "fill-blue-800/50")
                                  : isAIRFORCE
                                    ? (theme === 'dark' ? "fill-sky-300/50" : "fill-sky-400/50")
                                    : isPRIVATE
                                      ? (theme === 'dark' ? "fill-purple-400/50" : "fill-purple-400/50")
                                      : isCLOSED
                                        ? (theme === 'dark' ? "fill-stone-600/50" : "fill-stone-800/50")
                                        : (theme === 'dark' ? "fill-amber-400/50" : "fill-amber-400/50")
                            }
                          />
                          <text
                            x={x + 10}
                            y={y + 3}
                            className={cn(
                              "text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-sm",
                              theme === 'dark' ? "fill-slate-200" : "fill-slate-800"
                            )}
                          >
                            {airport.iata} / {airport.code}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <AnimatePresence>
                    {/* Airport Detail Popup - Positioned next to pin */}
                    {selectedAirport && (() => {
                      const { x, y } = project(selectedAirport.lat, selectedAirport.lon);
                      const scale = transformState.scale || 1;
                      const leftSideAirports = ['VTUI', 'VTUW', 'VTUV', 'VTUO', 'VTUU'];
                      const isLeftSide = leftSideAirports.includes(selectedAirport.code);
                      
                      return (
                        <div
                          key="selected-airport-popup"
                          className="absolute z-50 pointer-events-none"
                          style={{
                            left: x,
                            top: y,
                            transform: isLeftSide 
                              ? `translate(calc(-100% - ${20 / scale}px), -50%) scale(${1 / scale})`
                              : `translate(${20 / scale}px, -50%) scale(${1 / scale})`,
                            transformOrigin: isLeftSide ? 'right center' : 'left center'
                          }}
                        >
                        <div className="pointer-events-auto">
                          <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn(
                              "w-96 rounded-xl border shadow-xl overflow-hidden",
                              theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                            )}
                          >
                            {/* Header */}
                            <div className={cn(
                              "p-3 border-b flex items-center justify-between",
                              theme === 'dark' ? "border-slate-700 bg-slate-900/50" : "border-slate-100 bg-slate-50/50"
                            )}>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  selectedAirport.category === 'AOT' ? "bg-red-600" :
                                  selectedAirport.category === 'ARMY' ? "bg-green-800" :
                                  selectedAirport.category === 'NAVY' ? "bg-blue-700" :
                                  selectedAirport.category === 'AIRFORCE' ? "bg-sky-400" :
                                  selectedAirport.category === 'PRIVATE' ? "bg-purple-500" : 
                                  selectedAirport.category === 'CLOSED' ? "bg-stone-800" : "bg-amber-500"
                                )} />
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                                  {selectedAirport.iata} / {selectedAirport.code}
                                </span>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAirport(null);
                                }}
                                className={cn(
                                  "p-1 rounded-full transition-colors",
                                  theme === 'dark' ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                                )}
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <h3 className={cn("text-base font-bold mb-1 leading-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                                    {lang === 'th' ? selectedAirport.nameTh : selectedAirport.name}
                                  </h3>
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <MapPin size={12} />
                                    <span>{lang === 'th' ? selectedAirport.locationTh : selectedAirport.location}</span>
                                  </div>
                                </div>
                                {LOGO_MAP[selectedAirport.category] && (
                                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                    <img 
                                      src={LOGO_MAP[selectedAirport.category]} 
                                      alt={selectedAirport.category} 
                                      className="max-w-full max-h-full object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className={cn("p-2.5 rounded-lg border", theme === 'dark' ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100")}>
                                  <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{lang === 'th' ? 'ประเภท' : 'Type'}</p>
                                  <p className={cn("text-xs font-medium truncate", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>{selectedAirport.type}</p>
                                </div>
                                <div className={cn("p-2.5 rounded-lg border", theme === 'dark' ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100")}>
                                  <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{lang === 'th' ? 'หน่วยงานในสังกัด' : 'Authority'}</p>
                                  <p className={cn("text-xs font-medium truncate", theme === 'dark' ? "text-slate-300" : "text-slate-700")} title={
                                    selectedAirport.category === 'AOT' ? (lang === 'th' ? 'บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)' : 'AOT') :
                                    selectedAirport.category === 'ARMY' ? (lang === 'th' ? 'กองทัพบก' : 'Army') :
                                    selectedAirport.category === 'NAVY' ? (lang === 'th' ? 'กองทัพเรือ' : 'Navy') :
                                    selectedAirport.category === 'AIRFORCE' ? (lang === 'th' ? 'กองทัพอากาศ' : 'Air Force') :
                                    selectedAirport.category === 'PRIVATE' ? (lang === 'th' ? 'หน่วยงานอื่นๆ / รัฐวิสาหกิจ / เอกชน' : 'Private') : 
                                    selectedAirport.category === 'CLOSED' ? (lang === 'th' ? 'ท่าอากาศยานที่เลิกใช้แล้ว' : 'Closed') :
                                    (lang === 'th' ? 'กรมท่าอากาศยาน' : 'DOA')
                                  }>
                                    {selectedAirport.category === 'AOT' ? (lang === 'th' ? 'บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)' : 'AOT') :
                                     selectedAirport.category === 'ARMY' ? (lang === 'th' ? 'กองทัพบก' : 'Army') :
                                     selectedAirport.category === 'NAVY' ? (lang === 'th' ? 'กองทัพเรือ' : 'Navy') :
                                     selectedAirport.category === 'AIRFORCE' ? (lang === 'th' ? 'กองทัพอากาศ' : 'Air Force') :
                                     selectedAirport.category === 'PRIVATE' ? (lang === 'th' ? 'หน่วยงานอื่นๆ / รัฐวิสาหกิจ / เอกชน' : 'Private') : 
                                     selectedAirport.category === 'CLOSED' ? (lang === 'th' ? 'ท่าอากาศยานที่เลิกใช้แล้ว' : 'Closed') :
                                     (lang === 'th' ? 'กรมท่าอากาศยาน' : 'DOA')}
                                  </p>
                                </div>
                                {selectedAirport.owner && (
                                  <div className={cn("p-2.5 rounded-lg border col-span-2", theme === 'dark' ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-100")}>
                                    <p className="text-[9px] uppercase tracking-wider text-slate-500 mb-1">{lang === 'th' ? 'เจ้าของ / หน่วยงาน' : 'Owner / Operator'}</p>
                                    <p className={cn("text-xs font-medium truncate", theme === 'dark' ? "text-slate-300" : "text-slate-700")}>
                                      {lang === 'th' ? selectedAirport.ownerTh : selectedAirport.owner}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <a 
                                href={lang === 'th' ? selectedAirport.wikiUrlTh : selectedAirport.wikiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium transition-colors",
                                  theme === 'dark' 
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white" 
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>{lang === 'th' ? 'ดูข้อมูลเพิ่มเติม' : 'More Info'}</span>
                                <ArrowUpRight size={12} />
                              </a>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Hover Tooltip */}
                  {hoveredAirport && hoveredAirport?.code !== selectedAirport?.code && (() => {
                    const { x, y } = project(hoveredAirport.lat, hoveredAirport.lon);
                    const scale = transformState.scale || 1;
                    const leftSideAirports = ['VTUI', 'VTUW', 'VTUV', 'VTUO', 'VTUU'];
                    const isLeftSide = leftSideAirports.includes(hoveredAirport.code);
                    
                    return (
                      <div
                        className="absolute z-50 pointer-events-none"
                        style={{
                          left: x,
                          top: y,
                          transform: isLeftSide 
                            ? `translate(calc(-100% - ${15 / scale}px), -50%) scale(${1 / scale})`
                            : `translate(${15 / scale}px, -50%) scale(${1 / scale})`,
                          transformOrigin: isLeftSide ? 'right center' : 'left center'
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            "px-3 py-2 rounded-lg border shadow-lg whitespace-nowrap",
                            theme === 'dark' ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              hoveredAirport.category === 'AOT' ? "bg-red-600" :
                              hoveredAirport.category === 'ARMY' ? "bg-green-800" :
                              hoveredAirport.category === 'NAVY' ? "bg-blue-700" :
                              hoveredAirport.category === 'AIRFORCE' ? "bg-sky-400" :
                              hoveredAirport.category === 'PRIVATE' ? "bg-purple-500" : "bg-amber-500"
                            )} />
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                              {hoveredAirport.iata} / {hoveredAirport.code}
                            </span>
                          </div>
                          <p className="text-sm font-semibold">
                            {lang === 'th' ? hoveredAirport.nameTh : hoveredAirport.name}
                          </p>
                          <p className="text-[10px] opacity-70 mt-0.5">
                            {lang === 'th' ? hoveredAirport.locationTh : hoveredAirport.location}
                          </p>
                        </motion.div>
                      </div>
                    );
                  })()}
                  </AnimatePresence>
                </div>
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>
      
      {/* Legend */}
      <div className={cn(
        "absolute bottom-4 left-4 backdrop-blur-sm p-2 rounded-lg border text-[10px] space-y-2 shadow-sm z-10 transition-colors",
        theme === 'dark' ? "bg-slate-800/90 border-slate-700" : "bg-white/90 border-slate-200"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)' : 'Airports of Thailand (AOT)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'กรมท่าอากาศยาน' : 'Department of Airports (DOA)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-800" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'กองทัพบก' : 'Royal Thai Army'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-700" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'กองทัพเรือ' : 'Royal Thai Navy'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'กองทัพอากาศ' : 'Royal Thai Air Force'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'เอกชน' : 'Private'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-stone-800" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'ท่าอากาศยานที่เลิกใช้แล้ว' : 'Historical / Closed'}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const StatCard = ({ title, value, subValue, icon: Icon, trend, theme }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "p-6 rounded-2xl border transition-all duration-300",
      theme === 'dark' 
        ? "bg-slate-800 border-slate-700 shadow-none" 
        : "bg-white border-slate-200 shadow-sm hover:shadow-md"
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn(
        "p-2 rounded-lg",
        theme === 'dark' ? "bg-slate-700 text-slate-300" : "bg-slate-50 text-slate-600"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
          trend > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
          <ArrowUpRight className={cn("w-3 h-3", trend < 0 && "rotate-90")} />
        </span>
      )}
    </div>
    <div>
      <p className={cn(
        "text-sm font-medium uppercase tracking-wider",
        theme === 'dark' ? "text-slate-400" : "text-slate-500"
      )}>{title}</p>
      <h3 className={cn(
        "text-2xl md:text-3xl font-bold mt-1",
        theme === 'dark' ? "text-white" : "text-slate-900"
      )}>{value}</h3>
      {subValue && <p className={cn(
        "text-sm mt-1",
        theme === 'dark' ? "text-slate-500" : "text-slate-400"
      )}>{subValue}</p>}
    </div>
  </motion.div>
);

const ChartContainer = ({ title, children, icon: Icon, theme }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      "p-6 rounded-2xl border flex flex-col h-full transition-all duration-300",
      theme === 'dark' 
        ? "bg-slate-800 border-slate-700 shadow-none" 
        : "bg-white border-slate-200 shadow-sm"
    )}
  >
    <div className="flex items-center gap-2 mb-6">
      <div className={cn(
        "p-1.5 rounded-md",
        theme === 'dark' ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <h4 className={cn(
        "font-semibold",
        theme === 'dark' ? "text-slate-200" : "text-slate-800"
      )}>{title}</h4>
    </div>
    <div className="flex-1 min-h-[300px]">
      {children}
    </div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('Feb 26');
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const t = TRANSLATIONS[lang];

  const DIRECTORY_SECTIONS = [
    { id: 'AOT', titleKey: 'dir_title', descKey: 'dir_desc', logo: LOGO_MAP.AOT, color: 'indigo' },
    { id: 'DOA', titleKey: 'dir_doa_title', descKey: 'dir_doa_desc', logo: LOGO_MAP.DOA, color: 'amber' },
    { id: 'ARMY', titleKey: 'dir_army_title', descKey: 'dir_army_desc', logo: LOGO_MAP.ARMY, color: 'red' },
    { id: 'NAVY', titleKey: 'dir_navy_title', descKey: 'dir_navy_desc', logo: LOGO_MAP.NAVY, color: 'blue' },
    { id: 'AIRFORCE', titleKey: 'dir_airforce_title', descKey: 'dir_airforce_desc', logo: LOGO_MAP.AIRFORCE, color: 'sky' },
    { id: 'PRIVATE', titleKey: 'dir_private_title', descKey: 'dir_private_desc', logo: LOGO_MAP.PRIVATE, color: 'purple' },
    { id: 'CLOSED', titleKey: 'dir_closed_title', descKey: 'dir_closed_desc', logo: LOGO_MAP.CLOSED, color: 'stone' },
  ];

  const isFeb = selectedMonth === 'Feb 26';
  const isJan = selectedMonth === 'Jan 26';
  const isDec = selectedMonth === 'Dec 25';
  const isNov = selectedMonth === 'Nov 25';
  
  // Localized data
  const currentRules = (isFeb ? FEB_2026_RULES : isJan ? JAN_2026_RULES : isDec ? DEC_2025_RULES : NOV_2025_RULES).map(r => ({
    ...r,
    name: r.name.includes('IFR') ? t.ifr : t.vfr
  }));

  const currentTypes = (isFeb ? FEB_2026_TYPES : isJan ? JAN_2026_TYPES : isDec ? DEC_2025_TYPES : NOV_2025_TYPES).map(t_item => ({
    ...t_item,
    name: t_item.name === 'International' ? t.intl : t_item.name === 'Domestic' ? t.dom : t.over
  }));

  const currentOps = (isFeb ? FEB_2026_OPS : isJan ? JAN_2026_OPS : isDec ? DEC_2025_OPS : NOV_2025_OPS).map(o => {
    let name = o.name === 'Schedule' ? t.sch : o.name === 'General' ? t.gen : o.name === 'Military' ? t.mil : o.name === 'Non-Schedule' ? t.nonsch : t.oth;
    if (lang === 'th') {
      if (o.name === 'Military') {
        name = `เที่ยวบินทางทหาร`;
      } else {
        name = `เที่ยวบิน${name}`;
      }
    }
    return { ...o, name };
  });

  let totalVal, avgVal, annualVal, ifrVal, trendVal, monthLabel;

  if (isFeb) {
    totalVal = "81,240";
    avgVal = "2,700";
    annualVal = "407,774";
    ifrVal = "90.8%";
    trendVal = 11.39;
    monthLabel = t.month_feb;
  } else if (isJan) {
    totalVal = "87,275";
    avgVal = "2,654";
    annualVal = "326,534";
    ifrVal = "91.1%";
    trendVal = 8.09;
    monthLabel = t.month_jan;
  } else if (isDec) {
    totalVal = "84,769";
    avgVal = "2,734";
    annualVal = "239,259";
    ifrVal = "92.6%";
    trendVal = 10.98;
    monthLabel = t.month_dec;
  } else {
    totalVal = "77,993";
    avgVal = "2,600";
    annualVal = "154,490";
    ifrVal = "91.6%";
    trendVal = 15.75;
    monthLabel = t.month_nov;
  }

  const totalFlights = totalVal + (lang === 'th' ? ' เที่ยวบิน' : ' Flights');
  const avgFlights = avgVal + (lang === 'th' ? ' เที่ยวบิน' : ' Flights');
  const ifrDominance = ifrVal;
  const annualTotal = annualVal + (lang === 'th' ? ' เที่ยวบิน' : ' Flights');

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans",
      theme === 'dark' ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar / Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 h-16 border-b z-50 px-6 flex items-center justify-between transition-colors duration-300",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="https://datagov.mot.go.th/uploads/group/2021-06-07-064850.895096aaaaaa.png" 
              alt="AEROTHAI Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className={cn(
              "text-xl font-bold tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{t.app_name}</h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] -mt-1">{t.app_subtitle}</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: 'overview', label: t.nav_overview },
            { id: 'map', label: t.nav_map },
            { id: 'airports', label: t.nav_airports },
            { id: 'operations', label: t.nav_operations },
            { id: 'analytics', label: t.nav_analytics }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "text-sm font-medium transition-colors relative py-5",
                activeTab === tab.id 
                  ? "text-indigo-500" 
                  : theme === 'dark' ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === 'dark' ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className={cn(
            "flex items-center rounded-lg p-1",
            theme === 'dark' ? "bg-slate-800" : "bg-slate-100"
          )}>
            <button 
              onClick={() => setLang('th')}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                lang === 'th' 
                  ? (theme === 'dark' ? "bg-slate-700 text-indigo-400 shadow-sm" : "bg-white text-indigo-600 shadow-sm")
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              TH
            </button>
            <button 
              onClick={() => setLang('en')}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-md transition-all",
                lang === 'en' 
                  ? (theme === 'dark' ? "bg-slate-700 text-indigo-400 shadow-sm" : "bg-white text-indigo-600 shadow-sm")
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              EN
            </button>
          </div>
          <div className="text-right hidden sm:block">
            <p className={cn("text-xs font-medium", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{t.fiscal_year} 2026</p>
            <p className="text-[10px] text-slate-400">{t.updated}: Mar 07, 2026</p>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center",
            theme === 'dark' ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"
          )}>
            <Info className="w-4 h-4" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 mx-auto",
        activeTab === 'map' 
          ? "pt-20 px-0 pb-0 max-w-full min-h-screen" 
          : "pt-24 px-6 pb-12 max-w-7xl"
      )}>
        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen"
            >
              <div className={cn(
                "w-full min-h-screen flex flex-col",
                theme === 'dark' ? "bg-slate-900" : "bg-slate-50"
              )}>
                <div className={cn(
                  "absolute top-24 left-6 z-10 flex items-center gap-2 backdrop-blur-md p-2 rounded-lg border shadow-sm transition-colors",
                  theme === 'dark' ? "bg-slate-800/80 border-slate-700" : "bg-white/80 border-slate-200"
                )}>
                  <div className={cn(
                    "p-1.5 rounded-md",
                    theme === 'dark' ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <MapIcon className="w-4 h-4" />
                  </div>
                  <h4 className={cn(
                    "font-semibold",
                    theme === 'dark' ? "text-slate-200" : "text-slate-800"
                  )}>{t.airport_network_title}</h4>
                </div>
                <div className="flex-1">
                  <ThailandMap 
                    airports={AIRPORTS} 
                    lang={lang} 
                    theme={theme} 
                    className="max-h-none aspect-auto" 
                    containerClassName="rounded-none border-0 bg-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className={cn("text-2xl md:text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.dashboard_title}</h2>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{t.dashboard_desc}</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={cn(
                      "px-4 py-2 border rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    <option value="Feb 26">{t.month_feb}</option>
                    <option value="Jan 26">{t.month_jan}</option>
                    <option value="Dec 25">{t.month_dec}</option>
                    <option value="Nov 25">{t.month_nov}</option>
                  </select>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title={t.stat_total_flights} 
                  value={totalFlights} 
                  subValue={`${t.stat_sub_flights} ${monthLabel}`}
                  icon={Activity}
                  trend={trendVal}
                  theme={theme}
                />
                <StatCard 
                  title={t.stat_avg_flights} 
                  value={avgFlights} 
                  subValue={t.stat_sub_daily}
                  icon={Navigation}
                  theme={theme}
                />
                <StatCard 
                  title={t.stat_annual_total} 
                  value={annualTotal} 
                  subValue={t.stat_sub_cumulative}
                  icon={Globe}
                  trend={4.2}
                  theme={theme}
                />
                <StatCard 
                  title={t.stat_ifr_dominance} 
                  value={ifrDominance} 
                  subValue={t.stat_sub_ifr}
                  icon={Shield}
                  theme={theme}
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChartContainer title={t.chart_monthly_trend} icon={BarChart3} theme={theme}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MONTHLY_TREND_DATA}>
                        <defs>
                          <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                        <XAxis 
                          dataKey={lang === 'th' ? 'monthTh' : 'month'} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                          }}
                          itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                          formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="flights" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorFlights)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <ChartContainer title={t.airport_network_title} icon={MapPin} theme={theme}>
                  <ThailandMap airports={AIRPORTS} lang={lang} theme={theme} />
                </ChartContainer>
              </div>

              {/* Distribution & Forecast Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title={t.chart_forecast} icon={BarChart3} theme={theme}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={FORECAST_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                      <XAxis 
                        dataKey={lang === 'th' ? 'monthTh' : 'month'} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                        }}
                        itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                        formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="flights" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: theme === 'dark' ? '#1e293b' : '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className={cn(
                  "rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-300 border",
                  theme === 'dark' 
                    ? "bg-slate-800 border-slate-700" 
                    : "bg-white border-slate-200 shadow-sm"
                )}>
                  <div className="relative z-10">
                    <h3 className={cn(
                      "text-2xl font-bold mb-2", 
                      theme === 'dark' ? "text-white" : "text-slate-900"
                    )}>{t.airport_network_title}</h3>
                    <p className={cn(
                      "text-sm max-w-xs", 
                      theme === 'dark' ? "text-slate-400" : "text-slate-500"
                    )}>{t.airport_network_desc}</p>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* AOT Column */}
                      <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>
                          {lang === 'th' ? 'บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)' : 'Airports of Thailand (AOT)'}
                        </h4>
                        {AIRPORTS.filter(a => a.category === 'AOT').slice(0, 3).map((airport) => (
                          <a 
                            key={airport.id} 
                            href={airport.wikiUrlTh}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                theme === 'dark' ? "bg-slate-700 group-hover:bg-red-600" : "bg-slate-100 group-hover:bg-red-600"
                              )}>
                                <MapPin className={cn(
                                  "w-4 h-4 transition-colors",
                                  theme === 'dark' ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-white"
                                )} />
                              </div>
                              <div>
                                <p className={cn(
                                  "text-sm font-semibold transition-colors", 
                                  theme === 'dark' ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-red-600"
                                )}>{lang === 'th' ? airport.nameTh : airport.nameEn}</p>
                                <p className="text-[10px] text-slate-500">{airport.iata || '-'} / {airport.code || '-'} • {lang === 'th' ? airport.locationTh : airport.locationEn}</p>
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-colors", 
                              theme === 'dark' ? "text-slate-600 group-hover:text-white" : "text-slate-400 group-hover:text-red-600"
                            )} />
                          </a>
                        ))}
                      </div>

                      {/* DOA Column */}
                      <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>
                          {lang === 'th' ? 'กรมท่าอากาศยาน' : 'Department of Airports (DOA)'}
                        </h4>
                        {AIRPORTS.filter(a => a.category === 'DOA').slice(0, 3).map((airport) => (
                          <a 
                            key={airport.id} 
                            href={airport.wikiUrlTh}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                theme === 'dark' ? "bg-slate-700 group-hover:bg-amber-500" : "bg-slate-100 group-hover:bg-amber-500"
                              )}>
                                <MapPin className={cn(
                                  "w-4 h-4 transition-colors",
                                  theme === 'dark' ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-white"
                                )} />
                              </div>
                              <div>
                                <p className={cn(
                                  "text-sm font-semibold transition-colors", 
                                  theme === 'dark' ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-amber-600"
                                )}>{lang === 'th' ? airport.nameTh : airport.nameEn}</p>
                                <p className="text-[10px] text-slate-500">{airport.iata || '-'} / {airport.code || '-'} • {lang === 'th' ? airport.locationTh : airport.locationEn}</p>
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-colors", 
                              theme === 'dark' ? "text-slate-600 group-hover:text-white" : "text-slate-400 group-hover:text-amber-600"
                            )} />
                          </a>
                        ))}
                      </div>

                      {/* Other Agencies Column */}
                      <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>
                          {lang === 'th' ? 'หน่วยงานอื่นๆ' : 'OTHERS AUTHORITY'}
                        </h4>
                        {[
                          AIRPORTS.find(a => a.category === 'NAVY'),
                          AIRPORTS.find(a => a.category === 'ARMY'),
                          AIRPORTS.find(a => a.category === 'AIRFORCE'),
                          AIRPORTS.find(a => a.category === 'PRIVATE'),
                          AIRPORTS.find(a => a.category === 'CLOSED')
                        ].filter(Boolean).slice(0, 4).map((airport: any) => {
                          const isArmy = airport.category === 'ARMY';
                          const isNavy = airport.category === 'NAVY';
                          const isAirForce = airport.category === 'AIRFORCE';
                          const isPrivate = airport.category === 'PRIVATE';
                          const isClosed = airport.category === 'CLOSED';
                          
                          let hoverColorClass = "group-hover:bg-slate-500";
                          let textColorClass = "group-hover:text-slate-600";
                          
                          if (isArmy) {
                            hoverColorClass = "group-hover:bg-red-800";
                            textColorClass = "group-hover:text-red-800";
                          } else if (isNavy) {
                            hoverColorClass = "group-hover:bg-blue-600";
                            textColorClass = "group-hover:text-blue-700";
                          } else if (isAirForce) {
                            hoverColorClass = "group-hover:bg-sky-300";
                            textColorClass = "group-hover:text-sky-500";
                          } else if (isPrivate) {
                            hoverColorClass = "group-hover:bg-purple-500";
                            textColorClass = "group-hover:text-purple-600";
                          } else if (isClosed) {
                            hoverColorClass = "group-hover:bg-stone-500";
                            textColorClass = "group-hover:text-stone-600";
                          }

                          return (
                            <a 
                              key={airport.id} 
                              href={airport.wikiUrlTh}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                  theme === 'dark' ? `bg-slate-700 ${hoverColorClass}` : `bg-slate-100 ${hoverColorClass}`
                                )}>
                                  <MapPin className={cn(
                                    "w-4 h-4 transition-colors",
                                    theme === 'dark' ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-white"
                                  )} />
                                </div>
                                <div>
                                  <p className={cn(
                                    "text-sm font-semibold transition-colors", 
                                    theme === 'dark' ? "text-slate-200 group-hover:text-white" : `text-slate-800 ${textColorClass}`
                                  )}>{lang === 'th' ? airport.nameTh : airport.nameEn}</p>
                                  <p className="text-[10px] text-slate-500">{airport.iata || '-'} / {airport.code || '-'} • {lang === 'th' ? airport.locationTh : airport.locationEn}</p>
                                </div>
                              </div>
                              <ChevronRight className={cn(
                                "w-4 h-4 transition-colors", 
                                theme === 'dark' ? "text-slate-600 group-hover:text-white" : `text-slate-400 ${textColorClass}`
                              )} />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('airports')}
                    className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-sm transition-colors relative z-10 text-white shadow-lg shadow-indigo-500/20"
                  >
                    {t.btn_view_all}
                  </button>

                  {/* Decorative element */}
                  <div className={cn(
                    "absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl",
                    theme === 'dark' ? "bg-indigo-500/10" : "bg-indigo-500/5"
                  )} />
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title={t.chart_ops_type} icon={Navigation} theme={theme}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentOps} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false}
                        width={140}
                        tick={{ fill: theme === 'dark' ? '#94a3b8' : '#475569', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ fill: theme === 'dark' ? '#334155' : '#f8fafc' }}
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                        }}
                        itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                        formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title={t.chart_type_dist} icon={PieChartIcon} theme={theme}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {currentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                        }}
                        itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                        formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={60} 
                        iconType="circle"
                        formatter={(value: any) => <span style={{ color: theme === 'dark' ? '#94a3b8' : '#475569' }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </motion.div>
          )}

          {activeTab === 'airports' && (
            <motion.div 
              key="airports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {DIRECTORY_SECTIONS.map((section) => {
                const sectionAirports = AIRPORTS.filter(a => a.category === section.id);
                if (sectionAirports.length === 0) return null;

                return (
                  <div key={section.id} className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          {section.logo && (
                            <img 
                              src={section.logo} 
                              alt={`${section.id} Logo`} 
                              className="h-12 w-auto object-contain"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <h2 className={cn("text-2xl md:text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>
                            {(t as any)[section.titleKey]}
                          </h2>
                        </div>
                        <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>
                          {(t as any)[section.descKey]}
                        </p>
                      </div>
                    </div>

                    <div className={cn(
                      "rounded-2xl border overflow-hidden transition-all duration-300",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white border-slate-200 shadow-sm"
                    )}>
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={cn(
                            "border-b transition-colors",
                            theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
                          )}>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.table_iata}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.table_icao}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.table_name}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.table_location}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.table_type}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">{t.table_actions}</th>
                          </tr>
                        </thead>
                        <tbody className={cn("divide-y", theme === 'dark' ? "divide-slate-700" : "divide-slate-100")}>
                          {sectionAirports.map((airport) => (
                            <tr key={airport.id} className={cn(
                              "transition-colors group",
                              theme === 'dark' ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                            )}>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                                  theme === 'dark' ? "text-slate-300 bg-slate-700" : "text-slate-600 bg-slate-100"
                                )}>
                                  {airport.iata || '-'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                                  section.color === 'indigo' ? (theme === 'dark' ? "text-indigo-400 bg-indigo-500/10" : "text-indigo-600 bg-indigo-50") :
                                  section.color === 'amber' ? (theme === 'dark' ? "text-amber-400 bg-amber-500/10" : "text-amber-600 bg-amber-50") :
                                  section.color === 'red' ? (theme === 'dark' ? "text-red-400 bg-red-500/10" : "text-red-600 bg-red-50") :
                                  section.color === 'blue' ? (theme === 'dark' ? "text-blue-400 bg-blue-500/10" : "text-blue-600 bg-blue-50") :
                                  section.color === 'sky' ? (theme === 'dark' ? "text-sky-400 bg-sky-500/10" : "text-sky-600 bg-sky-50") :
                                  section.color === 'purple' ? (theme === 'dark' ? "text-purple-400 bg-purple-500/10" : "text-purple-600 bg-purple-50") :
                                  (theme === 'dark' ? "text-stone-400 bg-stone-500/10" : "text-stone-600 bg-stone-50")
                                )}>
                                  {airport.code || '-'}
                                </span>
                              </td>
                              <td className={cn("px-6 py-4 font-medium transition-colors", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{lang === 'th' ? airport.nameTh : airport.nameEn}</td>
                              <td className={cn("px-6 py-4 text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{lang === 'th' ? airport.locationTh : airport.locationEn}</td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "text-xs font-medium px-2 py-1 rounded-full transition-colors",
                                  theme === 'dark' ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600"
                                )}>
                                  {airport.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {airport.wikiUrlTh ? (
                                  <a 
                                    href={airport.wikiUrlTh} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={cn(
                                      "font-semibold text-sm transition-colors",
                                      section.color === 'indigo' ? (theme === 'dark' ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800") :
                                      section.color === 'amber' ? (theme === 'dark' ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-800") :
                                      section.color === 'red' ? (theme === 'dark' ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800") :
                                      section.color === 'blue' ? (theme === 'dark' ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800") :
                                      section.color === 'sky' ? (theme === 'dark' ? "text-sky-400 hover:text-sky-300" : "text-sky-600 hover:text-sky-800") :
                                      section.color === 'purple' ? (theme === 'dark' ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800") :
                                      (theme === 'dark' ? "text-stone-400 hover:text-stone-300" : "text-stone-600 hover:text-stone-800")
                                    )}
                                  >
                                    {t.table_details}
                                  </a>
                                ) : (
                                  <span className="text-slate-400 text-sm">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Redundant sections removed */}
            </motion.div>
          )}

          {activeTab === 'operations' && (
            <motion.div 
              key="operations"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header with Month Selection */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className={cn("text-2xl md:text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.nav_operations}</h2>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{t.ops_insights_title}</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={cn(
                      "px-4 py-2 border rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    <option value="Feb 26">{t.month_feb}</option>
                    <option value="Jan 26">{t.month_jan}</option>
                    <option value="Dec 25">{t.month_dec}</option>
                    <option value="Nov 25">{t.month_nov}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ChartContainer title={t.ops_rule_comp} icon={Shield} theme={theme}>
                <div className="h-full flex flex-col">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={currentRules}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {currentRules.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                        }}
                        itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                        formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {currentRules.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={cn("transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>{item.name}</span>
                        </div>
                        <span className={cn("font-bold transition-colors", theme === 'dark' ? "text-white" : "text-slate-900")}>{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartContainer>

              <div className="space-y-6">
                <div className={cn(
                  "p-6 rounded-2xl border transition-all duration-300",
                  theme === 'dark' ? "bg-slate-800 border-slate-700 shadow-none" : "bg-white border-slate-200 shadow-sm"
                )}>
                  <h4 className={cn("font-bold mb-4 flex items-center gap-2 transition-colors", theme === 'dark' ? "text-white" : "text-slate-900")}>
                    <Info className={cn("w-4 h-4", theme === 'dark' ? "text-indigo-400" : "text-indigo-600")} />
                    {t.ops_insights_title}
                  </h4>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", theme === 'dark' ? "bg-indigo-400" : "bg-indigo-600")} />
                      <p className={cn("text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                        {t.ops_insight_1.replace('{val}', ifrDominance)}
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", theme === 'dark' ? "bg-emerald-400" : "bg-emerald-600")} />
                      <p className={cn("text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                        {t.ops_insight_2}
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", theme === 'dark' ? "bg-amber-400" : "bg-amber-600")} />
                      <p className={cn("text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                        {t.ops_insight_3}
                      </p>
                    </li>
                  </ul>
                </div>

                <div className={cn(
                  "p-6 rounded-2xl border transition-all duration-300",
                  theme === 'dark' ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-50 border-indigo-100"
                )}>
                  <h4 className={cn("font-bold mb-2 transition-colors", theme === 'dark' ? "text-indigo-400" : "text-indigo-900")}>{t.sys_status_title}</h4>
                  <div className={cn("flex items-center gap-2 text-sm font-medium transition-colors", theme === 'dark' ? "text-indigo-300" : "text-indigo-700")}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t.sys_status_online}
                  </div>
                  <p className={cn("text-xs mt-4 transition-colors", theme === 'dark' ? "text-indigo-400/60" : "text-indigo-600/70")}>
                    {t.sys_disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header with Month Selection */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className={cn("text-2xl md:text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.nav_analytics}</h2>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{t.dashboard_desc}</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={cn(
                      "px-4 py-2 border rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors",
                      theme === 'dark' ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    <option value="Feb 26">{t.month_feb}</option>
                    <option value="Jan 26">{t.month_jan}</option>
                    <option value="Dec 25">{t.month_dec}</option>
                    <option value="Nov 25">{t.month_nov}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. การจราจรรายเดือน */}
                <ChartContainer title={t.chart_monthly_trend} icon={BarChart3} theme={theme}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MONTHLY_TREND_DATA}>
                        <defs>
                          <linearGradient id="colorFlightsAnalytics" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                        <XAxis 
                          dataKey={lang === 'th' ? 'monthTh' : 'month'} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                          }}
                          itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                          formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="flights" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorFlightsAnalytics)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>

                {/* 2. แนวโน้มการจราจรรายเดือน (คาดการณ์) */}
                <ChartContainer title={t.chart_forecast} icon={BarChart3} theme={theme}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={FORECAST_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                        <XAxis 
                          dataKey={lang === 'th' ? 'monthTh' : 'month'} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                          }}
                          itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                          formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="flights" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: theme === 'dark' ? '#1e293b' : '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>

                {/* 3. การดำเนินงานแยกตามประเภท */}
                <ChartContainer title={t.chart_ops_type} icon={Navigation} theme={theme}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentOps} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false}
                          width={140}
                          tick={{ fill: theme === 'dark' ? '#94a3b8' : '#475569', fontSize: 12 }}
                        />
                        <Tooltip 
                          cursor={{ fill: theme === 'dark' ? '#334155' : '#f8fafc' }}
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                          }}
                          itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                          formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                        />
                        <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>

                {/* 4. สัดส่วนประเภทเที่ยวบิน */}
                <ChartContainer title={t.chart_type_dist} icon={PieChartIcon} theme={theme}>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {currentTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: theme === 'dark' ? '#f1f5f9' : '#1e293b'
                          }}
                          itemStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                          formatter={(value: any) => [`${value.toLocaleString()} ${lang === 'th' ? 'เที่ยวบิน' : 'Flights'}`, '']}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={60} 
                          iconType="circle"
                          formatter={(value: any) => <span style={{ color: theme === 'dark' ? '#94a3b8' : '#475569' }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={cn(
        "border-t py-12 px-6 transition-all duration-300",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className={cn(
                "flex items-center gap-2 transition-all duration-300",
                theme === 'dark' ? "opacity-80" : "grayscale opacity-50"
              )}>
                <img 
                  src="https://datagov.mot.go.th/uploads/group/2021-06-07-064850.895096aaaaaa.png" 
                  alt="AEROTHAI Logo" 
                  className="w-8 h-8 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className={cn("font-bold text-sm tracking-tighter", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.app_name}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                {t.footer_address}
              </p>
              <p className="text-xs text-slate-400">
                {t.footer_contact_info}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-start">
              <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-2", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>Quick Links</h4>
              {[
                { id: 'overview', label: t.nav_overview },
                { id: 'map', label: t.nav_map },
                { id: 'airports', label: t.nav_airports },
                { id: 'operations', label: t.nav_operations },
                { id: 'analytics', label: t.nav_analytics }
              ].map((link) => (
                <button 
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-slate-400 hover:text-indigo-500 transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-2", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>Legal</h4>
              <a href="#" className="text-xs text-slate-400 hover:text-indigo-500 transition-colors">{t.footer_privacy}</a>
              <a href="#" className="text-xs text-slate-400 hover:text-indigo-500 transition-colors">{t.footer_terms}</a>
              <a href="#" className="text-xs text-slate-400 hover:text-indigo-500 transition-colors">{t.footer_contact}</a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200/10 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 Aeronautical Radio of Thailand Ltd. {t.footer_rights}</p>
            <div className="flex gap-6">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{t.sys_status_online}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
