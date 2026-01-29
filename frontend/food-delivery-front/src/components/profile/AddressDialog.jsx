import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Country, State, City } from "country-state-city";

const validationSchema = Yup.object({
  street: Yup.string().required("Улица обязательна"),
  country: Yup.string().required("Выберите страну"),
  state: Yup.string().required("Выберите регион"),
  city: Yup.string().required("Выберите город"),
  zip: Yup.string()
    .matches(/^[0-9]+$/, "Только цифры")
    .min(5, "Минимум 5 цифр")
    .max(6, "Максимум 6 цифр")
    .nullable(),
});

const AddressDialog = ({ open, onClose, onSave, initialData }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountryInfo, setSelectedCountryInfo] = useState(null);
  const [selectedStateInfo, setSelectedStateInfo] = useState(null);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const formik = useFormik({
    initialValues: {
      street: "",
      city: "",
      zip: "",
      state: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        formik.setValues(initialData);
      } else {
        formik.resetForm();
        setStates([]);
        setCities([]);
        setSelectedCountryInfo(null);
        setSelectedStateInfo(null);
      }
    }
  }, [open, initialData]);

  const handleCountryChange = (event, value) => {
    if (value) {
      formik.setFieldValue("country", value.name);
      setSelectedCountryInfo(value);
      setStates(State.getStatesOfCountry(value.isoCode));
      setCities([]);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
      setSelectedStateInfo(null);
    } else {
      formik.setFieldValue("country", "");
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (event, value) => {
    if (value) {
      formik.setFieldValue("state", value.name);
      setSelectedStateInfo(value);
      setCities(
        City.getCitiesOfState(selectedCountryInfo.isoCode, value.isoCode)
      );
      formik.setFieldValue("city", "");
    } else {
      formik.setFieldValue("state", "");
      setCities([]);
    }
  };

  const handleCityChange = (event, value) => {
    if (value) {
      formik.setFieldValue("city", value.name);
    } else {
      formik.setFieldValue("city", "");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {initialData ? "Редактировать адрес" : "Новый адрес"}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              onChange={handleCountryChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Страна *"
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                />
              )}
            />

            <Autocomplete
              options={states}
              getOptionLabel={(option) => option.name}
              disabled={!selectedCountryInfo}
              onChange={handleStateChange}
              key={selectedCountryInfo?.isoCode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Регион / Область *"
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                />
              )}
            />

            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.name}
              disabled={!selectedStateInfo}
              onChange={handleCityChange}
              key={selectedStateInfo?.isoCode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Город *"
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
              )}
            />

            <TextField
              fullWidth
              name="street"
              label="Улица, дом, квартира *"
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.street && Boolean(formik.errors.street)}
              helperText={formik.touched.street && formik.errors.street}
            />

            <TextField
              fullWidth
              name="zip"
              label="Почтовый индекс (Zip)"
              value={formik.values.zip}
              onChange={formik.handleChange}
              error={formik.touched.zip && Boolean(formik.errors.zip)}
              helperText={formik.touched.zip && formik.errors.zip}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Отмена
          </Button>
          <Button type="submit" variant="contained" sx={{ px: 4 }}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddressDialog;
