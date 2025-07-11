import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrandModels } from '../../store/carsSlice';
import { TEXTS } from '../../constants';

const ModelSelector = ({ 
  value = '', 
  onChange, 
  brandId = null,
  disabled = false, 
  required = false,
  label = TEXTS.CARS.SELECT_MODEL,
  fullWidth = true 
}) => {
  const dispatch = useDispatch();
  const { brandModels, loading } = useSelector((state) => state.cars);

  const models = brandId ? (brandModels[brandId] || []) : [];

  useEffect(() => {
    if (brandId && !brandModels[brandId] && !loading) {
      dispatch(fetchBrandModels(brandId));
    }
  }, [dispatch, brandId, brandModels, loading]);

  const handleChange = (event) => {
    const selectedModelId = event.target.value;
    const selectedModel = models.find(model => model.id === selectedModelId);
    onChange && onChange(selectedModelId, selectedModel);
  };

  const isDisabled = disabled || loading || !brandId;

  return (
    <FormControl fullWidth={fullWidth} disabled={isDisabled}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>-- {brandId ? TEXTS.CARS.SELECT_MODEL : 'Najpierw wybierz markę'} --</em>
        </MenuItem>
        {loading && brandId && (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            {TEXTS.COMMON.LOADING}
          </MenuItem>
        )}
        {models.map((model) => (
          <MenuItem key={model.id} value={model.id}>
            {model.model_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ModelSelector;
