/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useCallback, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
//import { debounce } from 'lodash';
import {
  Container,
  Card,
  //Grid,
  Stack,
  TextField,
  Typography,
  // FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LoadingButton } from "@mui/lab";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

//import SaveIcon from '@mui/icons-material/Save';

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import AlertMessage from "src/components/AlertMessage";
import SelectLevel from "src/components/selects/selectLevel";
// import { UploadAvatar } from "src/components/upload";
// import ImagePreview from "src/components/images/imagePreview";

import { toSafeString, toSafeNumber } from "src/utils/helper";
// import { CompressImageFromInputFile } from "src/utils/imageHelper";
//import useAuth from 'src/hooks/useAuth';
import { PATH_DASHBOARD } from "src/routes/paths";
import { JRV_BY_NUMBER, CREATE_RECORD, UPDATE_RECORD } from "../graph";
import { JrvNumberType, Record, RecordFormSchema, RecordDetail } from "../type";

import Ballots from "./ballots";
import Votes from "./votes";
import President from "./president";
import Mayor from "./mayor";
import Congress from "./congress";
import CongressVotes from "./congressVotes";

type Props = {
  isEdit: boolean;
  canSave: boolean;
  row?: Record;
  jrvInfo?: JrvNumberType;
};

const initialJrv: JrvNumberType = {
  id: "",
  name: "",
  number: 0,
  electoral_weight: 0,
  voting_center: {
    id: "",
    area: "",
    code: "",
    electoral_sector: "",
    name: "",
  },
  municipality: {
    id: "",
    code: "",
    name: "",
  },
  department: {
    id: "",
    code: "",
    name: "",
  },
  country: {
    id: "",
    code: "",
    name: "",
  },
};

const FormRecord = ({
  isEdit,
  canSave,
  row = undefined,
  jrvInfo = undefined,
}: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  //console.info(row);
  const [jrv, setJrv] = useState(jrvInfo || initialJrv);
  const [jrvExist, setJrvExist] = useState(true);
  const [enableSave, setEnableSave] = useState(true);

  const [errorValidate, setErrorValidate] = useState("");

  useEffect(() => {
    if (jrvInfo) setJrv(jrvInfo);
  }, [jrvInfo]);

  const [createRecord] = useMutation(CREATE_RECORD);
  const [updateRecord] = useMutation(UPDATE_RECORD);

  const getVariables = (values: RecordFormSchema) => {
    const valid_votes =
      values.detail
        .map((item) => item.votes)
        .reduce((prev, curr) => toSafeNumber(prev) + toSafeNumber(curr), 0) ||
      0;
    const validDetail: RecordDetail[] =
      values.detail.map((item) => {
        return {
          detail_id: item.detail_id || "",
          movimiento_interno_id: item.movimiento_interno_id || "",
          political_alliance_id: item.political_alliance_id || "",
          candidate_id: item.candidate_id || "",
          number_box: item.number_box || 0,
          votes: toSafeNumber(item.votes),
        } as RecordDetail;
      }) || [];

    const fields = {
      level: values.level,
      jrv_id: values.jrv_id,
      number: values.jrv_number,
      electoral_weight: values.electoral_weight || 0,

      voters: values.voters || 0,
      jrv_votes: values.jrv_votes || 0,
      custodians: values.custodians || 0,
      total_voters: values.total_voters || 0,

      recibed_ballots: values.recibed_ballots || 0,
      leftover_ballots: values.leftover_ballots || 0,
      total_ballots: values.total_ballots || 0,

      valid_votes: valid_votes || 0,
      void_votes: values.void_votes || 0,
      blank_votes: values.blank_votes || 0,
      total_votes: values.total_votes || 0,

      with_problems: values.with_problems,
      problems: values.problems,

      observations: values.observations,
      detail: validDetail,
    };

    let variables: { input: any } | null = null;
    if (isEdit) {
      variables = {
        input: {
          ...fields,
          record_id: values.record_id,
        },
        // image: values.cover,
      };
    } else {
      variables = {
        input: {
          ...fields,
        },
        // image: values.cover,
      };
    }

    // console.info(variables);
    // const str = JSON.stringify(variables);
    // console.info(str);
    return variables;
  };

  const NewRecordSchema = Yup.object().shape({
    jrv_number: Yup.string().required("El numero de JRV es requerido"),
    level: Yup.string().required("El nivel electoral es requerido"),
    jrv_id: Yup.string().required("El numero de JRV debe ser valido"),
    // image_url: Yup.string().required("Debe seleccionar la imagen del acta"),
  });

  const initialValues: RecordFormSchema = {
    afterSubmit: "",
    record_id: row?.id || "",
    level: row?.level || "",
    jrv_id: row?.jrv_id || "",
    jrv_number: row?.jrv_number,
    electoral_weight: row?.electoral_weight || 0,

    valid_votes: row?.valid_votes,
    void_votes: row?.void_votes,
    blank_votes: row?.blank_votes,
    total_votes: row?.total_votes,

    recibed_ballots: row?.recibed_ballots,
    leftover_ballots: row?.leftover_ballots,
    total_ballots: row?.total_ballots,

    observations: row?.observations || "",
    detail: row?.detail || [],
    cover: null,
    image_url: row?.image_url || "",

    voters: row?.voters,
    jrv_votes: row?.jrv_votes,
    custodians: row?.custodians,
    total_voters: row?.total_voters,

    with_problems: row?.with_problems || false,
    problems: row?.problems || [],
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    // validate: validate,
    validationSchema: NewRecordSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const variables = getVariables(values);

        //console.info(variables);

        if (isEdit) {
          if (variables) {
            await updateRecord({ variables: variables });
          }
        } else {
          if (variables) {
            await createRecord({ variables: variables });
          }
        }

        enqueueSnackbar("El acta se guardo correctamente", {
          variant: "success",
        });
        navigate(PATH_DASHBOARD.records);

        setSubmitting(true);
      } catch (error: any) {
        setErrors({ afterSubmit: error.message });
        setSubmitting(false);
      }
    },
  });

  const {
    errors,
    handleSubmit,
    isSubmitting,
    submitCount,
    touched,
    setFieldValue,
    getFieldProps,
    values,
  } = formik;

  const [jrvByNumber, { loading: loadingJrv }] = useLazyQuery(JRV_BY_NUMBER, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (!data || data?.jrvByNumber?.length === 0) {
        setJrvExist(false);
        setJrv(initialJrv);
      } else {
        setJrv(data?.jrvByNumber[0]);
        setJrvExist(true);
        setFieldValue("jrv_id", data?.jrvByNumber[0]?.id || "");
        setFieldValue(
          "electoral_weight",
          data?.jrvByNumber[0]?.electoral_weight || 0
        );
      }

      let existRecord = false;

      if (data && data?.recordByNumberAndLevel) {
        existRecord = true;
        setFieldValue("record_id", data?.recordByNumberAndLevel?.id || "");
        setFieldValue(
          "image_url",
          data?.recordByNumberAndLevel?.image_url || ""
        );
      }

      if (!isEdit && existRecord) {
        setEnableSave(false);
      } else {
        setEnableSave(true);
      }
    },
  });

  const handleFindByNumber = useCallback(() => {
    setErrorValidate("");
    if (!values.jrv_number) {
      setErrorValidate("Debe especificar el numero de JRV");
      return;
    }

    if (!values.level) {
      setErrorValidate("Debe especificar el nivel electoral");
      return;
    }

    try {
      jrvByNumber({
        variables: { number: values.jrv_number, electoralLevel: values.level },
      });
    } catch (error) {
      console.log(`🐛 : `, error);
    }
  }, [jrvByNumber, values.jrv_number, values.level]);

  // const handleUploadFiles = async (files: any[]) => {
  //   try {
  //     const file = files[0];
  //     if (!file) return;

  //     const urlBase64 = await CompressImageFromInputFile(file);

  //     setFieldValue("image_url", urlBase64);
  //     setFieldValue("cover", file);
  //   } catch (error) {
  //     enqueueSnackbar("Could not upload image", { variant: "error" });
  //   }
  // };

  const errorsSummary = Object.values(errors).join(" | ");
  const disabledSave = !(canSave && enableSave);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el submit del formulario

      const form = event.currentTarget.form;
      if (!form) return;

      const index = Array.from(form.elements).indexOf(event.currentTarget);
      const nextElement = form.elements[index + 1] as HTMLElement;

      if (nextElement && "focus" in nextElement) {
        nextElement.focus();
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <FormikProvider value={formik}>
        <Form
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          onKeyDown={(e) => handleKeyDown(e)}
        >
          <HeaderBreadcrumbs
            heading={isEdit ? "Editar Acta" : "Registrar Nueva Acta"}
            links={[
              { name: "Inicio", href: PATH_DASHBOARD.root },
              { name: "List", href: PATH_DASHBOARD.records },
              {
                name: isEdit
                  ? toSafeString(values?.jrv_number) || ""
                  : "Nueva Acta",
              },
            ]}
            action={
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={disabledSave}
              >
                Guardar
              </LoadingButton>
            }
          />
          {submitCount > 0 &&
            touched &&
            !errors.afterSubmit &&
            errorsSummary && (
              <AlertMessage title="" type="error" message={errorsSummary} />
            )}
          {errors.afterSubmit && (
            <AlertMessage title="" type="error" message={errors.afterSubmit} />
          )}
          {!enableSave && (
            <AlertMessage
              message={"Ya existe un registro para esta acta y este nivel"}
              type="warning"
            />
          )}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "row", sm: "row" }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <TextField
                    fullWidth
                    placeholder="JRV #"
                    label="Numero de JRV"
                    {...getFieldProps("jrv_number")}
                    disabled={isEdit}
                    //onChange={debouncedChangeHandler}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: "number",
                    }}
                    //error={Boolean(submitCount > 0 && touched.stock && errors.stock)}
                    //helperText={submitCount > 0 && touched.stock && errors.stock}
                  />
                  <SelectLevel
                    value={values?.level}
                    disabled={isEdit}
                    onSelect={(value) => {
                      setFieldValue("level", value);
                    }}
                  />
                  <LoadingButton
                    loading={loadingJrv}
                    disabled={isEdit}
                    onClick={() => handleFindByNumber()}
                  >
                    Buscar
                  </LoadingButton>
                </Stack>
                {errorValidate && (
                  <AlertMessage message={errorValidate} type="warning" />
                )}
                {/* <Stack
                  direction={{ xs: "column", sm: "column" }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <UploadAvatar
                    accept="image/*"
                    file={values?.image_url}
                    onDropAccepted={handleUploadFiles}
                  />
                  {touched.image_url && errors.image_url && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {submitCount > 0 && touched.image_url && errors.image_url}
                    </FormHelperText>
                  )}
                  {values?.image_url && (
                    <ImagePreview image_url={values?.image_url || ""} />
                  )}
                </Stack> */}
              </Card>
            </Grid>
            <Grid container size="grow" direction="row"></Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              {values.level === "PRESIDENT" && <President formik={formik} />}

              {values.level === "MAYOR" && jrv?.municipality?.id && (
                <Mayor location_id={jrv.municipality.id} formik={formik} />
              )}

              {values.level === "CONGRESS" && <Congress formik={formik} />}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {jrvExist && (
                    <Stack
                      direction={{ xs: "column", sm: "column" }}
                      spacing={{ xs: 3, sm: 2 }}
                    >
                      <Typography>
                        Carga Elecotral:
                        <br /> {jrv?.electoral_weight}
                      </Typography>
                      <Typography>
                        Centro de Votacion:
                        <br /> {jrv?.voting_center.name}
                      </Typography>
                      <Typography>
                        Sector Elecotral:
                        <br /> {jrv?.voting_center.code} -{" "}
                        {jrv?.voting_center.electoral_sector}
                      </Typography>
                      <Typography>
                        Area:
                        <br /> {jrv?.voting_center.area}
                      </Typography>
                      <Typography>
                        Municipio:
                        <br /> {jrv?.municipality.code} -{" "}
                        {jrv?.municipality.name}
                      </Typography>
                      <Typography>
                        Departamento:
                        <br /> {jrv?.department.code} - {jrv?.department.name}
                      </Typography>
                    </Stack>
                  )}
                  {!jrvExist && (
                    <AlertMessage
                      title=""
                      message="No esta registrado este numero de JRV"
                      type="error"
                      multiline={false}
                    />
                  )}
                </Stack>
              </Card>
              {(values.level === "PRESIDENT" || values.level === "MAYOR") && (
                <Fragment>
                  <Ballots formik={formik} />
                  <Votes formik={formik} />
                </Fragment>
              )}
              {values.level === "CONGRESS" && <CongressVotes formik={formik} />}
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Container>
  );
};

export default FormRecord;
