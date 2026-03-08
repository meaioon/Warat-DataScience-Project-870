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
  Moon
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
    airport_network_desc: 'การตรวจสอบศูนย์กลางการบินหลักทั่วราชอาณาจักรไทย',
    btn_view_all: 'ดูท่าอากาศยานทั้งหมด',
    dir_title: 'รายชื่อท่าอากาศยานในสังกัดของ บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)',
    dir_doa_title: 'รายชื่อท่าอากาศยานในสังกัดของ กรมท่าอากาศยาน',
    dir_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัดของ บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)',
    dir_doa_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัด กรมท่าอากาศยาน',
    dir_army_title: 'รายชื่อท่าอากาศยานในสังกัดของ กองทัพบก',
    dir_army_desc: 'ข้อมูลรายละเอียดสำหรับท่าอากาศยานในสังกัด กองทัพบก',
    table_icao: 'รหัส ICAO',
    table_iata: 'รหัส IATA',
    table_name: 'ชื่อท่าอากาศยาน',
    table_location: 'จังหวัด',
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
    airport_network_title: 'Thailand Airport Network (by Authority)',
    airport_network_desc: 'Monitoring major hubs across the Kingdom of Thailand.',
    btn_view_all: 'View All Airports',
    dir_title: 'Airport Directory in control of Airports of Thailand Public Company Limited (AOT)',
    dir_doa_title: 'Airport Directory in control of Department of Airports (DOA)',
    dir_desc: 'Detailed metadata for key aeronautical facilities.',
    dir_doa_desc: 'Detailed metadata for airports under the Department of Airports.',
    dir_army_title: 'Royal Thai Army Airport Directory',
    dir_army_desc: 'Detailed information for airports under the Royal Thai Army',
    table_icao: 'ICAO Code',
    table_iata: 'IATA Code',
    table_name: 'Airport Name',
    table_location: 'Location',
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

const AIRPORTS = [
  { 
    code: 'VTBS', 
    iata: 'BKK', 
    name: 'Suvarnabhumi Airport', 
    nameTh: 'ท่าอากาศยานสุวรรณภูมิ', 
    location: 'Samut Prakan', 
    locationTh: 'สมุทรปราการ', 
    type: 'International', 
    lat: 13.69, 
    lon: 100.75,
    category: 'AOT',
    wikiUrl: 'https://en.wikipedia.org/wiki/Suvarnabhumi_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานสุวรรณภูมิ'
  },
  { 
    code: 'VTBD', 
    iata: 'DMK', 
    name: 'Don Mueang International Airport', 
    nameTh: 'ท่าอากาศยานดอนเมือง', 
    location: 'Bangkok', 
    locationTh: 'กรุงเทพมหานคร', 
    type: 'International/Domestic', 
    lat: 13.91, 
    lon: 100.60,
    category: 'AOT',
    wikiUrl: 'https://en.wikipedia.org/wiki/Don_Mueang_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานดอนเมือง'
  },
  { 
    code: 'VTSP', 
    iata: 'HKT', 
    name: 'Phuket Airport', 
    nameTh: 'ท่าอากาศยานภูเก็ต', 
    location: 'Phuket', 
    locationTh: 'ภูเก็ต', 
    type: 'International', 
    lat: 8.11, 
    lon: 98.31, 
    category: 'AOT',
    wikiUrl: 'https://en.wikipedia.org/wiki/Phuket_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานภูเก็ต'
  },
  { 
    code: 'VTCC', 
    iata: 'CNX', 
    name: 'Chiang Mai Airport', 
    nameTh: 'ท่าอากาศยานเชียงใหม่', 
    location: 'Chiang Mai', 
    locationTh: 'เชียงใหม่', 
    type: 'International', 
    lat: 18.77, 
    lon: 98.96, 
    category: 'AOT',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chiang_Mai_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานเชียงใหม่'
  },
  { 
    code: 'VTSS', 
    iata: 'HDY', 
    name: 'Hat Yai Airport', 
    nameTh: 'ท่าอากาศยานหาดใหญ่', 
    location: 'Songkhla', 
    locationTh: 'สงขลา', 
    type: 'International', 
    lat: 6.93, 
    lon: 100.39, 
    category: 'AOT',
    wikiUrl: 'https://en.wikipedia.org/wiki/Hat_Yai_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานหาดใหญ่'
  },
  { 
    code: 'VTCT', 
    iata: 'CEI', 
    name: 'Mae Fah Luang – Chiang Rai International Airport', 
    nameTh: 'ท่าอากาศยานแม่ฟ้าหลวง เชียงราย', 
    location: 'Chiang Rai', 
    locationTh: 'เชียงราย', 
    type: 'International', 
    lat: 19.95, 
    lon: 99.88,
    category: 'AOT',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mae_Fah_Luang_%E2%80%93_Chiang_Rai_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานแม่ฟ้าหลวง_เชียงราย'
  },
  // DOA Airports
  { 
    code: 'VTSG', 
    iata: 'KBV', 
    name: 'Krabi International Airport', 
    nameTh: 'ท่าอากาศยานกระบี่', 
    location: 'Krabi', 
    locationTh: 'กระบี่', 
    type: 'International', 
    lat: 8.10, 
    lon: 98.98, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Krabi_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานกระบี่'
  },
  { 
    code: 'VTUD', 
    iata: 'UTH', 
    name: 'Udon Thani International Airport', 
    nameTh: 'ท่าอากาศยานอุดรธานี', 
    location: 'Udon Thani', 
    locationTh: 'อุดรธานี', 
    type: 'International', 
    lat: 17.38, 
    lon: 102.79, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Udon_Thani_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานอุดรธานี'
  },
  { 
    code: 'VTSB', 
    iata: 'URT', 
    name: 'Surat Thani International Airport', 
    nameTh: 'ท่าอากาศยานสุราษฎร์ธานี', 
    location: 'Surat Thani', 
    locationTh: 'สุราษฎร์ธานี', 
    type: 'International', 
    lat: 9.13, 
    lon: 99.14, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Surat_Thani_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานสุราษฎร์ธานี'
  },
  { 
    code: 'VTUU', 
    iata: 'UBP', 
    name: 'Ubon Ratchathani International Airport', 
    nameTh: 'ท่าอากาศยานอุบลราชธานี', 
    location: 'Ubon Ratchathani', 
    locationTh: 'อุบลราชธานี', 
    type: 'International', 
    lat: 15.25, 
    lon: 104.87, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ubon_Ratchathani_International_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานอุบลราชธานี'
  },
  { 
    code: 'VTUK', 
    iata: 'KKC', 
    name: 'Khon Kaen Airport', 
    nameTh: 'ท่าอากาศยานขอนแก่น', 
    location: 'Khon Kaen', 
    locationTh: 'ขอนแก่น', 
    type: 'Domestic', 
    lat: 16.46, 
    lon: 102.78, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Khon_Kaen_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานขอนแก่น'
  },
  { 
    code: 'VTSF', 
    iata: 'NST', 
    name: 'Nakhon Si Thammarat Airport', 
    nameTh: 'ท่าอากาศยานนครศรีธรรมราช', 
    location: 'Nakhon Si Thammarat', 
    locationTh: 'นครศรีธรรมราช', 
    type: 'Domestic', 
    lat: 8.54, 
    lon: 99.94, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nakhon_Si_Thammarat_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานนครศรีธรรมราช'
  },
  { 
    code: 'VTUI', 
    iata: 'MAH', 
    name: 'Mae Hong Son Airport', 
    nameTh: 'ท่าอากาศยานแม่ฮ่องสอน', 
    location: 'Mae Hong Son', 
    locationTh: 'แม่ฮ่องสอน', 
    type: 'Domestic', 
    lat: 19.30, 
    lon: 97.97, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mae_Hong_Son_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานแม่ฮ่องสอน'
  },
  { 
    code: 'VTPH', 
    iata: 'HHQ', 
    name: 'Hua Hin Airport', 
    nameTh: 'ท่าอากาศยานหัวหิน', 
    location: 'Prachuap Khiri Khan', 
    locationTh: 'ประจวบคีรีขันธ์', 
    type: 'Domestic', 
    lat: 12.63, 
    lon: 99.95, 
    category: 'DOA',
    wikiUrl: 'https://en.wikipedia.org/wiki/Hua_Hin_Airport',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/ท่าอากาศยานหัวหิน'
  },
  { 
    code: 'VTBL', 
    iata: 'LPR', 
    name: 'Sa Prani Airfield (Army Aviation Center)', 
    nameTh: 'สนามบินสระพรานี (ศูนย์การบินทหารบก)', 
    location: 'Lopburi', 
    locationTh: 'ลพบุรี', 
    type: 'Military', 
    lat: 14.85, 
    lon: 100.65, 
    category: 'ARMY',
    wikiUrl: 'https://en.wikipedia.org/wiki/Lopburi',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/จังหวัดลพบุรี'
  },
  { 
    code: 'RTA-KN', 
    iata: 'KNC', 
    name: 'Fort Surasi Airfield', 
    nameTh: 'สนามบินค่ายสุรสีห์', 
    location: 'Kanchanaburi', 
    locationTh: 'กาญจนบุรี', 
    type: 'Military', 
    lat: 14.10, 
    lon: 99.48, 
    category: 'ARMY',
    wikiUrl: 'https://en.wikipedia.org/wiki/Kanchanaburi',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/จังหวัดกาญจนบุรี'
  },
  { 
    code: 'RTA-NR', 
    iata: 'NAK', 
    name: 'Fort Suranaree Airfield', 
    nameTh: 'สนามบินค่ายสุรนารี', 
    location: 'Nakhon Ratchasima', 
    locationTh: 'นครราชสีมา', 
    type: 'Military', 
    lat: 14.93, 
    lon: 102.10, 
    category: 'ARMY',
    wikiUrl: 'https://en.wikipedia.org/wiki/Nakhon_Ratchasima',
    wikiUrlTh: 'https://th.wikipedia.org/wiki/จังหวัดนครราชสีมา'
  },
];

const ThailandMap = ({ airports, lang, theme }: { airports: any[], lang: string, theme: 'light' | 'dark' }) => {
  // Simple projection: Thailand bounds roughly 5.5N-20.5N, 97.3E-105.7E
  // We'll map these to a 300x500 SVG
  const mapWidth = 300;
  const mapHeight = 500;
  
  const project = (lat: number, lon: number) => {
    // Adjusted projection for the specific image layout
    const x = ((lon - 97) / (106 - 97)) * mapWidth;
    const y = mapHeight - ((lat - 5) / (21 - 5)) * mapHeight;
    return { x, y };
  };

  return (
    <div className={cn(
      "relative w-full h-full flex flex-col rounded-xl overflow-hidden border transition-colors duration-300",
      theme === 'dark' ? "bg-slate-900/50 border-slate-700" : "bg-slate-50/50 border-slate-100"
    )}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={8}
        centerOnInit={true}
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

            <div className="flex-1 w-full h-full flex items-center justify-center p-4">
              <TransformComponent wrapperClassName="!w-full !h-full" contentClassName="!w-full !h-full flex items-center justify-center">
                <div className="relative w-full h-full max-h-[450px] aspect-[3/5]">
                  {/* Background Map Image */}
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Map_TH_provinces_by_thaimed.png" 
                    alt="Thailand Map"
                    className={cn(
                      "w-full h-full object-contain select-none pointer-events-none transition-opacity duration-300",
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
                      return (
                        <g key={airport.code} className="group pointer-events-auto cursor-pointer">
                          <motion.circle
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            cx={x}
                            cy={y}
                            r="5"
                            className={cn(
                              "stroke-2 shadow-sm",
                              isAOT 
                                ? (theme === 'dark' ? "fill-indigo-400 stroke-slate-900" : "fill-indigo-600 stroke-white")
                                : isARMY
                                  ? (theme === 'dark' ? "fill-red-400 stroke-slate-900" : "fill-red-600 stroke-white")
                                  : (theme === 'dark' ? "fill-amber-400 stroke-slate-900" : "fill-amber-600 stroke-white")
                            )}
                          />
                          <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            cx={x}
                            cy={y}
                            r="5"
                            className={isAOT 
                              ? (theme === 'dark' ? "fill-indigo-400/50" : "fill-indigo-400/50")
                              : isARMY
                                ? (theme === 'dark' ? "fill-red-400/50" : "fill-red-400/50")
                                : (theme === 'dark' ? "fill-amber-400/50" : "fill-amber-400/50")
                            }
                          />
                          <text
                            x={x + 10}
                            y={y + 4}
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
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
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
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className={cn("font-medium", theme === 'dark' ? "text-slate-300" : "text-slate-600")}>
            {lang === 'th' ? 'กองทัพบก' : 'Royal Thai Army'}
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
        "text-3xl font-bold mt-1",
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
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.dashboard_title}</h2>
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
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* AOT Column */}
                      <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>AOT</h4>
                        {AIRPORTS.filter(a => a.category === 'AOT').slice(0, 3).map((airport) => (
                          <a 
                            key={airport.code} 
                            href={lang === 'th' ? airport.wikiUrlTh : airport.wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                theme === 'dark' ? "bg-slate-700 group-hover:bg-indigo-500" : "bg-slate-100 group-hover:bg-indigo-500"
                              )}>
                                <MapPin className={cn(
                                  "w-4 h-4 transition-colors",
                                  theme === 'dark' ? "text-slate-400 group-hover:text-white" : "text-slate-500 group-hover:text-white"
                                )} />
                              </div>
                              <div>
                                <p className={cn(
                                  "text-sm font-semibold transition-colors", 
                                  theme === 'dark' ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-indigo-600"
                                )}>{lang === 'th' ? airport.nameTh : airport.name}</p>
                                <p className="text-[10px] text-slate-500">{airport.iata} / {airport.code} • {lang === 'th' ? airport.locationTh : airport.location}</p>
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-colors", 
                              theme === 'dark' ? "text-slate-600 group-hover:text-white" : "text-slate-400 group-hover:text-indigo-600"
                            )} />
                          </a>
                        ))}
                      </div>

                      {/* DOA Column */}
                      <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>DOA</h4>
                        {AIRPORTS.filter(a => a.category === 'DOA').slice(0, 3).map((airport) => (
                          <a 
                            key={airport.code} 
                            href={lang === 'th' ? airport.wikiUrlTh : airport.wikiUrl}
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
                                )}>{lang === 'th' ? airport.nameTh : airport.name}</p>
                                <p className="text-[10px] text-slate-500">{airport.iata} / {airport.code} • {lang === 'th' ? airport.locationTh : airport.location}</p>
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-colors", 
                              theme === 'dark' ? "text-slate-600 group-hover:text-white" : "text-slate-400 group-hover:text-amber-600"
                            )} />
                          </a>
                        ))}
                      </div>

                      {/* Army Column */}
                      <div className="space-y-4">
                        <h4 className={cn("text-[10px] font-bold uppercase tracking-widest mb-4", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>ARMY</h4>
                        {AIRPORTS.filter(a => a.category === 'ARMY').slice(0, 3).map((airport) => (
                          <a 
                            key={airport.code} 
                            href={lang === 'th' ? airport.wikiUrlTh : airport.wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                theme === 'dark' ? "bg-slate-700 group-hover:bg-red-500" : "bg-slate-100 group-hover:bg-red-500"
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
                                )}>{lang === 'th' ? airport.nameTh : airport.name}</p>
                                <p className="text-[10px] text-slate-500">{airport.iata} / {airport.code} • {lang === 'th' ? airport.locationTh : airport.location}</p>
                              </div>
                            </div>
                            <ChevronRight className={cn(
                              "w-4 h-4 transition-colors", 
                              theme === 'dark' ? "text-slate-600 group-hover:text-white" : "text-slate-400 group-hover:text-red-600"
                            )} />
                          </a>
                        ))}
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
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Airports_of_Thailand_Logo.svg/3840px-Airports_of_Thailand_Logo.svg.png" 
                      alt="AOT Logo" 
                      className="h-12 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.dir_title}</h2>
                  </div>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{t.dir_desc}</p>
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
                    {AIRPORTS.filter(a => a.category === 'AOT').map((airport) => (
                      <tr key={airport.code} className={cn(
                        "transition-colors group",
                        theme === 'dark' ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                      )}>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                            theme === 'dark' ? "text-slate-300 bg-slate-700" : "text-slate-600 bg-slate-100"
                          )}>
                            {airport.iata}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                            theme === 'dark' ? "text-indigo-400 bg-indigo-500/10" : "text-indigo-600 bg-indigo-50"
                          )}>
                            {airport.code}
                          </span>
                        </td>
                        <td className={cn("px-6 py-4 font-medium transition-colors", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{lang === 'th' ? airport.nameTh : airport.name}</td>
                        <td className={cn("px-6 py-4 text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{lang === 'th' ? airport.locationTh : airport.location}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full transition-colors",
                            theme === 'dark' ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600"
                          )}>
                            {airport.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {airport.wikiUrl ? (
                            <a 
                              href={lang === 'th' ? airport.wikiUrlTh : airport.wikiUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={cn(
                                "font-semibold text-sm transition-colors",
                                theme === 'dark' ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                              )}
                            >
                              {t.table_details}
                            </a>
                          ) : (
                            <button className={cn(
                              "font-semibold text-sm transition-colors",
                              theme === 'dark' ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-800"
                            )}>{t.table_details}</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* DOA Section */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Seal_of_the_Department_of_Airports_of_Thailand.svg/1920px-Seal_of_the_Department_of_Airports_of_Thailand.svg.png" 
                      alt="DOA Seal" 
                      className="h-12 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.dir_doa_title}</h2>
                  </div>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{t.dir_doa_desc}</p>
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
                    {AIRPORTS.filter(a => a.category === 'DOA').map((airport) => (
                      <tr key={airport.code} className={cn(
                        "transition-colors group",
                        theme === 'dark' ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                      )}>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                            theme === 'dark' ? "text-slate-300 bg-slate-700" : "text-slate-600 bg-slate-100"
                          )}>
                            {airport.iata}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                            theme === 'dark' ? "text-amber-400 bg-amber-500/10" : "text-amber-600 bg-amber-50"
                          )}>
                            {airport.code}
                          </span>
                        </td>
                        <td className={cn("px-6 py-4 font-medium transition-colors", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{lang === 'th' ? airport.nameTh : airport.name}</td>
                        <td className={cn("px-6 py-4 text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{lang === 'th' ? airport.locationTh : airport.location}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full transition-colors",
                            theme === 'dark' ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600"
                          )}>
                            {airport.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {airport.wikiUrl ? (
                            <a 
                              href={lang === 'th' ? airport.wikiUrlTh : airport.wikiUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={cn(
                                "font-semibold text-sm transition-colors",
                                theme === 'dark' ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-800"
                              )}
                            >
                              {t.table_details}
                            </a>
                          ) : (
                            <button className={cn(
                              "font-semibold text-sm transition-colors",
                              theme === 'dark' ? "text-amber-400 hover:text-amber-300" : "text-amber-600 hover:text-amber-800"
                            )}>{t.table_details}</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Army Section */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Seal_of_the_Royal_Thai_Army.svg/1200px-Seal_of_the_Royal_Thai_Army.svg.png" 
                      alt="Army Seal" 
                      className="h-12 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.dir_army_title}</h2>
                  </div>
                  <p className={cn("mt-1", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{t.dir_army_desc}</p>
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
                    {AIRPORTS.filter(a => a.category === 'ARMY').map((airport) => (
                      <tr key={airport.code} className={cn(
                        "transition-colors group",
                        theme === 'dark' ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                      )}>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                            theme === 'dark' ? "text-slate-300 bg-slate-700" : "text-slate-600 bg-slate-100"
                          )}>
                            {airport.iata}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "font-mono text-sm font-bold px-2 py-1 rounded transition-colors",
                            theme === 'dark' ? "text-red-400 bg-red-500/10" : "text-red-600 bg-red-50"
                          )}>
                            {airport.code}
                          </span>
                        </td>
                        <td className={cn("px-6 py-4 font-medium transition-colors", theme === 'dark' ? "text-slate-200" : "text-slate-900")}>{lang === 'th' ? airport.nameTh : airport.name}</td>
                        <td className={cn("px-6 py-4 text-sm transition-colors", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>{lang === 'th' ? airport.locationTh : airport.location}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full transition-colors",
                            theme === 'dark' ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600"
                          )}>
                            {airport.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {airport.wikiUrl ? (
                            <a 
                              href={lang === 'th' ? airport.wikiUrlTh : airport.wikiUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={cn(
                                "font-semibold text-sm transition-colors",
                                theme === 'dark' ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"
                              )}
                            >
                              {t.table_details}
                            </a>
                          ) : (
                            <button className={cn(
                              "font-semibold text-sm transition-colors",
                              theme === 'dark' ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"
                            )}>{t.table_details}</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.nav_operations}</h2>
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
                  <h2 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>{t.nav_analytics}</h2>
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
