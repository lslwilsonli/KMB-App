export default function InputField({ handleChange, value = "" }) {
  return (
    <>
      <input
        onChange={handleChange}
        value={value}
        className="w-full border border-red-300 hover:border-red-600 focus:outline-none focus:border-red-300 pl-2 rounded"
        placeholder="請輸入巴士號碼"
      />
    </>
  );
}
