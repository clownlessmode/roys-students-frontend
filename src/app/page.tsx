import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col mx-auto max-w-[1440px] bg-background relative">
      <Image alt="s" src={"bg.svg"} width={1440} height={5000} className="" />
      <Link
        href={"/login"}
        className="z-10 right-4 top-4 text-gray-400 absolute"
      >
        Войти
      </Link>
    </div>
  );
}
