import Image from "next/image";

export default function HomeImage() {
  return (
    <section className="w-full">
      <div className="mx-auto ">
        <Image
          src="/church-image.webp"
          alt="Jodhpur Church"
          width={1600}
          height={900}
          className="h-auto w-full rounded-2xl object-cover"
          priority={false}
        />
      </div>
    </section>
  );
}