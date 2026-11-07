const inputBase = "w-full bg-white/15 rounded-md p-3 focus:outline-2";
const pressStyle = "transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50 disabled:opacity-50";

export const inputStyle = `${inputBase} focus:outline-cyan-500`;
export const registerInputStyle = `${inputBase} focus:outline-yellow-500`;
export const segmentStyle = "-mb-1 border-b-4 pb-3 transition duration-300";
export const buttonStyle = `flex-1 font-bold rounded-md py-3 text-center ${pressStyle}`;
export const removeStyle = `flex items-center gap-2 bg-red-500 text-sm font-bold rounded-md px-3 py-2 ${pressStyle}`;
export const bookingButton = `flex w-full items-center justify-center rounded-md py-2 text-center text-sm font-bold ${pressStyle}`;
export const pillStyle = "w-full bg-white/5 rounded-md p-3 text-gray-300 cursor-default resize-none focus:outline-none";
export const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400";
export const tagStyle = "flex w-fit items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400";
export const messageStyle = "my-auto py-8 text-center text-lg text-white";
export const bookingColumns = "grid-cols-[minmax(0,2fr)_minmax(5rem,1fr)_minmax(7rem,1fr)_minmax(8rem,1.5fr)_7rem]";
export const adminColumns = "grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.2fr)_6rem] 2xl:grid-cols-[repeat(5,minmax(0,1fr))_6rem]";