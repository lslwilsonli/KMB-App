/*
Regex input
*/

import { useEffect, useState } from "react";
import "./App.css";
import FormatRouteData from "./FormatRouteData";
import InputField from "./InputField";
import FormatStopsData from "./FormatStopsData";
import FormatEtaData from "./FormatEtaData";
// import InputKeyboard from "./InputKeyboard";
import Welcome from "./Welcome";
import Loading from "./Loading";

function FormatedDiv() {
  return <div className="border border-red-300 rounded "></div>;
}

function App() {
  const [routeRaw, setRouteRaw] = useState([]); // all bus routes data
  const [searchTerm, setSearchTerm] = useState(""); // search & filter in routeRow
  const [selectedRoute, setSelectedRoute] = useState(null); // selected Route & parm to fetch stops
  const [selectedRoute_Dir, setSelectedRoute_Dir] = useState(null); // parm to fetch stops
  const [selectedRoute_Ser, setSelectedRoute_Ser] = useState(null); // parm to fetch stops
  const [stopsRaw, setStopsRaw] = useState(null); // all stops of selected route
  const [stopsName, setStopsName] = useState([]); // all stops name of all routes
  const [selectedStopId, setSelectedStopId] = useState(""); // stopId of clicked stop
  const [selectedStopName, setSelectedStopName] = useState(""); // stopId of clicked stop
  const [eta, setEta] = useState([]); // ETA of each eta

  function initializationLayout() {
    setStopsRaw("");
    setSelectedStopId("");
    setSelectedStopName("");
    setEta("");
  }

  // For Input Field to show & set selected route
  function handleChange(e) {
    setSearchTerm(e.target.value.toUpperCase());
    setSelectedRoute("");
    setSelectedRoute_Dir("");
    setSelectedRoute_Ser("");
    initializationLayout();
  }

  // reset
  function reset() {
    setSearchTerm("");
    setSelectedRoute("");
    setSelectedRoute_Dir("");
    setSelectedRoute_Ser("");
    initializationLayout();
  }

  function resetSelectedStopName() {
    setSelectedStopName("");
  }

  // set dir & set service type
  function handleShowStops(e, route) {
    if (!e.target.attributes.direction || !e.target.attributes.service_type)
      return null;
    const direction =
      e.target.attributes.direction.nodeValue === "O" ? "outbound" : "inbound";
    const service = e.target.attributes.service_type.nodeValue;
    if (
      route === selectedRoute &&
      direction === selectedRoute_Dir &&
      service === selectedRoute_Ser
    ) {
      return null;
    }

    setSelectedRoute(route);
    setSelectedRoute_Dir(direction);
    setSelectedRoute_Ser(service);
    initializationLayout();
  }
  function handleSelectStop(e) {
    setSelectedStopId(e.target.id);
    setSelectedStopName(e.target.attributes.stopName.nodeValue);
  }

  // #1 Fetch Routes & Stop Name
  useEffect(() => {
    fetchRoutes();
    fetchStoplist();
  }, []);

  async function fetchRoutes() {
    const res = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/route/`
    );
    const result = await res.json();
    setRouteRaw(result.data);
  }

  async function fetchStoplist() {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop`);
    const result = await res.json();

    const outputArr = result.data.map((el) => {
      return {
        name: el.name_tc,
        stop: el.stop,
      };
    });

    setStopsName(outputArr);
  }

  // #2 Fetch Stops of selected route
  useEffect(() => {
    async function fetchStops() {
      const res = await fetch(
        `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${selectedRoute}/${selectedRoute_Dir}/${selectedRoute_Ser}`
      );
      const result = await res.json();
      setStopsRaw(result.data);
    }
    selectedRoute && selectedRoute_Dir && selectedRoute_Ser && fetchStops();
  }, [selectedRoute, selectedRoute_Dir, selectedRoute_Ser]);

  // #3 Fetch ETA
  useEffect(() => {
    async function fetchStopETA() {
      const res = await fetch(`
  https://data.etabus.gov.hk/v1/transport/kmb/eta/${selectedStopId}/${selectedRoute}/${selectedRoute_Ser}`);
      const result = await res.json();

      const outputArr = result.data
        .map((el) => {
          return {
            company: el.co,
            seq: el.eta_seq,
            eta_time: el.eta,
            type: el.rmk_tc,
          };
        })
        .slice(0, 3);
      setEta(outputArr);
    }
    selectedRoute &&
      selectedRoute_Ser &&
      selectedStopId.length > 0 &&
      fetchStopETA();
  }, [selectedRoute, selectedRoute_Ser, selectedStopId]);

  return (
    <div className="App w-full h-screen flex flex-col items-center relative">
      <div onClick={reset} className="w-24 mt-3 mb-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/KowloonMotorBus.svg/1280px-KowloonMotorBus.svg.png"
          alt="logo"
        ></img>
      </div>
      <div className="w-80">
        <InputField handleChange={handleChange} value={searchTerm} />
        <div className="scroller formatedDiv ">
          {!selectedRoute && (
            <>
              <div
                className="pl-2 text-white"
                style={{ backgroundColor: "rgba(230, 0, 18, 0.8)" }}
              >
                點擊路線以查詢更多資料
              </div>

              {routeRaw.length > 0 ? (
                <FormatRouteData
                  routeRaw={routeRaw}
                  busRoute={searchTerm}
                  handleShowStops={handleShowStops}
                />
              ) : (
                <Welcome />
              )}
            </>
          )}

          {!selectedStopName &&
            selectedRoute &&
            stopsName.length > 0 &&
            (stopsRaw.length > 0 ? (
              <FormatStopsData
                busRoute={selectedRoute}
                stopsRaw={stopsRaw}
                stopsName={stopsName}
                handleSelectStop={handleSelectStop}
                selectedRoute={selectedRoute}
                reset={reset}
              />
            ) : (
              <Loading name="巴士站" reset={reset} />
            ))}

          {selectedRoute &&
            selectedStopName &&
            eta.length > 0 &&
            (eta.length > 0 ? (
              <FormatEtaData
                selectedStopName={selectedStopName}
                eta={eta}
                reset={resetSelectedStopName}
                selectedRoute={selectedRoute}
              />
            ) : (
              <Loading name="預計到達時間" reset={reset} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
