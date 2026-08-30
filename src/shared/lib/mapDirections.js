const validCoordinate = value => Number.isFinite(Number(value));

const coordinateValue = point => `${Number(point.latitude)},${Number(point.longitude)}`;

const namedKakaoPoint = (point, fallbackName) => {
  const name = point?.name?.ko || fallbackName;
  return `${encodeURIComponent(name)},${coordinateValue(point)}`;
};

const googleAddress = (point, fallback = "") => [point?.name?.en, point?.address?.en]
  .filter(Boolean)
  .join(", ") || fallback;

export const hasDriveDirections = data => {
  const route = data?.driveRoute;
  return validCoordinate(route?.start?.latitude)
    && validCoordinate(route?.start?.longitude)
    && validCoordinate(route?.destination?.latitude)
    && validCoordinate(route?.destination?.longitude);
};

export const createKakaoDriveDirectionsLink = data => {
  if (!hasDriveDirections(data)) return "";
  const route = data.driveRoute;
  const points = [
    namedKakaoPoint(route.start, "드라이브 출발점"),
    ...(route.waypoints || []).slice(0, 5).map((point, index) => namedKakaoPoint(point, `경유지 ${index + 1}`)),
    namedKakaoPoint(route.destination, "드라이브 도착점"),
  ];
  return `https://map.kakao.com/link/by/car/${points.join("/")}`;
};

export const createMapDirectionsLink = (data, lang) => {
  if (hasDriveDirections(data)) {
    const route = data.driveRoute;
    if (lang === "en") {
      const origin = googleAddress(route.start, coordinateValue(route.start));
      const destination = googleAddress(route.destination, coordinateValue(route.destination));
      const waypoints = (route.waypoints || [])
        .filter(waypoint => waypoint.googleEnabled !== false)
        .slice(0, 3)
        .map(coordinateValue);
      const params = new URLSearchParams({
        api: "1",
        origin,
        destination,
        travelmode: "driving",
      });
      if (waypoints.length) params.set("waypoints", waypoints.join("|"));
      return `https://www.google.com/maps/dir/?${params.toString()}`;
    }

    return createKakaoDriveDirectionsLink(data);
  }

  const latLng = data?.location?.latLng;
  if (!latLng) return "";
  const [lat, lng] = latLng.split(",").map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return "";
  const name = data?.location?.name?.[lang] || data?.location?.name?.ko || "목적지";
  if (lang === "en") {
    const englishAddress = data?.location?.address?.en?.[1]
      ?? data?.location?.address?.en?.[0];
    const query = [data?.location?.name?.en, englishAddress].filter(Boolean).join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return `https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`;
};
