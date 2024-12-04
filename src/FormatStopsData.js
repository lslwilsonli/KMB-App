export default function FormatStopsData({
  stopsRaw,
  stopsName,
  handleSelectStop,
  busRoute,
  selectedRoute,
  reset,
}) {
  // use obj to pair up stop id & stop name
  // pair up => stops id stops name
  if (!busRoute) return null;

  function matchStopAndName(routestop) {
    const iterator = stopsName.values();
    for (const value of iterator) {
      if (value.stop === routestop) {
        return value.name;
      }
    }
  }

  const stopsResult = stopsRaw
    .filter((raw) => matchStopAndName(raw.stop) !== undefined)
    .map((raw, idx) => ({
      key: idx,
      onClick: handleSelectStop,
      id: raw.stop,
      stopname: matchStopAndName(raw.stop),
      stopSeq: raw.seq,
    }));

  return (
    <>
      <div
        className="pl-2 text-white mb-1"
        style={{ backgroundColor: "rgba(230, 0, 18, 0.8)" }}
      >
        <div>巴士: {selectedRoute}</div>
        <div>點擊車站以獲取預計到達時間</div>
      </div>
      <button className="btn" onClick={reset}>
        返回
      </button>
      {stopsResult.map(({ key, onClick, id, stopname, stopSeq }) => {
        return (
          <div
            key={key}
            onClick={onClick}
            id={id}
            stopname={stopname}
            className="btn"
          >
            {`${stopSeq}: ${stopname}`}
          </div>
        );
      })}
    </>
  );
}
