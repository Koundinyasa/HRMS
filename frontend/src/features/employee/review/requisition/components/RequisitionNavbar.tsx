import { Button } from "@/components/ui/button";
export default function RequisitionNavbar() {
  return (
    <div className="flex h-16 items-center rounded-md border border-black bg-white px-4 font-[Urbanist]">
      <Button
        type="button"
        variant="ghost"
        className="relative flex h-full items-center rounded-none px-0 text-[15px] font-medium tracking-wide text-sky-600 hover:bg-transparent font-[Urbanist]"
      >
        Applied Leave

        <span className="absolute bottom-2 left-0 h-[2px] w-full bg-sky-500 font-[Urbanist]" />
      </Button>
    </div>
  );
}