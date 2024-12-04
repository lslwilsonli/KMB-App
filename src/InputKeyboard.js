/*
number: type 1 number first, then show 0 and delete
alphabet: show all posibility
*/

export default function InputKeyboard() {
  const numberArr = [];
  for (let i = 0; i <= 9; i++) {
    numberArr.push(i);
  }
  console.log(numberArr);

  return numberArr.map((number, idx) => {
    return (
      <div key={idx} className="w-fit">
        {number}
      </div>
    );
  });
}
