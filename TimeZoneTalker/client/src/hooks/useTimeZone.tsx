import { useState, useEffect } from "react";
import { TIME_ZONES } from "@/lib/constants";
import { 
  convertTime, 
  formatTimeWithZone, 
  getTimezoneDifference, 
  formatTimezoneDifference 
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_USER } from "@/lib/constants";

interface TimeZoneResult {
  userTimeZone: string;
  setUserTimeZone: (timeZone: string) => void;
  partnerTimeZone: string;
  setPartnerTimeZone: (timeZone: string) => void;
  userTime: string;
  setUserTime: (time: string) => void;
  partnerTime: string;
  hourDiff: number;
  formattedDiff: string;
  getTimeZoneLabel: (id: string) => string;
  detectTimeZone: () => string;
  convertUserTimeToPartner: (time: string) => string;
  convertPartnerTimeToUser: (time: string) => string;
}

export function useTimeZone(): TimeZoneResult {
  // Get user data for default time zone
  const { data: user } = useQuery({
    queryKey: ["/api/users/current"],
    initialData: INITIAL_USER,
  });

  // State for time zone converter
  const [userTimeZone, setUserTimeZone] = useState<string>(user.timeZone);
  const [partnerTimeZone, setPartnerTimeZone] = useState<string>("Europe/Paris");
  const [userTime, setUserTime] = useState<string>("15:00");
  const [partnerTime, setPartnerTime] = useState<string>("");
  const [hourDiff, setHourDiff] = useState<number>(0);

  // Effect to update partner time when inputs change
  useEffect(() => {
    calculatePartnerTime();
    calculateTimeDifference();
  }, [userTimeZone, partnerTimeZone, userTime]);

  // Calculate partner time based on input time and time zones
  const calculatePartnerTime = () => {
    const calculatedTime = convertUserTimeToPartner(userTime);
    setPartnerTime(calculatedTime);
  };

  // Calculate difference between time zones
  const calculateTimeDifference = () => {
    const diff = getTimezoneDifference(userTimeZone, partnerTimeZone);
    setHourDiff(diff);
  };

  // Convert user time to partner time
  const convertUserTimeToPartner = (time: string): string => {
    // Parse the user time
    const [hours, minutes] = time.split(":").map(Number);
    const userDate = new Date();
    userDate.setHours(hours, minutes, 0, 0);
    
    // Convert to partner time zone
    const partnerDate = convertTime(userDate, userTimeZone, partnerTimeZone);
    return formatTimeWithZone(partnerDate, partnerTimeZone);
  };

  // Convert partner time to user time
  const convertPartnerTimeToUser = (time: string): string => {
    // Parse the partner time
    const [hours, minutes] = time.split(":").map(Number);
    const partnerDate = new Date();
    partnerDate.setHours(hours, minutes, 0, 0);
    
    // Convert to user time zone
    const userDate = convertTime(partnerDate, partnerTimeZone, userTimeZone);
    return formatTimeWithZone(userDate, userTimeZone);
  };

  // Get time zone label
  const getTimeZoneLabel = (id: string): string => {
    const zone = TIME_ZONES.find(zone => zone.id === id);
    return zone ? zone.label : id;
  };

  // Detect browser time zone
  const detectTimeZone = (): string => {
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Check if the browser time zone is in our list
    const matchedZone = TIME_ZONES.find(zone => zone.id === browserTimeZone);
    return matchedZone ? browserTimeZone : "UTC";
  };

  return {
    userTimeZone,
    setUserTimeZone,
    partnerTimeZone,
    setPartnerTimeZone,
    userTime,
    setUserTime,
    partnerTime,
    hourDiff,
    formattedDiff: formatTimezoneDifference(hourDiff),
    getTimeZoneLabel,
    detectTimeZone,
    convertUserTimeToPartner,
    convertPartnerTimeToUser
  };
}
