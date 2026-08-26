import HelpDeskNavbar from "../components/HelpDeskNavbar";
import RaiseTicketForm from "../components/RaiseTicketForm";

export default function RaiseTicket() {

  return (
    <div className="w-full">

      <HelpDeskNavbar />

      <div className="mt-4 px-3 sm:mt-6 sm:px-4 md:px-6 lg:px-8">

        <RaiseTicketForm />

      </div>

    </div>
  );
}