import React from "react";

const page = () => {
  return (
    <section className="container px-4 py-12 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Выберите категорию
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
           Управляйте данными легко и быстро, выберите нужную категорию для администрирования.
          </p>
        </div>
      </div>
    </section>
  );
};

export default page;
