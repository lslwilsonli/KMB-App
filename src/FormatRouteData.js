import { Fragment } from "react";

function RouteDataDiv({
  handleShowStops,
  route,
  direction,
  service_type,
  dest,
}) {
  return (
    // <button
    <div
      onClick={(e) => handleShowStops(e, route)}
      route={route}
      direction={direction}
      service_type={service_type}
      className={"btn"}
    >
      {route} <span className="text-xs">往</span> {dest}{" "}
    </div>
  );
}

export default function FormatRouteData({
  routeRaw,
  busRoute,
  handleShowStops,
}) {
  if (!busRoute) {
    const allResult = routeRaw.map((raw, idx) => {
      return (
        <Fragment key={"Fragment_" + idx}>
          <RouteDataDiv
            key={idx}
            handleShowStops={handleShowStops}
            route={raw.route}
            direction={raw.bound}
            service_type={raw.service_type}
            dest={raw.dest_tc}
          />
        </Fragment>
      );
    });
    return allResult?.length > 0 ? (
      allResult
    ) : (
      <div className="pl-2">暫時沒有巴士資料</div>
    );
  }
  if (busRoute) {
    const searchResult = routeRaw
      // .filter((raw) => raw.route.includes(busRoute)) // === routeInput
      .filter((raw) => raw.route.startsWith(busRoute)) // === routeInput
      .map((raw, idx) => {
        return (
          <RouteDataDiv
            key={idx}
            handleShowStops={handleShowStops}
            route={raw.route}
            direction={raw.bound}
            service_type={raw.service_type}
            dest={raw.dest_tc}
          />
        );
      });

    return searchResult?.length !== 0 ? (
      searchResult
    ) : (
      <div className="pl-2">沒有此巴士</div>
    );
  }
}
