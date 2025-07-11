import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModelGenerations } from '../../store/carsSlice';
import { TEXTS } from '../../constants';

const GenerationSelector = ({ 
  value = '', 
  onChange, 
  modelId = null,
  disabled = false, 
  required = false,
  label = TEXTS.CARS.SELECT_GENERATION,
  fullWidth = true 
}) => {
  const dispatch = useDispatch();
  const { modelGenerations, loading } = useSelector((state) => state.cars);

  const generations = modelId ? (modelGenerations[modelId] || []) : [];

  useEffect(() => {
    if (modelId && !modelGenerations[modelId] && !loading) {
      dispatch(fetchModelGenerations(modelId));
    }
  }, [dispatch, modelId, modelGenerations, loading]);

  const handleChange = (event) => {
    const selectedGenerationId = event.target.value;
    const selectedGeneration = generations.find(gen => gen.id === selectedGenerationId);
    onChange && onChange(selectedGenerationId, selectedGeneration);
  };

  const isDisabled = disabled || loading || !modelId;

  return (
    <FormControl fullWidth={fullWidth} disabled={isDisabled}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>-- {modelId ? TEXTS.CARS.SELECT_GENERATION : 'Najpierw wybierz model'} --</em>
        </MenuItem>
        {loading && modelId && (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            {TEXTS.COMMON.LOADING}
          </MenuItem>
        )}
        {generations.map((generation) => (
          <MenuItem key={generation.id} value={generation.id}>
            {generation.generation} {generation.description && `(${generation.description})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default GenerationSelector;
