import Image from "next/image";

const UserCard = ({ country, customerCount }: { country: string, customerCount: number }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
      <div className="flex justify-between items-center">
        <h1 className="text-sm font-medium text-gray-500 uppercase">
          {country}
        </h1>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <div className="flex justify-between">
        <h2 className="mt-1 text-3xl font-bold text-gray-900 ">{customerCount}</h2>
      </div>
    </div>
  );
};

export default UserCard;