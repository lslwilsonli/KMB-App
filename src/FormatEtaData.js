export default function FormatEtaData({
  selectedStopName,
  eta,
  reset,
  selectedRoute,
}) {
  console.log("eta", eta);

  return (
    <>
      <div
        className="pl-2 text-white mb-1"
        style={{ backgroundColor: "rgba(230, 0, 18, 0.8)" }}
      >
        <div>巴士: {selectedRoute}</div>
        <div>車站: {selectedStopName}</div>
      </div>
      <button className="btn" onClick={reset}>
        返回
      </button>
      <div className="pl-2">
        {/* 未能提供服務 */}
        {eta[0].eta_time === null && eta[0].type === "" && "抱歉，未能提供服務"}

        {/* 最後班次已過 */}
        {eta.every((el) => el.type === "最後班次已過") && "最後班次已過"}
        {/* 正常班次 */}
        {eta
          .filter((el) => el.eta_time !== null)
          .map((el, idx) => {
            return (
              <div key={idx}>
                {el.eta_time &&
                  `第${idx + 1}架巴士 ${el.eta_time.slice(11, 16)} `}
                {el.type && `[${el.type}]`}
              </div>
            );
          })}
      </div>
    </>
  );
}
