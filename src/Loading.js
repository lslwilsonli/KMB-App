/*
Bus running animation
or loading circle
*/

export default function Loading({ name, reset }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div>加載{name}中...</div>
      <button onClick={reset} className="btn">
        重新載入
      </button>
    </div>
  );
}
