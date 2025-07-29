import { formTypes } from "@/type";
import AggregatorsForm from "./AggregatorFom";
import BulkTradersForm from "./BulkTradersForm";
import FarmersForm from "./FarmersForm";
import GovernmentAgenciesForm from "./GovernmentAgencyForm";
import InputSupplierForm from "./InputSuppliersForm";
import InvestorsForm from "./Investors";
import NGOsForm from "./NGOForm";
import RetailersForm from "./Retailers";
import TransportCompanyForm from "./TransportForm";
import FormSubmitted from "./FormSubmitted";

interface FormRendererProps {
  type: formTypes;
  isSubmitted: boolean;
}
function FormRenderer({ type, isSubmitted }: FormRendererProps) {
  // If form is already submitted, show the submitted state
  if (isSubmitted) {
    return <FormSubmitted />;
  }
  switch (type) {
    case "farmer":
      return <FarmersForm />;
    case "aggregator":
      return <AggregatorsForm />;
    case "input_supplier":
      return <InputSupplierForm />;
    case "investors":
      return <InvestorsForm />;
    case "bulk_trader":
      return <BulkTradersForm />;
    case "government_agencies":
      return <GovernmentAgenciesForm />;
    case "ngo_and_development_partners":
      return <NGOsForm />;
    case "retailers":
      return <RetailersForm />;
    case "transport_company":
      return <TransportCompanyForm />;
    default:
      break;
  }
}

export default FormRenderer;
