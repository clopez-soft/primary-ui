import Page from "src/components/Page";
import FormRecord from "./form";

const CreateRecord = () => {
  return (
    <Page title="Registro de Actas">
      <FormRecord isEdit={false} canSave={true} row={undefined} />
    </Page>
  );
};

export default CreateRecord;
