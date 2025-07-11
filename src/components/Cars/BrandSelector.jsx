import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../store/carsSlice';
import { TEXTS } from '../../constants';

const BrandSelector = ({ 
  value = '', 
  onChange, 
  disabled = false, 
  required = false,
  label = TEXTS.CARS.SELECT_BRAND,
  fullWidth = true 
}) => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.cars);

  useEffect(() => {
    if (brands.length === 0 && !loading && !error) {
      dispatch(fetchBrands());
    }
  }, [dispatch, brands.length, loading, error]);

  const handleChange = (event) => {
    const selectedBrandId = event.target.value;
    const selectedBrand = brands.find(brand => brand.id === selectedBrandId);
    onChange && onChange(selectedBrandId, selectedBrand);
  };

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled || loading}>
      <InputLabel required={required}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>-- {TEXTS.CARS.SELECT_BRAND} --</em>
        </MenuItem>
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            {TEXTS.COMMON.LOADING}
          </MenuItem>
        )}
        {brands.map((brand) => (
          <MenuItem key={brand.id} value={brand.id}>
            {brand.brand_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BrandSelector;
