"use client"
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAppSelector } from "@/redux/store"
import Image from "next/image"
import { useEffect, useState } from "react";

const Navbar = () => {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);



  // const userDetails = useAppSelector((state) => state.auth.userDetails);
  const { getUserDetails } = useLocalStorage("userDetails", null);


  // useEffect(() => {
  //   console.log(userDetails);
  // }, [userDetails])

  return (
    <>
      {
        !isClient ? <span>Loading...</span> :

          <div className='flex justify-between p-4'>
            <div className='hidden md:flex items-center gap-2 text-[24px]  px-2'>
              <h1>🏠</h1>
            </div>

            <div className='flex items-center gap-6 justify-end w-full'>
              <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
                <Image src="/message.png" alt="" width={20} height={20} />
              </div>
              <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
                <Image src="/announcement.png" alt="" width={20} height={20} />
                <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>1</div>
              </div>
              <div className='flex flex-col'>
                <span className="text-xs leading-3 font-medium">{getUserDetails()?.firstName + " " + getUserDetails()?.lastName}</span>
                <span className="text-[10px] text-gray-500 text-right">{getUserDetails()?.roleDto.name}</span>
              </div>
              <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
            </div>
          </div>
      }
    </>

  )
}

export default Navbar