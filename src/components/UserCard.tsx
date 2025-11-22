import Image from "next/image";

const UserCard = ({ label, value, isAmount, isDate }: { label: string, value: number | string, isAmount?:any, isDate?:any }) => {
  const firstNumber = value.toString().slice(0,1);
  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border-l-4 border-teal-500"
    // style={{borderLeft: `#3${firstNumber}087${firstNumber} solid 4px`}}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-[12px] font-medium text-gray-500 uppercase">
          {label}
        </h1>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <div className="flex justify-between">
        <h2 className="mt-1 text-3xl font-bold text-gray-900 ">{value}</h2>
      </div>
    </div>
  );
};

export default UserCard;