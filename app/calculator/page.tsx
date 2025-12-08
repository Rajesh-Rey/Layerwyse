import { cn } from "@/lib/utils";

export default function Calculator() {
  return (
    <div className="flex h-dvh w-full gap-4 p-4">
      <div className="results w-full">
        <Preview3d />
        <Summary className="mt-7" />
      </div>
      <div className="inputs flex w-full flex-col gap-4 overflow-y-auto">
        {[
          "Info",
          "Printing",
          "Post Processing",
          "Painting",
          "Modeling",
          "Support",
        ].map((title) => (
          <InputGroup key={title} groupTitle={title} />
        ))}
      </div>
    </div>
  );
}

type InputGroupProps = {
  groupTitle: string;
  children?: React.ReactNode;
};

function InputGroup({ groupTitle }: InputGroupProps) {
  return (
    <div className="input-group flex flex-wrap gap-2">
      <div className="group-header flex w-full justify-between">
        <div className="group-header-title text-2xl">{groupTitle}</div>
        <div className="group-header-title justify-end text-2xl">&gt; </div>
      </div>
      <div className="input flex flex-col gap-1">
        <label className="text-accent text-lg">Name</label>
        <p className="text-sm text-gray-400">Your project name</p>
        <input
          className="max-w-fit rounded-lg border-2 border-gray-300 p-2"
          type="text"
          placeholder="name"
        />
      </div>
      <div className="input flex flex-col gap-1">
        <label className="text-accent text-lg">Name</label>
        <p className="text-sm text-gray-400">Your project name</p>
        <input
          className="max-w-fit rounded-lg border-2 border-gray-300 p-2"
          type="text"
          placeholder="name"
        />
      </div>
      <div className="input flex flex-col gap-1">
        <label className="text-accent text-lg">Name</label>
        <p className="text-sm text-gray-400">Your project name</p>
        <input
          className="max-w-fit rounded-lg border-2 border-gray-300 p-2"
          type="text"
          placeholder="name"
        />
      </div>

      <div className="input flex flex-col gap-1">
        <label className="text-accent text-lg">Name</label>
        <p className="text-sm text-gray-400">Your project name</p>
        <input
          className="max-w-fit rounded-lg border-2 border-gray-300 p-2"
          type="text"
          placeholder="name"
        />
      </div>
    </div>
  );
}

function Preview3d() {
  return <div className="h-[500] w-full bg-gray-500">3d preview</div>;
}

type SummaryProps = {
  className?: string;
};

function Summary({ className }: SummaryProps) {
  return (
    <div className={cn("breakdown flex flex-col gap-4", className)}>
      <h1 className="text-accent text-xl">Your Project breakdown</h1>
      <div className="details">
        <div className="flex justify-between">
          <p className="text-gray-500">Material Cost: </p>
          <p className="text-accent">122.250 KWD </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Material Cost: </p>
          <p className="text-accent">122.250 KWD </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Material Cost: </p>
          <p className="text-accent">122.250 KWD </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Material Cost: </p>
          <p className="text-accent">122.250 KWD </p>
        </div>
      </div>
      <div className="totals">
        <div className="flex justify-between">
          <p className="text-2xl">Total Cost: </p>
          <p className="text-accent text-2xl">122.250 KWD </p>
        </div>

        <div className="flex justify-between">
          <p className="text-2xl">Total Cost: </p>
          <p className="text-accent text-2xl">122.250 KWD </p>
        </div>

        <div className="flex justify-between">
          <p className="text-2xl">Total Cost: </p>
          <p className="text-accent text-2xl">122.250 KWD </p>
        </div>
      </div>
    </div>
  );
}
